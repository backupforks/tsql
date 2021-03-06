import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    const query = tsql.from(myTable)
        .select(() => [tsql.double.pi().as("pi")])
        .orderBy(columns => [
            columns.myTable.myBoolColumn,
            columns.$aliased.pi,
        ])
        .compoundQueryOrderBy(columns => [
            columns.pi.desc()
        ])
        .compoundQueryLimit(2);

    compareSqlPretty(__filename, t, query);

    t.end();
});
