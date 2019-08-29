import * as tm from "type-mapping";
import {Expr} from "../../../expr";
import {IUsedRef, UsedRefUtil} from "../../../used-ref";
import {ExprImpl} from "../../../expr/expr-impl";
import {functionCall, arg} from "../../../ast";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 */
export function count () : (
    Expr<{
        mapper : tm.SafeMapper<bigint>,
        usedRef : IUsedRef<{}>,
    }>
) {
    const result = new ExprImpl(
        {
            mapper : tm.mysql.bigIntUnsigned(),
            usedRef : UsedRefUtil.fromColumnRef({}),
        },
        functionCall(
            "COUNT",
            [
                arg("*")
            ]
        )
    );
    return result;
}