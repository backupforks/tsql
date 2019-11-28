import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../raw-expr";
import {BuiltInValueExpr, BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {UsedRefUtil, IUsedRef} from "../../../used-ref";
import {ExprUtil} from "../../../expr";
import {IColumn, ColumnUtil} from "../../../column";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {IQueryBase, QueryBaseUtil} from "../../../query-base";

/**
 * Conditional types seem to reduce the amount of nesting allowed
 * before hitting the max instantiation depth.
 *
 * @todo Refactor this to not require conditional types?
 * Seems impossible.
 */
export type UsedRef<BuiltInExprT extends AnyBuiltInExpr|IQueryBase> = (
    /**
     * This implementation is the same as the implementation commented out below.
     * For some reason, this implementation is more efficient in terms of instantiation depth used.
     */
    | Extract<
        Exclude<
            BuiltInExprT,
            (
                | BuiltInValueExpr
                | IColumn
                | IQueryBase
            )
        >["usedRef"],
        IUsedRef
    >
    | (
        BuiltInExprT extends IColumn ?
        UsedRefUtil.FromColumn<BuiltInExprT> :
        BuiltInExprT extends IQueryBase ?
        UsedRefUtil.FromFromClause<BuiltInExprT["fromClause"]> :
        BuiltInExprT extends BuiltInValueExpr ?
        IUsedRef<{}> :
        never
    )
    /*BuiltInExprT extends BuiltInValueExpr ?
    IUsedRef<{}> :
    BuiltInExprT extends IExpr ?
    BuiltInExprT["usedRef"] :
    BuiltInExprT extends IColumn ?
    UsedRefUtil.FromColumn<BuiltInExprT> :
    BuiltInExprT extends IQueryBase ?
    UsedRefUtil.FromFromClause<BuiltInExprT["fromClause"]> :
    BuiltInExprT extends IExprSelectItem ?
    BuiltInExprT["usedRef"] :
    never*/
);
export function usedRef<BuiltInExprT extends AnyBuiltInExpr|IQueryBase> (
    rawExpr : BuiltInExprT
) : (
    UsedRef<BuiltInExprT>
) {
    //Check built-in cases first
    if (BuiltInValueExprUtil.isBuiltInValueExpr(rawExpr)) {
        return UsedRefUtil.fromColumnRef({}) as UsedRef<BuiltInExprT>;
    }

    if (ExprUtil.isExpr(rawExpr)) {
        return rawExpr.usedRef as UsedRef<BuiltInExprT>;
    }

    if (ColumnUtil.isColumn(rawExpr)) {
        return UsedRefUtil.fromColumn(rawExpr) as UsedRef<BuiltInExprT>;
    }

    if (QueryBaseUtil.isQuery(rawExpr)) {
        return UsedRefUtil.fromFromClause(rawExpr.fromClause) as UsedRef<BuiltInExprT>;
    }

    if (ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        return rawExpr.usedRef as UsedRef<BuiltInExprT>;
    }

    throw new Error(`Unknown rawExpr ${tm.TypeUtil.toTypeStr(rawExpr)}`);
}
