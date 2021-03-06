import * as sd from "type-mapping";
import * as o from "../../../../../dist";

export const t = o.table("joined1")
    .addColumns({
        a : sd.mysql.dateTime(),
        b : sd.mysql.float(),
        y : sd.orNull(sd.string()),
        c : sd.string(),
        d : sd.string(),
    })
    .setPrimaryKey(c => [c.y, c.b]);
