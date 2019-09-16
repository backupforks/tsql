import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
/**
 * This is a correlated subquery, referencing `outerTable` from an outer query,
 * ```sql
 *  --snip
 *  FROM
 *      myTable
 *  WHERE
 *      myTable.outerTableIdA <=> outerTable.outerTableIdA AND
 *      myTable.outerTableIdB <=> outerTable.outerTableIdB
 * ```
 */
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: readonly (tsql.Join<{
            tableAlias: "outerTable";
            nullable: false;
            columns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly outerColumn: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            originalColumns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly outerColumn: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            primaryKey: readonly ("outerTableIdA" | "outerTableIdB")[];
            candidateKeys: readonly (readonly ("outerTableIdA" | "outerTableIdB")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "outerTable2";
            nullable: false;
            columns: {
                readonly outerColumn: tsql.Column<{
                    tableAlias: "outerTable2";
                    columnAlias: "outerColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly outerTable2IdA: tsql.Column<{
                    tableAlias: "outerTable2";
                    columnAlias: "outerTable2IdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTable2IdB: tsql.Column<{
                    tableAlias: "outerTable2";
                    columnAlias: "outerTable2IdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly outerColumn: tsql.Column<{
                    tableAlias: "outerTable2";
                    columnAlias: "outerColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly outerTable2IdA: tsql.Column<{
                    tableAlias: "outerTable2";
                    columnAlias: "outerTable2IdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTable2IdB: tsql.Column<{
                    tableAlias: "outerTable2";
                    columnAlias: "outerTable2IdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: readonly ("outerTable2IdA" | "outerTable2IdB")[];
            candidateKeys: readonly (readonly ("outerTable2IdA" | "outerTable2IdB")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
        currentJoins: readonly (tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly otherColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            originalColumns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly otherColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "otherTable";
            nullable: false;
            columns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly otherColumn: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly outerTable2IdA: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTable2IdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTable2IdB: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTable2IdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly otherColumn: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly outerTable2IdA: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTable2IdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTable2IdB: tsql.Column<{
                    tableAlias: "otherTable";
                    columnAlias: "outerTable2IdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "otherTable2";
            nullable: false;
            columns: {
                readonly otherColumn: tsql.Column<{
                    tableAlias: "otherTable2";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly outerTable2IdA: tsql.Column<{
                    tableAlias: "otherTable2";
                    columnAlias: "outerTable2IdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTable2IdB: tsql.Column<{
                    tableAlias: "otherTable2";
                    columnAlias: "outerTable2IdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly otherColumn: tsql.Column<{
                    tableAlias: "otherTable2";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly outerTable2IdA: tsql.Column<{
                    tableAlias: "otherTable2";
                    columnAlias: "outerTable2IdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTable2IdB: tsql.Column<{
                    tableAlias: "otherTable2";
                    columnAlias: "outerTable2IdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
}>;
