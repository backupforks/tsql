import {Key} from "../../key";

/**
 * https://github.com/microsoft/TypeScript/issues/32540#issuecomment-514931644
 *
 * This works and I have no idea why.
 * Please don't kill me.
 *
 * -----
 *
 * If `A` is a super key of `B`, `A` is returned.
 * Otherwise, `never` is returned.
 */
export type ExtractSuperKey<
    A extends Key,
    B extends Key
> = (
    A extends Key ?
    (
        B extends Key ?
        (
            B[number] extends Extract<A[number], B[number]> ?
            A :
            never
        ) :
        never
    ) :
    never
);
