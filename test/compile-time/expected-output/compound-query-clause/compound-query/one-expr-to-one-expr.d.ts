import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const compound: {
    selectClause: [tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, number | null>;
        tableAlias: "$aliased";
        alias: "y";
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>];
    compoundQueryClause: readonly tsql.CompoundQuery[];
};
