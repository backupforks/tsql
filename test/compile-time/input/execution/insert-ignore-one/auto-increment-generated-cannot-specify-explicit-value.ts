import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    })
    .setAutoIncrement(columns => columns.testId);

export const p = tsql.ExecutionUtil.insertIgnoreOne(
    null as any,
    test,
    {
        testId : BigInt(5),
        testVal : BigInt(400),
    }
);
