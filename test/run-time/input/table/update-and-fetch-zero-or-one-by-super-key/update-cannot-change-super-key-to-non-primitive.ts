import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {ExprUtil} from "../../../../../dist";

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
        ]);

    await pool.acquire(async (connection) => {
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

        return dst.updateAndFetchZeroOrOneBySuperKey(
            connection,
            {
                testId : BigInt(1),
            },
            () => {
                return {
                    testId : ExprUtil.fromRawExpr(BigInt(123456)),
                } as any;
            }
        ).then(() => {
            t.fail("Should not be able to update super key to non-primitive");
        }).catch(() => {
            t.pass("Cannot update super key to non-primitive");
        });
    });

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
                ]
            );
        });

    t.end();
});