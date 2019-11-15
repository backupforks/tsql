import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `SQRT(-5)` === `null`
 * + PostgreSQL : `SQRT(-5)` throws error
 */
export const sqrt = makeOperator1<OperatorType.SQUARE_ROOT, Decimal, Decimal|null>(
    OperatorType.SQUARE_ROOT,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
