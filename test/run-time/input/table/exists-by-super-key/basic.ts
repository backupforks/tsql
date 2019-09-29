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
            .setPrimaryKey(columns => [columns.testId]);

        await test.existsBySuperKey(
            connection,
            {
                testVal : BigInt(200),
            } as any
        ).then(() => {
            t.fail("Should not execute");
        }).catch(() => {
            t.pass("Should throw error");
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
            }
        ).then((value) => {
            t.deepEqual(value, true);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
                testVal : BigInt(200),
            }
        ).then((value) => {
            t.deepEqual(value, true);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
                testVal : BigInt(200),
                shouldGetIgnored : 999,
            } as any
        ).then((value) => {
            t.deepEqual(value, true);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
                testVal : BigInt(300),
            }
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(4),
            }
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await connection.exec(`DELETE FROM test`);

        await test.existsBySuperKey(
            connection,
            {
                testVal : BigInt(200),
            } as any
        ).then(() => {
            t.fail("Should not execute");
        }).catch(() => {
            t.pass("Should throw error");
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
            }
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
                testVal : BigInt(200),
            }
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
                testVal : BigInt(200),
                shouldGetIgnored : 999,
            } as any
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(2),
                testVal : BigInt(300),
            }
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await test.existsBySuperKey(
            connection,
            {
                testId : BigInt(4),
            }
        ).then((value) => {
            t.deepEqual(value, false);
        });

    });

    t.end();
});
