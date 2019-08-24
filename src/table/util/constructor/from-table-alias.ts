import {escapeIdentifier} from "../../../sqlstring";
import {Table} from "../../table-impl";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";

export type FromTableAlias<
    TableAliasT extends string
> = (
    Table<{
        isLateral : false,
        alias : TableAliasT,
        columns : {},
        usedRef : IUsedRef<{}>,

        autoIncrement : undefined,
        id : undefined,
        primaryKey : undefined,
        candidateKeys : readonly [],

        insertEnabled : true,
        deleteEnabled : true,

        generatedColumns : readonly [],
        nullableColumns : readonly [],
        explicitDefaultValueColumns : readonly [],
        mutableColumns : readonly [],
    }>
);
/**
 * Creates a table with the given alias
 *
 * @param tableAlias
 */
export function fromTableAlias<
    TableAliasT extends string
> (
    tableAlias : TableAliasT
) : (
    FromTableAlias<TableAliasT>
) {
    const result : FromTableAlias<TableAliasT> = new Table(
        {
            isLateral : false,
            alias : tableAlias,
            columns : {},
            usedRef : UsedRefUtil.fromColumnRef({}),

            autoIncrement : undefined,
            id : undefined,
            primaryKey : undefined,
            candidateKeys : [],

            insertEnabled : true,
            deleteEnabled : true,

            generatedColumns : [],
            nullableColumns : [],
            explicitDefaultValueColumns : [],
            mutableColumns : [],
        } as const,
        escapeIdentifier(tableAlias)
    );
    return result;
}
