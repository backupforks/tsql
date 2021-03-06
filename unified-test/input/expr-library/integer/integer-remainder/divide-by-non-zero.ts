import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=-25; a<=25; ++a) {
                for (let b=-25; b<=25; ++b) {
                    if (b == 0) {
                        continue;
                    }
                    await tsql
                        .selectValue(() => tsql.integer.integerRemainder(
                            BigInt(a),
                            BigInt(b)
                        ))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, BigInt(a%b), `${a} % ${b} = ${a%b}`);
                        })
                        .catch((err) => {
                            t.fail(err.message);
                        });
                }
            }

        });

        t.end();
    });
};
