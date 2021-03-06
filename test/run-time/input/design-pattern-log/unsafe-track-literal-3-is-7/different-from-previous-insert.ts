import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {literal3Is7} from "./literal-3-is-7";

export const business = tsql.table("business")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        businessId : tsql.dtBigIntSigned(),
    })
    .setAutoIncrement(c => c.businessId)
    .removeAllMutable();

export const businessEnabled = tsql.table("businessEnabled")
    .addColumns({
        appId : tsql.dtBigIntSigned(),
        businessEnabledId : tsql.dtBigIntSigned(),
        businessId : tsql.dtBigIntSigned(),
        enabled : literal3Is7,
        updatedAt : tsql.dtDateTime(3),
        updatedByExternalUserId : tsql.dtVarChar(255),
    })
    .removeAllMutable()
    .setAutoIncrement(c => c.businessEnabledId)
    .addCandidateKey(c => [c.businessId, c.updatedAt])
    .addExplicitDefaultValue(c => [c.updatedAt]);

export const businessEnabledLog = tsql.log(businessEnabled)
    .setOwner(business)
    .setLatestOrder(columns => columns.updatedAt.desc())
    .setTracked(columns => [columns.enabled])
    .setDoNotCopy(c => [
        c.updatedByExternalUserId
    ])
    .setCopyDefaults(({ownerPrimaryKey, connection}) => {
        return business.whereEqPrimaryKey(ownerPrimaryKey).fetchOne(connection, c => [c.appId]);
    })
    .setTrackedDefaults({
        enabled : BigInt(3),
    });

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE business (
                appId INTEGER NOT NULL,
                businessId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
            );

            CREATE TABLE businessEnabled (
                appId INTEGER NOT NULL,
                businessEnabledId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                businessId INTEGER NOT NULL,
                enabled INTEGER NOT NULL,
                updatedAt DATETIME NOT NULL DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
                updatedByExternalUserId VARCHAR(255) NOT NULL,
                FOREIGN KEY (appId, businessId) REFERENCES business (appId, businessId),
                CONSTRAINT updateRateConstraint UNIQUE (businessId, updatedAt)
            );

            INSERT INTO business(appId) VALUES
                (1),
                (1),
                (2),
                (3);
        `);

        const validationResult = await tsql.SchemaValidationUtil.validateSchema(
            [business, businessEnabled],
            (await connection.tryFetchSchemaMeta(undefined))!
        );
        t.deepEqual(validationResult.errors, []);
        t.deepEqual(validationResult.warnings, [
            {
                type: 'TABLE_ON_DATABASE_ONLY',
                description: 'Table "main"."sqlite_sequence" exists on database only',
                databaseTableAlias: 'sqlite_sequence'
            }
        ]);

        await businessEnabledLog
            .fetchLatestOrDefault(
                connection,
                { businessId : BigInt(2) }
            )
            .then((result) => {
                t.deepEqual(
                    result,
                    {
                        isDefault : true,
                        row : {
                            appId : BigInt(1),
                            businessId : BigInt(2),
                            enabled : BigInt(7),
                        },
                    }
                );
            });
        const unsafeTrackResult = await businessEnabledLog.unsafeTrack(
            connection,
            { businessId : BigInt(2) },
            {
                enabled : BigInt(8),
                updatedByExternalUserId : "test",
            }
        );
        t.deepEqual(
            {
                ...unsafeTrackResult,
                current : {
                    ...(unsafeTrackResult as any).current,
                    updatedAt : undefined,
                }
            },
            {
                changed : true,
                previous : {
                    isDefault : true,
                    row : {
                        appId : BigInt(1),
                        businessId : BigInt(2),
                        enabled : BigInt(7),
                    },
                },
                current : {
                    appId : BigInt(1),
                    businessEnabledId : BigInt(1),
                    businessId : BigInt(2),
                    enabled : BigInt(8),
                    updatedAt : undefined,
                    updatedByExternalUserId : "test",
                },
            }
        );
        await businessEnabledLog
            .fetchLatestOrDefault(
                connection,
                { businessId : BigInt(2) }
            )
            .then(({isDefault, row}) => {
                t.deepEqual(
                    {
                        isDefault,
                        row : {
                            ...row,
                            updatedAt : undefined,
                        },
                    },
                    {
                        isDefault : false,
                        row : {
                            appId : BigInt(1),
                            businessEnabledId : BigInt(1),
                            businessId : BigInt(2),
                            enabled : BigInt(8),
                            updatedAt : undefined,
                            updatedByExternalUserId : "test",
                        },
                    }
                );
            });
        const unsafeTrackResult2 = await businessEnabledLog.unsafeTrack(
            connection,
            { businessId: BigInt(2) },
            {
                enabled : BigInt(3),
                updatedByExternalUserId : "test2",
            }
        );
        t.deepEqual(
            {
                ...unsafeTrackResult2,
                previous : {
                    ...unsafeTrackResult2.previous,
                    row : {
                        ...unsafeTrackResult2.previous.row,
                        updatedAt : undefined,
                    }
                },
                current : {
                    ...(unsafeTrackResult2 as any).current,
                    updatedAt : undefined,
                }
            },
            {
                changed : true,
                previous : {
                    isDefault : false,
                    row : {
                        appId : BigInt(1),
                        businessEnabledId : BigInt(1),
                        businessId : BigInt(2),
                        enabled : BigInt(8),
                        updatedAt : undefined,
                        updatedByExternalUserId : "test",
                    },
                },
                current : {
                    appId : BigInt(1),
                    businessEnabledId : BigInt(2),
                    businessId : BigInt(2),
                    enabled : BigInt(7),
                    updatedAt : undefined,
                    updatedByExternalUserId : "test2",
                },
            }
        );
    });

    await pool.disconnect();
    t.end();
});
