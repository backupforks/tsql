import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
    })

const outerQueryTable = tsql.table("outerQueryTable")
    .addColumns({
        outerQueryTableId : tm.mysql.bigIntSigned(),
    })

declare const otherTable : tsql.AliasedTable<{
    isLateral : false;
    alias : "otherTable";
    columns : {
        otherTableId : tsql.IColumn<{
            tableAlias : "otherTable",
            columnAlias : "otherTableId",
            mapper : tm.SafeMapper<bigint>,
        }>
    };
    usedRef : tsql.IUsedRef<{
        outerQueryTable : {
            outerQueryTableId : bigint,
        }
    }>;
}>;

export const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable
);
