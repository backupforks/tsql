import {makeTernaryComparison, TernaryComparison} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_not-between
 *
 * This version of the `NOT BETWEEN ... AND` operator prevents `NULL`.
 *
 * For null-safe checks, @see {@link nullSafeNotBetween}
 *
 */
export const notBetween : TernaryComparison = makeTernaryComparison(
    OperatorType.NOT_BETWEEN_AND
);
