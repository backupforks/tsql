import * as fs from "fs";
import * as tsql from "../dist";
import * as tape from "tape";
import {sqliteSqlfier} from "./sqlite-sqlfier";

export function compareSqlPretty (
    fileName : string,
    t : tape.Test,
    ast : tsql.Ast
) {
    const actual = tsql.AstUtil.toSqlPretty(ast, sqliteSqlfier, {
        stringTypes : [/*`""`,*/ "N''", /*"''",*/ "``", "[]", "X''", "pascal-single", "pascal-double"],
        /**
         * These `undefined` values should be ignored,
         * and should not overwrite.
         */
        openParens : undefined,
        closeParens : undefined,
    });
    const expected = fs
        .readFileSync(fileName.replace(/\.ts$/, ".sql"))
        .toString("ascii")
        .replace(/\n$/, "");
    t.deepEqual(actual, expected, fileName);
}
