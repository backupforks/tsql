import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.integer.abs(BigInt(0)))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(0));
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
