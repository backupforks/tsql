import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumn00 : tm.literal(1),
        someColumn01 : tm.mysql.double(),
        someColumn02 : tm.mysql.double(),
        someColumn03 : tm.mysql.double(),
    });

export const expr = tsql.caseValue(myTable.columns.someColumn00)
    .when(myTable.columns.someColumn01, myTable.columns.someColumn02)
    .when(2, myTable.columns.someColumn02)
    .end();
