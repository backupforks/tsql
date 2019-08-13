import {IFromClause} from "../../from-clause";
import {JoinArrayUtil} from "../../../join";
import {AfterFromClause, Correlated} from "../helper-type";
import {WhereClause, WhereClauseUtil} from "../../../where-clause";
import {EqPrimaryKeyOfTable} from "../../../expr-library";
import {JoinMapUtil} from "../../../join-map";
import {TableUtil} from "../../../table";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryPrimaryKeyImpl<
    OuterQueryJoinsT extends AfterFromClause["outerQueryJoins"],
    CurrentJoinsT extends AfterFromClause["currentJoins"],
> = (
    IFromClause<{
        outerQueryJoins : OuterQueryJoinsT,
        currentJoins : CurrentJoinsT,
    }>
);
/**
 * @todo Consider making `nullable` joins non-nullable when
 * used with `whereEqPrimaryKey()`
 *
 * Not a priority because people should not usually
 * write such a query.
 *
 * -----
 *
 * Assume `tableB.tableBId` is the primary key of `tableB`.
 *
 * Normally, `tableB` should be `nullable` in the following query,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA
 *  WHERE
 *      (
 *          SELECT
 *              myBooleanColumn
 *          FROM
 *              tableA2
 *          LEFT JOIN
 *              tableB
 *          ON
 *              tableA2.tableBId <=> tableB.tableBId
 *      )
 * ```
 *
 * However, `tableB` should not be `nullable` in the following query,
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      tableA
 *  WHERE
 *      (
 *          SELECT
 *              myBooleanColumn
 *          FROM
 *              tableA2
 *          LEFT JOIN
 *              tableB
 *          ON
 *              tableA2.tableBId <=> tableB.tableBId
 *          WHERE
 *              tableB.tableBId = 1
 *      )
 * ```
 */
export type WhereEqOuterQueryPrimaryKey<
    FromClauseT extends AfterFromClause
> = (
    WhereEqOuterQueryPrimaryKeyImpl<
        FromClauseT["outerQueryJoins"],
        FromClauseT["currentJoins"]
    >
);
/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryPrimaryKeySrcDelegateImpl<
    SrcT extends CurrentJoinsT[number],
    CurrentJoinsT extends AfterFromClause["currentJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<CurrentJoinsT>
    ) => SrcT
);
export type WhereEqOuterQueryPrimaryKeySrcDelegate<
    FromClauseT extends Pick<AfterFromClause, "currentJoins">,
    SrcT extends FromClauseT["currentJoins"][number]
> = (
    WhereEqOuterQueryPrimaryKeySrcDelegateImpl<
        SrcT,
        FromClauseT["currentJoins"]
    >
);
/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereEqOuterQueryPrimaryKeyDstDelegateImpl<
    SrcT extends CurrentJoinsT[number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<OuterQueryJoinsT, SrcT["columns"]>,
    CurrentJoinsT extends AfterFromClause["currentJoins"],
    OuterQueryJoinsT extends Correlated["outerQueryJoins"]
> = (
    (
        /**
         * Is called `tables` but is really a map of joins
         */
        tables : JoinMapUtil.FromJoinArray<
            JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<OuterQueryJoinsT, SrcT["columns"]>[]
        >
    ) => DstT
);
export type WhereEqOuterQueryPrimaryKeyDstDelegate<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["outerQueryJoins"], SrcT["columns"]>
> = (
    WhereEqOuterQueryPrimaryKeyDstDelegateImpl<
        SrcT,
        DstT,
        FromClauseT["currentJoins"],
        FromClauseT["outerQueryJoins"]
    >
);
/**
 * Convenience function for,
 * ```ts
 *  myQuery
 *      .where(() => tsql.eqPrimaryKeyOfTable(
 *          currentQueryTable,
 *          outerQueryTable
 *      ));
 * ```
 * -----
 *
 * + The `currentQueryTable` does not need to have keys.
 * + The `outerQueryTable` must have a primary key.
 * + The `currentQueryTable` must have columns comparable to columns of `outerQueryTable`'s primary key.
 */
export function whereEqOuterQueryPrimaryKey<
    FromClauseT extends (Correlated & AfterFromClause),
    SrcT extends FromClauseT["currentJoins"][number],
    DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["outerQueryJoins"], SrcT["columns"]>
> (
    fromClause : FromClauseT,
    whereClause : WhereClause|undefined,
    eqPrimaryKeyOfTable : EqPrimaryKeyOfTable,
    /**
     * This construction effectively makes it impossible for
     * `WhereEqOuterQueryPrimaryKeySrcDelegate<>`,
     * `WhereEqOuterQueryPrimaryKeyDstDelegate<>`
     * to return a union type.
     *
     * This is unfortunate but a necessary compromise for now.
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
     *
     * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
     */
    ...args : (
        SrcT extends FromClauseT["currentJoins"][number] ?
        (
            DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<FromClauseT["outerQueryJoins"], SrcT["columns"]> ?
            [
                WhereEqOuterQueryPrimaryKeySrcDelegate<FromClauseT, SrcT>,
                WhereEqOuterQueryPrimaryKeyDstDelegate<
                    FromClauseT,
                    SrcT,
                    DstT
                >
            ] :
            never
        ) :
        never
    )
) : (
    {
        fromClause : WhereEqOuterQueryPrimaryKey<FromClauseT>,
        whereClause : WhereClause,
    }
) {
    const srcDelegate = args[0] as WhereEqOuterQueryPrimaryKeySrcDelegate<FromClauseT, SrcT>;
    /**
     * @todo Investigate assignability
     */
    const dstDelegate = args[1] as unknown as WhereEqOuterQueryPrimaryKeyDstDelegate<
        FromClauseT,
        SrcT,
        DstT
    >;

    const src : SrcT = srcDelegate(
        JoinMapUtil.fromJoinArray<FromClauseT["currentJoins"]>(
            fromClause.currentJoins
        )
    ) as SrcT;
    const dst : DstT = dstDelegate(
        /**
         * @todo Investigate assignability
         */
        JoinMapUtil.fromJoinArray(
            JoinArrayUtil.extractWithNullSafeComparablePrimaryKey<FromClauseT["currentJoins"], SrcT["columns"]>(
                fromClause.currentJoins,
                src.columns
            )
        ) as any
    ) as DstT;

    const result : (
        {
            fromClause : WhereEqOuterQueryPrimaryKey<FromClauseT>,
            whereClause : WhereClause,
        }
    ) = {
        fromClause,
        whereClause : WhereClauseUtil.where<FromClauseT>(
            fromClause,
            whereClause,
            /**
             * @todo Investigate assignability
             */
            () => eqPrimaryKeyOfTable<SrcT, DstT>(
                src,
                dst as (
                    & DstT
                    & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
                )
            ) as any
        ),
    };
    return result;
}
