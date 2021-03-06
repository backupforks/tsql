import {decimalMapper} from "../decimal-mapper";
import {Decimal} from "../../../decimal";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1, AggregateOperator1} from "../../aggregate-factory";

/**
 * Returns the min value of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_min
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_corefunc.html#minoreunc
 *
 * -----
 *
 * + MySQL      : `MIN(x)`
 * + PostgreSQL : `MIN(x)`
 * + SQLite     : `MIN(x)`
 */
export const min : AggregateOperator1<Decimal|null, Decimal|null> = makeAggregateOperator1<OperatorType.AGGREGATE_MIN, Decimal|null, Decimal|null>(
    OperatorType.AGGREGATE_MIN,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
