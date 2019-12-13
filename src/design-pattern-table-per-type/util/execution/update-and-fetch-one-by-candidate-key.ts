import * as tm from "type-mapping";
import {ITablePerType} from "../../table-per-type";
import {CandidateKey_NonUnion} from "../../../candidate-key";
import {StrictUnion, Identity, pickOwnEnumerable} from "../../../type-util";
import {IsolableUpdateConnection, ExecutionUtil} from "../../../execution";
import {MutableColumnAlias, ColumnType, ColumnAlias, columnMapper, isMutableColumnAlias} from "../query";
import {CustomExpr_MapCorrelatedOrUndefined, CustomExprUtil} from "../../../custom-expr";
import {ColumnRefUtil} from "../../../column-ref";
import {ColumnUtil, ColumnArrayUtil} from "../../../column";
import {from} from "../execution-impl";
import * as ExprLib from "../../../expr-library";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {ExprUtil, expr} from "../../../expr";
import {TableWithPrimaryKey} from "../../../table";
import {UpdateOneResult} from "../../../execution/util";
import {absorbRow} from "./absorb-row";

export type CustomAssignmentMap<
    TptT extends ITablePerType
> =
    Identity<
        & {
            readonly [columnAlias in MutableColumnAlias<TptT>]? : (
                CustomExpr_MapCorrelatedOrUndefined<
                    (
                        | TptT["childTable"]["columns"]
                        | TptT["parentTables"][number]["columns"]
                    ),
                    ColumnType<TptT, columnAlias>
                >
            )
        }
        & {
            readonly [
                columnAlias in Exclude<
                    ColumnAlias<TptT>,
                    MutableColumnAlias<TptT>
                >
            ]? : undefined
        }
    >
;

export type AssignmentMapDelegate<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    (
        columns : ColumnRefUtil.FromColumnArray<
            ColumnUtil.FromColumnMap<
                | TptT["childTable"]["columns"]
                | TptT["parentTables"][number]["columns"]
            >[]
        >
    ) => AssignmentMapT
;

export type UpdatedAndFetchedRow<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    Identity<{
        readonly [columnAlias in ColumnAlias<TptT>] : (
            columnAlias extends keyof AssignmentMapT ?
            (
                undefined extends AssignmentMapT[columnAlias] ?
                ColumnType<TptT, columnAlias> :
                CustomExprUtil.TypeOf<
                    AssignmentMapT[columnAlias]
                >
            ) :
            ColumnType<TptT, columnAlias>
        )
    }>
;

export interface UpdateAndFetchOneResult<RowT> {
    updateOneResults : (
        & UpdateOneResult
        & {
            table : TableWithPrimaryKey,
        }
    )[],

    //Alias for affectedRows
    foundRowCount : bigint;

    /**
     * You cannot trust this number for SQLite.
     * SQLite thinks that all found rows are updated, even if you set `x = x`.
     *
     * @todo Consider renaming this to `unreliableUpdatedRowCount`?
     */
    //Alias for changedRows
    updatedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;

    row : RowT,
}

export type UpdateAndFetchOneReturnType<
    TptT extends ITablePerType,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> =
    Identity<
        UpdateAndFetchOneResult<
            UpdatedAndFetchedRow<TptT, AssignmentMapT>
        >
    >
;

export async function updateAndFetchOneByCandidateKey<
    TptT extends ITablePerType,
    CandidateKeyT extends StrictUnion<CandidateKey_NonUnion<TptT["childTable"]>>,
    AssignmentMapT extends CustomAssignmentMap<TptT>
