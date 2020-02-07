import * as tm from "type-mapping";
import {Test} from "../../../../../test";
import * as tsql from "../../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                0,
                1,
                2,
                3,
                4,
                -1,
                -2,
                -3,
                -4,
                1234,
                -5678,
                74923600,
                -9104758200,
                "9223372036854775807",
                "-9223372036854775808",
            ];
            for (const a of arr) {
                for (let b=0; b<=64; ++b) {
                    const expected = tm.BigIntUtil.asIntN(
                        64,
                        tm.BigIntUtil.signedRightShift(BigInt(a), BigInt(b))
                    );
                    await tsql
                        .selectValue(() => tsql.integer.bitwiseRightShift(
                            BigInt(a),
                            BigInt(b)
                        ))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, expected, `(${a} >> ${b}) = ${expected}`);
                        })
                        .catch((err) => {
                            t.fail(`(${a} >> ${b}) = ${expected}`);
                            t.fail(err.message);
                        });
                }
            }

        });

        t.end();
    });
};
