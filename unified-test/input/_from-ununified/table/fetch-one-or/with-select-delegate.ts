import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "test",
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

            await test
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

            await test.where(
                columns => tsql.gt(
                    columns.testVal,
                    BigInt(255)
                )).fetchOne(
                connection,
                columns => [columns.testId, tsql.integer.add(columns.testVal, BigInt(45)).as("testVal2")]
            ).or(
                1337
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : BigInt(3),
                        testVal2 : BigInt(345),
                    }
                );
            }).catch((err) => {
                console.error(err);
                t.fail("Should not throw");
            });

            await test.where(
                columns => tsql.gt(
                    columns.testVal,
                    BigInt(300)
                )).fetchOne(
                connection,
                columns => [columns.testId, tsql.integer.add(columns.testVal, BigInt(45)).as("testVal2")]
            ).or(
                1337
            ).then((row) => {
                t.deepEqual(row, 1337);
            }).catch((err) => {
                console.error(err);
                t.fail("Should not throw");
            });

            await test.where(
                columns => tsql.gt(
                    columns.testVal,
                    BigInt(100)
                )).fetchOne(
                connection,
                columns => [columns.testId, tsql.integer.add(columns.testVal, BigInt(45)).as("testVal2")]
            ).or(
                1337
            ).then(() => {
                t.fail("Should not fetch anything");
            }).catch((err) => {
                t.true(err instanceof tsql.TooManyRowsFoundError);
            });
        });

        t.end();
    });
};
