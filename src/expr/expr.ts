import * as tm from "type-mapping";
import {Ast, parentheses} from "../ast";
import {ColumnMap} from "../column-map";
import {ColumnRef} from "../column-ref";
import {SortDirection} from "../sort-direction";
import * as ExprUtil from "./util";

export interface ExprData {
    readonly usedRef : ColumnRef;
    readonly mapper : tm.SafeMapper<any>;
}

export interface IExpr<DataT extends ExprData=ExprData> {
    /**
     * The columns used by this expression.
     * ```sql
     * SELECT
     *  --The `usedRef` of this expression are the two columns involved
     *  (myTable.myColumn + otherTable.otherColumn)
     * FROM
     *  myTable
     * JOIN
     *  otherTable
     * ON
     *  myTable.id = otherTable.id
     * ```
     */
    readonly usedRef : DataT["usedRef"];
    /**
     * The mapper that validates/converts raw values for use
     */
    readonly mapper : DataT["mapper"];

    /**
     * The AST of the expression
     */
    readonly ast : Ast;
}

export class Expr<DataT extends ExprData> implements IExpr<DataT> {
    readonly usedRef : DataT["usedRef"];
    readonly mapper : DataT["mapper"];

    readonly ast : Ast;

    public constructor (
        data : DataT,
        ast : Ast
    ) {
        this.usedRef = data.usedRef;
        this.mapper = data.mapper;

        //Gotta' play it safe.
        //We want to preserve the order of operations.
        this.ast = parentheses(ast);
    }

    /**
     * If you are running into "max instantiation depth" errors,
     * consider adding explicit `TableExpr<>` type annotations.
     *
     * If that doesn't help,
     * consider using `ExprUtil.as()` instead.
     *
     * Also, consider reading this to understand my frustration,
     * https://github.com/microsoft/TypeScript/issues/29511
     *
     * @param alias
     */
    as = <AliasT extends string> (
        alias : AliasT
    ) : ExprUtil.As<this, AliasT> => {
    //) : ExprUtil.As<DataT & {ast : Ast}, AliasT> {
        return ExprUtil.as(this, alias);
    }

    /**
     * ```sql
     * ORDER BY
     *  RAND() ASC
     * ```
     */
    asc = () : ExprUtil.Asc<this> => {
        return ExprUtil.asc(this);
    }
    /**
     * ```sql
     * ORDER BY
     *  RAND() DESC
     * ```
     */
    desc = () : ExprUtil.Desc<this> => {
        return ExprUtil.desc(this);
    }
    /**
     * ```sql
     * ORDER BY
     *  (myTable.myColumn IS NOT NULL) ASC,
     *  RAND() DESC
     * ```
     */
    sort = (sortDirection : SortDirection) : ExprUtil.Sort<this> => {
        return ExprUtil.sort(this, sortDirection);
    }
}

export type IAnonymousExpr<TypeT> = (
    IExpr<{
        usedRef : ColumnRef,
        mapper : tm.SafeMapper<TypeT>
    }>
);

/**
 * This is useful for avoiding "max instantiation depth" problems.
 * It also speeds up type checking.
 *
 * As much as possible, **DO NOT** let `tsc/tsserver` infer
 * the type of `expr`.
 *
 * Just bite the bullet and add these explicit type annotations.
 *
 * Example:
 *
 * ```ts
 * const expr : orm.TableExpr<typeof myTable, bigint> = (
 *  orm.requireParentJoins(myTable)
 *      .from(otherTable)
 *      .where(c => orm.eq(c.myTable.myColumn, c.otherTable.otherColumn))
 *      .select(c => [otherTable.amount])
 *      .limit(1)
 *      .coalesce(null)
 * );
 * ```
 *
 * Or,
 * ```ts
 * function amount () : orm.TableExpr<typeof myTable, bigint> {
 *  return orm.requireParentJoins(myTable)
 *      .from(otherTable)
 *      .where(c => orm.eq(c.myTable.myColumn, c.otherTable.otherColumn))
 *      .select(c => [otherTable.amount])
 *      .limit(1)
 *      .coalesce(null)
 * }
 * ```
 */
export type TableExpr<
    TableT extends { alias : string, columns : ColumnMap },
    TypeT
> = Expr<{
    /**
     * @todo Change this to `ColumnRefUtil.FromTable<>` ?
     */
    usedRef : {
        [alias in TableT["alias"]] : TableT["columns"]
    },
    mapper : tm.SafeMapper<TypeT>
}>;
