import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../../built-in-expr";
import {ExprImpl, expr} from "../../../expr/expr-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {CaseValueNode} from "../../../ast";
import {CaseValueBuilder} from "./case-value";
import {NonNullEquatableType, EquatableType, EquatableTypeUtil} from "../../../equatable-type";

/**
 * Workaround for,
 * https://github.com/microsoft/TypeScript/issues/33573
 */
declare global {
    interface ReadonlyArray<T> {
        concat (
            this : readonly [T, ...T[]],
            ...items: (T | ConcatArray<T>)[]
        ) : ([T, ...T[]])
    }
    interface Array<T> {
        concat (
            this : readonly [T, ...T[]],
            ...items: (T | ConcatArray<T>)[]
        ) : ([T, ...T[]])
    }
}

export class CaseValueBuilderImpl<
    ValueT extends NonNullEquatableType,
    ResultT extends EquatableType,
    UsedRefT extends IUsedRef
> implements CaseValueBuilder<ValueT, ResultT, UsedRefT> {
    private readonly resultMappers : readonly tm.SafeMapper<ResultT>[];
    private readonly usedRef : UsedRefT;
    private readonly ast : CaseValueNode;

    constructor (
        resultMappers : tm.SafeMapper<ResultT>[],
        usedRef : UsedRefT,
        ast : CaseValueNode,
    ) {
        this.resultMappers = resultMappers;
        this.usedRef = usedRef;
        this.ast = ast;
    }

    when<
        CompareValueT extends BuiltInExpr<ValueT>,
        ThenT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        compareValue : CompareValueT,
        then : ThenT
    ) : (
        CaseValueBuilder<
            ValueT,
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >
    ) {
        return new CaseValueBuilderImpl<
            ValueT,
            ResultT|BuiltInExprUtil.TypeOf<ThenT>,
            UsedRefUtil.IntersectTryReuseExistingType<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >
        >(
            [...this.resultMappers, BuiltInExprUtil.mapper(then)],
            UsedRefUtil.intersect<
                | UsedRefT
                | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
            >(
                this.usedRef,
                BuiltInExprUtil.intersectUsedRef<
                    (CompareValueT|ThenT)[]
                >(compareValue, then)
            ) as any,
            {
                type : "CaseValue",
                value : this.ast.value,
                /**
                 * https://github.com/microsoft/TypeScript/issues/33573
                 */
                cases : this.ast.cases.concat([
                    [
                        BuiltInExprUtil.buildAst(compareValue),
                        BuiltInExprUtil.buildAst(then)
                    ]
                ]),
                else : this.ast.else,
            }
        ) as (
            /**
             * @todo Investigate type instantiation exessively deep error
             */
            CaseValueBuilder<
                ValueT,
                ResultT|BuiltInExprUtil.TypeOf<ThenT>,
                UsedRefUtil.IntersectTryReuseExistingType<
                    | UsedRefT
                    | BuiltInExprUtil.IntersectUsedRef<CompareValueT|ThenT>
                >
            >
        );
    }
    end () : ExprImpl<ResultT|null, UsedRefT> {
        return expr(
            {
                mapper : tm.unsafeOr(...this.resultMappers, tm.null()),
                usedRef : this.usedRef,
            },
            this.ast
        );
    }
    else<
        ElseT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<ResultT>|null>
    > (
        elseResult : ElseT
    ) : (
        {
            end () : ExprImpl<
                ResultT|BuiltInExprUtil.TypeOf<ElseT>,
                UsedRefUtil.Intersect<
                    | UsedRefT
                    | BuiltInExprUtil.UsedRef<ElseT>
                >
            >
        }
    ) {
        const end = () : ExprImpl<
            ResultT|BuiltInExprUtil.TypeOf<ElseT>,
            UsedRefUtil.Intersect<
                | UsedRefT
                | BuiltInExprUtil.UsedRef<ElseT>
            >
        > => {
            return expr(
                {
                    mapper : tm.unsafeOr(...this.resultMappers, BuiltInExprUtil.mapper(elseResult)),
                    usedRef : UsedRefUtil.intersect<
                        | UsedRefT
                        | BuiltInExprUtil.UsedRef<ElseT>
                    >(
                        this.usedRef,
                        BuiltInExprUtil.usedRef(elseResult)
                    ),
                },
                {
                    ...this.ast,
                    else : BuiltInExprUtil.buildAst(elseResult),
                }
            );
        };
        return {
            end,
        };
    }
}
