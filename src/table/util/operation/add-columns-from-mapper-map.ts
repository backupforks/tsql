import {ITable, TableData} from "../../table";
import {Table} from "../../table-impl";
import {MapperMap} from "../../../mapper-map";
import {ColumnMapUtil} from "../../../column-map";

export type AddColumnsFromMapperMap<
    TableT extends ITable,
    MapperMapT extends MapperMap
> = (
    Table<{
        lateral : TableT["lateral"],
        tableAlias : TableT["tableAlias"],
        columns : ColumnMapUtil.Intersect<
            TableT["columns"],
            ColumnMapUtil.FromMapperMap<TableT["tableAlias"], MapperMapT>
        >,
        usedRef : TableT["usedRef"],

        autoIncrement : TableT["autoIncrement"],
        id : TableT["id"],
        primaryKey : TableT["primaryKey"],
        candidateKeys : TableT["candidateKeys"],

        insertAllowed : TableT["insertAllowed"],
        deleteAllowed : TableT["deleteAllowed"],

        generatedColumns : TableT["generatedColumns"],
        nullableColumns : ColumnMapUtil.NullableColumnAlias<
            ColumnMapUtil.Intersect<
                TableT["columns"],
                ColumnMapUtil.FromMapperMap<TableT["tableAlias"], MapperMapT>
            >
        >[],
        explicitDefaultValueColumns : TableT["explicitDefaultValueColumns"],
        mutableColumns : TableT["mutableColumns"],

        parents : TableT["parents"],
    }>
);
export function addColumnsFromMapperMap<
    TableT extends ITable,
    MapperMapT extends MapperMap
> (
    table : TableT,
    mapperMap : MapperMapT
) : (
    AddColumnsFromMapperMap<TableT, MapperMapT>
) {
    //https://github.com/Microsoft/TypeScript/issues/28592
    const tableColumns: TableT["columns"] = table.columns;

    const columns : (
        ColumnMapUtil.Intersect<
            TableT["columns"],
            ColumnMapUtil.FromMapperMap<TableT["tableAlias"], MapperMapT>
        >
    ) = ColumnMapUtil.intersect(
        tableColumns,
        ColumnMapUtil.fromMapperMap(table.tableAlias, mapperMap)
    );
    const nullableColumns : (
        ColumnMapUtil.NullableColumnAlias<
            ColumnMapUtil.Intersect<
                TableT["columns"],
                ColumnMapUtil.FromMapperMap<TableT["tableAlias"], MapperMapT>
            >
        >[]
    ) = ColumnMapUtil.nullableColumnAliases(columns);

    const result : AddColumnsFromMapperMap<TableT, MapperMapT> = new Table(
        {
            ...(table as TableData),
            columns,
            nullableColumns,
        },
        table.unaliasedAst
    );
    return result;
}
