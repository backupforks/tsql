import {FromClauseUtil} from "../../../from-clause";
import {ColumnUtil} from "../../../column";
import {Query} from "../../query-impl";
import {AfterFromClause} from "../helper-type";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WhereIsNullImpl<
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            FromClauseT["currentJoins"]
        >
    >,
    FromClauseT extends AfterFromClause["fromClause"],
    SelectClauseT extends AfterFromClause["selectClause"],
    LimitClauseT extends AfterFromClause["limitClause"],
    CompoundQueryClauseT extends AfterFromClause["compoundQueryClause"],
    CompoundQueryLimitClauseT extends AfterFromClause["compoundQueryLimitClause"],
> = (
    Query<{
        fromClause : FromClauseUtil.WhereIsNull<FromClauseT, ColumnT>,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
    }>
);
export type WhereIsNull<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >
> = (
    WhereIsNullImpl<
        ColumnT,
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
);
export function whereIsNull<
    QueryT extends AfterFromClause,
    ColumnT extends ColumnUtil.ExtractNullable<
        ColumnUtil.FromJoinArray<
            QueryT["fromClause"]["currentJoins"]
        >
    >
> (
    query : QueryT,
    whereIsNullDelegate : FromClauseUtil.WhereIsNullDelegate<
        QueryT["fromClause"],
        ColumnT
    >
) : (
    WhereIsNull<QueryT, ColumnT>
) {
    const {
        fromClause,
        whereClause,
    } = FromClauseUtil.whereIsNull<
        QueryT["fromClause"],
        ColumnT
    >(
        query.fromClause,
        query.whereClause,
        whereIsNullDelegate
    );

    const {
        //fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,

        groupByClause,
        havingClause,
        orderByClause,
        compoundQueryOrderByClause,
    } = query;

    const result : WhereIsNull<QueryT, ColumnT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
        },
        {
            whereClause,
            groupByClause,
            havingClause,
            orderByClause,
            compoundQueryOrderByClause,
        }
    );
    return result;
}
