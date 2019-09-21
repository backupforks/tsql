import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeUnaryOperator} from "../factory";

export const sqrt = makeUnaryOperator<OperatorType.SQUARE_ROOT, number, number>(
    OperatorType.SQUARE_ROOT,
    tm.mysql.double(),
    TypeHint.DOUBLE
);