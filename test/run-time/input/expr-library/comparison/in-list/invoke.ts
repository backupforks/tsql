import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await tsql
            .selectValue(() => tsql.inList(
                3,
                6,
                5,
                4,
                3
            ))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, true);
            });
        await tsql
            .selectValue(() => tsql.inList(
                3,
                6,
                5,
                4,
                2
            ))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, false);
            });
    });

    t.end();
});
