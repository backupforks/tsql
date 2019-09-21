import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeIdempotentUnaryOperator} from "../factory";

/**
 * This function is idempotent.
 * `ROUND(ROUND(x)) == ROUND(x)`
 */
export const round = makeIdempotentUnaryOperator<OperatorType.ROUND, number, number>(
    OperatorType.ROUND,
    tm.mysql.double(),
    TypeHint.DOUBLE
);