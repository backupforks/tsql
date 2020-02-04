import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.least(0, 0))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 0);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.least(0, 1))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 0);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.least(1, 0))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 0);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.least(1, 1))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 1);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.least(-0.5, 0, -0.7, 1, 2, 0.3))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -0.7);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.least(-0.5, -0, -0.7, -1, -2, -0.3))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -2);
                })
                .catch((err) => {
                    t.pass(err.message);
                });
        });

        t.end();
    });
};