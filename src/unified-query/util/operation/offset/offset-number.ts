import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type OffsetNumberImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
    MapDelegateT extends IQuery["mapDelegate"],
    GroupByClauseT extends IQuery["groupByClause"],
> = (
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseUtil.OffsetNumber<
            LimitClauseT
        >,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : CompoundQueryLimitClauseT,
        mapDelegate : MapDelegateT,
        groupByClause : GroupByClauseT,
    }>
);
export type OffsetNumber<
    QueryT extends IQuery
> = (
    OffsetNumberImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"],
        QueryT["mapDelegate"],
        QueryT["groupByClause"]
    >
);
