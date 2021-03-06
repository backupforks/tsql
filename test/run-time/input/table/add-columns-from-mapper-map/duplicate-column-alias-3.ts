import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .addColumns({
                testId : (_name : string, mixed : unknown) => String(mixed),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await test.where(columns => tsql.eq(
            columns.testVal,
            BigInt(200)
        )).fetchOne(
            connection
        ).then((row) => {
            console.log(row);
            t.fail("Should not fetch");
        }).catch((err) => {
            t.true(tm.ErrorUtil.isMappingError(err));
        });

    });

    await pool.disconnect();
    t.end();
});
