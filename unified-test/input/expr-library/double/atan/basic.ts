import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -30,
                -20,
                -10,
                -1,
                -0.5,
                0,
                0.5,
                1,
                10,
                20,
                30,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.atan(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Math.atan(a));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
