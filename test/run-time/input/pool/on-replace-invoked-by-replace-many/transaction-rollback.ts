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
        .setPrimaryKey(columns => [columns.testId]);

    let eventHandled = false;
    let onCommitInvoked = false;
    let onRollbackInvoked = false;
    pool.onReplace.addHandler((event) => {
        if (!event.isFor(test)) {
            return;
        }
        event.addOnCommitListener(() => {
            onCommitInvoked = true;
        });
        event.addOnRollbackListener(() => {
            onRollbackInvoked = true;
        });
        eventHandled = true;
        t.deepEqual(
            event.candidateKeys,
            [
                {
                    testId : BigInt(4),
                },
            ]
        );
    });

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

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        await connection.transaction(async (connection) => {

            t.deepEqual(eventHandled, false);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            await test.replaceMany(
                connection,
                [
                    {
                        testId : BigInt(4),
                        testVal : BigInt(400),
                    },
                ]
            );

            t.deepEqual(eventHandled, true);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            throw new Error(``);
        });

        t.fail("Should throw");
    }).then(() => {
        t.fail("Should throw");
    }).catch(async () => {
        t.deepEqual(eventHandled, true);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, true);

        await pool
            .acquire(async (connection) => {
                return test.whereEqPrimaryKey({ testId : BigInt(4) }).fetchOne(connection);
            }).then(() => {
                t.fail("Should not exist");
            }).catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });
    });

    await pool.disconnect();
    t.end();
});
