import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {Decimal} from "../../../decimal";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {decimalMapper} from "../../decimal/decimal-mapper";

/**
 * The return type being `DECIMAL` is intentional.
 */
const sumImpl = makeAggregateOperator2<OperatorType.AGGREGATE_SUM, boolean, bigint|null, Decimal|null>(
    OperatorType.AGGREGATE_SUM,
    decimalMapper.orNull(),
    TypeHint.BIGINT_SIGNED
);

/**
 * Returns the total sum of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_sum
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#sumunc
 *
 * -----
 *
 * + MySQL      : `SUM(DISTINCT x)`
 * + PostgreSQL : `SUM(DISTINCT x)`
 * + SQLite     : `SUM(DISTINCT x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 * + MySQL, PostgreSQL use `DECIMAL`
 * + SQLite throws on integer overflow
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const sumDistinct : AggregateOperator1<bigint|null, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

/**
 * Returns the total sum of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_sum
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#sumunc
 *
 * -----
 *
 * + MySQL      : `SUM(x)`
 * + PostgreSQL : `SUM(x)`
 * + SQLite     : `SUM(x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 * + MySQL, PostgreSQL use `DECIMAL`
 * + SQLite throws on integer overflow
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const sumAll : AggregateOperator1<bigint|null, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

/**
 * Returns the total sum of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_sum
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#sumunc
 *
 * -----
 *
 * + MySQL      : `SUM(x)`
 * + PostgreSQL : `SUM(x)`
 * + SQLite     : `SUM(x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 * + MySQL, PostgreSQL use `DECIMAL`
 * + SQLite throws on integer overflow
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const sum = sumAll;
