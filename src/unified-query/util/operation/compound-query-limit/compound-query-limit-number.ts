import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type CompoundQueryLimitNumberImpl<
    FromClauseT extends IQuery["fromClause"],
    SelectClauseT extends IQuery["selectClause"],
    LimitClauseT extends IQuery["limitClause"],
    CompoundQueryClauseT extends IQuery["compoundQueryClause"],
    CompoundQueryLimitClauseT extends IQuery["compoundQueryLimitClause"],
> =
    Query<{
        fromClause : FromClauseT,
        selectClause : SelectClauseT,

        limitClause : LimitClauseT,

        compoundQueryClause : CompoundQueryClauseT,
        compoundQueryLimitClause : LimitClauseUtil.LimitNumber<
            CompoundQueryLimitClauseT
        >,
    }>
;
export type CompoundQueryLimitNumber<
    QueryT extends IQuery
> =
    CompoundQueryLimitNumberImpl<
        QueryT["fromClause"],
        QueryT["selectClause"],
        QueryT["limitClause"],
        QueryT["compoundQueryClause"],
        QueryT["compoundQueryLimitClause"]
    >
;
