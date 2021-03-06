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

    const handler : tsql.EventHandler<tsql.IReplaceOneEvent<tsql.ITable>> = (event) => {
        if (!event.isFor(test)) {
            return;
        }
        event.addOnCommitListener(() => {
            onCommitInvoked = true;
        });
        event.addOnRollbackListener(() => {
            onRollbackInvoked = true;
        });
        t.deepEqual(eventHandled, false);
        eventHandled = true;
        t.deepEqual(
            event.candidateKey,
            {
                testId : BigInt(4),
            }
        );
    };
    pool.onReplaceOne.addHandler(handler);

    const insertResult = await pool.acquire(async (connection) => {
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

        pool.onReplaceOne.removeHandler(handler);

        const result = await test.replaceOne(
            connection,
            {
                testId : BigInt(4),
                testVal : BigInt(400),
            }
        );

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        return result;
    });

    t.deepEqual(eventHandled, false);
    t.deepEqual(onCommitInvoked, false);
    t.deepEqual(onRollbackInvoked, false);

    t.deepEqual(
        insertResult.insertedOrReplacedRowCount,
        BigInt(1)
    );
    t.deepEqual(
        insertResult.autoIncrementId,
        undefined
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
    );

    await pool
        .acquire(async (connection) => {
            return test.whereEqPrimaryKey({ testId : BigInt(4) }).fetchOne(connection);
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(4),
                    testVal : BigInt(400),
                }
            );
        });

    await pool.disconnect();t.end();
});