> (
    tpt : TptT,
    connection : IsolableUpdateConnection,
    /**
     * @todo Try and recall why I wanted `AssertNonUnion<>`
     * I didn't write compile-time tests for it...
     */
    candidateKey : CandidateKeyT,// & AssertNonUnion<CandidateKeyT>,
    assignmentMapDelegate : AssignmentMapDelegate<TptT, AssignmentMapT>
) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> {
    const columns = ColumnRefUtil.fromColumnArray<
        ColumnUtil.FromColumnMap<
            | TptT["childTable"]["columns"]
            | TptT["parentTables"][number]["columns"]
        >[]
    >(
        ColumnArrayUtil.fromColumnMapArray<
            | TptT["childTable"]["columns"]
            | TptT["parentTables"][number]["columns"]
        >(
            [
                tpt.childTable.columns,
                ...tpt.parentTables.map(parentTable => parentTable.columns)
            ]
        )
    );
    /**
     * May contain extra properties that are not mutable columns,
     * or even columns at all.
     */
    const rawAssignmentMap = assignmentMapDelegate(columns);

    return connection.transactionIfNotInOne(async (connection) : Promise<UpdateAndFetchOneReturnType<TptT, AssignmentMapT>> => {
        let processedAssignmentMap : Record<string, unknown>|undefined = undefined;
        if (Object.keys(rawAssignmentMap).length == 0) {
            processedAssignmentMap = {};
        } else {
            const query = from(tpt)
                .where(() => ExprLib.eqCandidateKey(
                    tpt.childTable,
                    candidateKey
                ) as any)
                .select(() => Object
                    .keys(rawAssignmentMap)
                    .filter(columnAlias => isMutableColumnAlias(tpt, columnAlias))
                    .map(columnAlias => {
                        const customExpr = rawAssignmentMap[columnAlias as keyof typeof rawAssignmentMap] as any;
                        if (BuiltInExprUtil.isAnyNonValueExpr(customExpr)) {
                            /**
                             * We have a non-value expression
                             */
                            return expr(
                                {
                                    mapper : columnMapper(tpt, columnAlias),
                                    usedRef : BuiltInExprUtil.usedRef(customExpr),
                                },
                                BuiltInExprUtil.buildAst(customExpr)
                            ).as(columnAlias);
                        } else {
                            /**
                             * We have a value expression
                             */
                            return ExprUtil.fromRawExprNoUsedRefInput(
                                columnMapper(tpt, columnAlias),
                                customExpr
                            ).as(columnAlias);
                        }
                    }) as any
                );
            /**
             * Should only contain value expressions now.
             */
            processedAssignmentMap = await ExecutionUtil.fetchOne(
                query as any,
                connection
            ) as Record<string, unknown>;
        }

        const cleanedAssignmentMap = processedAssignmentMap;

        /**
         * @todo If `result` contains any primaryKey values,
         * then we will need to fetch the **current** primaryKey values,
         * before any `UPDATE` statements are executed.
         *
         * This function breaks if we try to update values
         * of columns that are foreign keys.
         *
         * I do not want to disable foreign key checks.
         */
        const updateAndFetchChildResult = await ExecutionUtil.updateAndFetchOneByCandidateKey(
            tpt.childTable,
            connection,
            candidateKey,
            () => pickOwnEnumerable(
                cleanedAssignmentMap,
                tpt.childTable.mutableColumns
            )
        );
        const updateOneResults : UpdateAndFetchOneResult<any>["updateOneResults"] = [
            {
                ...updateAndFetchChildResult,
                table : tpt.childTable,
            },
        ];
        let updatedRowCount : bigint = updateAndFetchChildResult.updatedRowCount;
        let warningCount : bigint = updateAndFetchChildResult.warningCount;

        const result : Record<string, unknown> = updateAndFetchChildResult.row;

        /**
         * We use `.reverse()` here to `UPDATE` the parents
         * as we go up the inheritance hierarchy.
         */
        for(const parentTable of [...tpt.parentTables].reverse()) {
            const updateAndFetchParentResult = await ExecutionUtil.updateAndFetchOneByPrimaryKey(
                parentTable,
                connection,
                /**
                 * The `result` should contain the primary key values we are interested in
                 */
                result,
                () => pickOwnEnumerable(
                    cleanedAssignmentMap,
                    parentTable.mutableColumns
                )
            );
            updateOneResults.push({
                ...updateAndFetchParentResult,
                table : parentTable,
            });
            updatedRowCount = tm.BigIntUtil.add(
                updatedRowCount,
                updateAndFetchParentResult.updatedRowCount
            );
            warningCount = tm.BigIntUtil.add(
                warningCount,
                updateAndFetchParentResult.warningCount
            );

            absorbRow(result, parentTable, updateAndFetchParentResult.row);
        }

        return {
            updateOneResults,
            /**
             * +1 for the `childTable`.
             */
            foundRowCount : tm.BigInt(tpt.parentTables.length + 1),
            updatedRowCount,

            warningCount,

            row : result as UpdatedAndFetchedRow<TptT, AssignmentMapT>,
        };
    });
}
