import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId])
        .addExplicitDefaultValue(columns => [columns.testVal])
        .removeExplicitDefaultValue(columns => [columns.testVal]);

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

        return test.insertOne(
            connection,
            {
                testId : BigInt(4),
            } as any
        ).then(() => {
            t.fail("Should not insert");
        }).catch((err) => {
            t.deepEqual(err.message, "Expected value for test.testVal; received undefined");
        });
    });

    t.end();
});