import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {NonNullComparableType} from "../../comparable-type";
import {makeOperator1ToN} from "./make-operator-1-to-n";
import {BaseType} from "../../type-util";

export type Comparison1ToNReturn<
    Arg0T extends BuiltInExpr<NonNullComparableType>,
    ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
> =
    ExprUtil.Intersect<
        boolean,
        Arg0T|ArgsT[number]
    >
;
export type Comparison1ToN =
    <
        Arg0T extends BuiltInExpr<NonNullComparableType>,
        ArgsT extends readonly BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<Arg0T>>>[]
    > (
        arg0 : Arg0T,
        ...args : ArgsT
    ) => (
        Comparison1ToNReturn<Arg0T, ArgsT>
    )
;

export function makeComparison1ToN<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1ToN<OperatorTypeT>,
    typeHint? : TypeHint
) : (
    Comparison1ToN
) {
    return makeOperator1ToN<OperatorTypeT, any, boolean>(
        operatorType,
        tm.mysql.boolean(),
        typeHint
    );
}
