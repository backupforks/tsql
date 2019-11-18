import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

export const literal3Is7 = tsql.DataTypeUtil.makeDataType(
    tsql.dtBigIntSigned(),
    value => {
        if (tm.BigIntUtil.equal(value, tm.BigInt(3))) {
            return tm.BigInt(7);
        } else {
            return value;
        }
    },
    (a, b) => {
        if (tm.BigIntUtil.equal(a, b)) {
            return true;
        }
        if (
            tm.BigIntUtil.equal(a, tm.BigInt(3)) &&
            tm.BigIntUtil.equal(b, tm.BigInt(7))
        ) {
            return true;
        }
        if (
            tm.BigIntUtil.equal(a, tm.BigInt(7)) &&
            tm.BigIntUtil.equal(b, tm.BigInt(3))
        ) {
            return true;
        }
        return false;
    }
)
