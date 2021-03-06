import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                3.14159,
                -3.14159,
                3.141592,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    await tsql.selectValue(() => tsql.eq(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, a === b);
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
