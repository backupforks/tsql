import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const dst = tsql.table("dst")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned().orNull(),
        })
        .setPrimaryKey(columns => [columns.testId])
        .addMutable(columns => [
            columns.testId,
            columns.testVal,
        ]);

    const result = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO dst(testId, testVal) VALUES
                (1,100),
                (2,200),
                (3,300);
        `);

        return dst.updateAndFetchOneByPrimaryKey(
            connection,
            {
                testId : BigInt(1),
            },
            columns => {
                return {
                    testId : BigInt(123456),
                    testVal : tsql.integer.add(
                        tsql.coalesce(columns.testVal, BigInt(777)),
                        BigInt(50)
                    ),
                };
            }
        );
    });
    t.deepEqual(
        result.foundRowCount,
        BigInt(1)
    );
    t.deepEqual(
        result.updatedRowCount,
        BigInt(1)
    );
    t.deepEqual(
        result.warningCount,
        BigInt(0)
    );
    t.deepEqual(
        result.row,
        {
            testId : BigInt(123456),
            testVal : BigInt(150),
        }
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(dst)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                    {
                        testId : BigInt(123456),
                        testVal : BigInt(150),
                    },
                ]
            );
        });

    t.end();
});