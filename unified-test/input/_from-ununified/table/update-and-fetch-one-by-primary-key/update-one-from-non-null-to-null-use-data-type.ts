import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const dst = tsql.table("dst")
            .addColumns({
                testId : tsql.dtBigIntSigned(),
                testVal : tsql.dtBigIntSigned().orNull(),
            })
            .setPrimaryKey(columns => [columns.testId])
            .addMutable(columns => [
                columns.testVal,
            ]);

        const result = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "dst",
                            columns : [
                                {
                                    columnAlias : "testId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
                        }
                    ]
                }
            );

            await dst
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
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

            return dst
                .whereEqPrimaryKey({
                    testId : BigInt(1),
                })
                .updateAndFetchOne(
                    connection,
                    () => {
                        return {
                            testVal : null,
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
                testId : BigInt(1),
                testVal : null,
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
                            testId : BigInt(1),
                            testVal : null,
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
};