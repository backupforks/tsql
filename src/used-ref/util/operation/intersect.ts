import {IUsedRef} from "../../used-ref";
import {TypeRefUtil} from "../../../type-ref";
import {TypeRefOf} from "../query";
import {ColumnIdentifierRefUtil, ColumnIdentifierRef} from "../../../column-identifier-ref";
import {TryReuseExistingType} from "../../../type-util";

/**
 * Assumes `U` is a union
 */
export type Intersect<
    U extends IUsedRef
> = (
    IUsedRef<
        TypeRefUtil.Intersect<
            TypeRefOf<U>
        >
    >
);
export type IntersectTryReuseExistingType<
    U extends IUsedRef
> = (
    TryReuseExistingType<
        U,
        IUsedRef<
            TypeRefUtil.Intersect<
                TypeRefOf<U>
            >
        >
    >
);
export function intersect<
    U extends IUsedRef
> (
    ...arr : readonly U[]
) : (
    Intersect<U>
) {
    let columns : ColumnIdentifierRef = {};
    for (const u of arr) {
        columns = ColumnIdentifierRefUtil.intersect(
            columns,
            u.columns
        );
    }
    const result : Intersect<U> = {
        __contravarianceMarker : () => {},
        columns,
    };
    return result;
}
