import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -30,
                -20.6282,
                -20,
                -10.3141,
                -10,
                -1.1,
                -1,
                -0.5,
                0,
                0.5,
                1,
                1.1,
                10,
                10.3141,
                20,
                20.6282,
                30,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.sin(a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = Math.sin(a);
                        if (value == null) {
                            t.fail(
                                `SIN(${a}) ~= ${expected} ~/= ${value}`
                            );
                            return;
                        }
                        const margin = 0.000000000000001;
                        t.true(
                            Math.abs(value - expected) <= margin,
                            `SIN(${a}) ~= ${expected} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
