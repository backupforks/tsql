import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1, Operator1} from "../factory";

/**
 * + MySQL      : `LOG2(0)` === `NULL`
 * + PostgreSQL : `LOG(2, 0)` throws error
 */
export const log2 : Operator1<Decimal, Decimal|null> = makeOperator1<OperatorType.LOG2, Decimal, Decimal|null>(
    OperatorType.LOG2,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
