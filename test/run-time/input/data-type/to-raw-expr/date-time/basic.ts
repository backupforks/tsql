import * as tape from "tape";
import * as tsql from "../../../../../../dist";

tape(__filename, async (t) => {
    t.deepEqual(
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtDateTime(3),
            new Date(0)
        ),
        new Date(0)
    );
    t.deepEqual(
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtDateTime(3),
            new Date(-1)
        ),
        new Date(-1)
    );
    t.deepEqual(
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtDateTime(3),
            new Date(1)
        ),
        new Date(1)
    );
    t.deepEqual(
        tsql.BuiltInExprUtil.fromValueExpr(
            tsql.dtDateTime(3),
            new Date(1000)
        ),
        new Date(1000)
    );

    t.end();
});
