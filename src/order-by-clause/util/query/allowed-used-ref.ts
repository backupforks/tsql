import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {ColumnRefUtil, ColumnRef} from "../../../column-ref";
import {UsedRefUtil} from "../../../used-ref";
import {IJoin} from "../../../join";

/**
 * They will change when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 *
 * @todo You should be able to `ORDER BY` columns in the `SELECT` clause
 * ```sql
 *  SELECT
 *      *,
 *      RAND() AS r
 *  FROM
 *      myTable
 *  ORDER BY
 *      r --This is valid
 * ```
 *
 * SQLite does not allow outer query columns to be referenced in the `ORDER BY` clause.
 * https://stackoverflow.com/questions/59982992/order-by-cannot-reference-outer-query-column
 */
export type AllowedColumnRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> = (
    ColumnRefUtil.Intersect<
        /**
         * We know these will never be aggregate expressions
         */
        ColumnRefUtil.FromJoinArray<
            FromClauseT["currentJoins"] extends readonly IJoin[] ?
            FromClauseT["currentJoins"] :
            []
        >,
        (
            SelectClauseT extends SelectClause ?
            /**
             * May possibly contain aggregate expressions,
             * if they are `$aliased`
             */
            ColumnRefUtil.FromSelectClause<SelectClauseT> :
            {}
        )
    >
);
/**
 * They change diverge when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 */
export type AllowedUsedRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> = (
    UsedRefUtil.FromColumnRef<AllowedColumnRef<FromClauseT, SelectClauseT>>
);
/**
 * For now, this is basically the same as `HavingClauseUtil.AllowedColumnRef<>`.
 *
 * They will diverge when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 */
export function allowedColumnRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT
) : (
    AllowedColumnRef<FromClauseT, SelectClauseT>
) {
    const fromClauseColumns = ColumnRefUtil.fromJoinArray(
        (fromClause.currentJoins != undefined) ?
        fromClause.currentJoins :
        []
    );
    const selectClauseColumns = (
        selectClause == undefined ?
        {} :
        ColumnRefUtil.fromSelectClause(selectClause as Exclude<SelectClauseT, undefined>)
    );
    const result = ColumnRefUtil.intersect(
        fromClauseColumns,
        selectClauseColumns
    ) as ColumnRef as AllowedColumnRef<FromClauseT, SelectClauseT>;
    return result;
}

/**
 * For now, this is basically the same as `HavingClauseUtil.AllowedUsedRef<>`.
 *
 * They will diverge when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 */
export function allowedUsedRef<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT
) : (
    AllowedUsedRef<FromClauseT, SelectClauseT>
) {
    const usedRef = UsedRefUtil.fromColumnRef(
        allowedColumnRef<FromClauseT, SelectClauseT>(fromClause, selectClause)
    );
    return usedRef;
}
