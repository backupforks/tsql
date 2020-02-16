import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.exists(
                    tsql.selectValue(() => "hello")
                        .limit(0)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });

            await tsql
                .selectValue(() => tsql.exists(
                    tsql.selectValue(() => "hello")
                        .compoundQueryLimit(0)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
        });

        t.end();
    });
};
