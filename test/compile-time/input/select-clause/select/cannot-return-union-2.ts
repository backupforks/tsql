import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
    });

const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable
);

tsql.SelectClauseUtil.select(
    fromClause,
    undefined,
    undefined,
    columns => (
        Math.random() > 0.5 ?
        [
            tsql.eq(columns.myTable.myTableId, columns.myTable.myTableId).as("eq")
        ] :
        [
            tsql.eq(columns.myTable.myTableId, columns.otherTable.otherTableId).as("eq"),
            tsql.eq(columns.myTable.myTableId, columns.otherTable.otherTableId).as("eq2")
        ]
    )
)
