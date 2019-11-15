import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `COT(0)` throws error
 * + PostgreSQL : `COT(0)` === `NULL`
 */
export const cot = makeOperator1<OperatorType.COTANGENT, Decimal, Decimal|null>(
    OperatorType.COTANGENT,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
