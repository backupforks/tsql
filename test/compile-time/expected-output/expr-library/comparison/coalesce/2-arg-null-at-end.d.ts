import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";
export declare const expr0: tsql.ExprImpl<tm.Mapper<unknown, true>, tsql.IUsedRef<{}>>;
export declare const expr1: tsql.ExprImpl<tm.Mapper<unknown, null>, tsql.IUsedRef<{}>>;
export declare const expr2: tsql.ExprImpl<tm.Mapper<unknown, 1 | null>, tsql.IUsedRef<{}>>;
export declare const expr3: tsql.ExprImpl<tm.Mapper<unknown, boolean>, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean;
    };
}>>;
export declare const expr4: tsql.ExprImpl<tm.Mapper<unknown, boolean | null>, tsql.IUsedRef<{
    readonly myTable: {
        readonly someColumnA: boolean;
        readonly someColumnB: boolean;
    };
}>>;