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
        .setAutoIncrement(columns => columns.testId);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT,
                CONSTRAINT test_testVal UNIQUE(testVal)
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300),
                (4, 444);
        `);

        return tsql.ExecutionUtil.insertIgnoreOne(
            test,
            connection,
            {
                testVal : BigInt(444),
            }
        );
    });
    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(0)
    );
    t.deepEqual(
        insertResult.autoIncrementId,
        undefined
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(1)
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(test).select(columns => [columns]).fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                    {
                        testId : BigInt(4),
                        testVal : BigInt(444),
                    },
                ]
            );
        });

    await pool.disconnect();
    t.end();
});
