import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
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
                await tsql.selectValue(() => tsql.double.log10(a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = Math.log10(a);
                        const margin = 0.000000000000001;

                        if (value == null) {
                            t.fail(`LOG10(${a}) ~= ${expected} ~/= ${value}`);
                            return;
                        }

                        t.true(
                            Math.abs(value - expected) <= margin,
                            `LOG10(${a}) ~= ${expected} ~/= ${value}`
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
