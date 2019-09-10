import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";
import {sqliteSqlfier} from "../../../../../sqlite-sqlfier";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myColumn : tm.mysql.double(),
        });

    const expr = tsql.acos(
        myTable.columns.myColumn
    );
    t.deepEqual(
        tsql.AstUtil.toSql(expr.ast, sqliteSqlfier),
        `ACOS("myTable"."myColumn")`
    );

    t.end();
});