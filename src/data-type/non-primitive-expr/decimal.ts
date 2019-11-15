import * as tm from "type-mapping";
import * as DataTypeUtil from "../util";
import {DataType} from "../data-type-impl";
import {Decimal} from "../../decimal";
import * as ExprLib from "../../expr-library";

export function makeDecimalDataType (
    mapperFactory : (
        /**
         * + PostgreSQL's min precision is `1`
         * + MySQL's max precision is `65`
         */
        precision : number|bigint,
        /**
         * + The min scale is `0`.
         * + MySQL's max scale is `30`.
         * + `scale` must be <= `precision`.
         */
        scale : number|bigint
    ) => tm.SafeMapper<Decimal>
) : (
    (
        /**
         * + PostgreSQL's min precision is `1`
         * + MySQL's max precision is `65`
         */
        precision : number|bigint,
        /**
         * + The min scale is `0`.
         * + MySQL's max scale is `30`.
         * + `scale` must be <= `precision`.
         */
        scale : number|bigint,
        extraMapper? : tm.Mapper<Decimal, Decimal>
    ) => DataType<Decimal>
) {
    return (
        /**
         * + PostgreSQL's min precision is `1`
         * + MySQL's max precision is `65`
         */
        precision : number|bigint,
        /**
         * + The min scale is `0`.
         * + MySQL's max scale is `30`.
         * + `scale` must be <= `precision`.
         */
        scale : number|bigint,
        extraMapper? : tm.Mapper<Decimal, Decimal>
    ) => DataTypeUtil.makeDataType(
        mapperFactory(precision, scale),
        value => ExprLib.decimalLiteral(
            value,
            precision,
            scale
        ),
        (a, b) => a.toString() === b.toString(),
        extraMapper
    );
}

/**
 * Fixed-point number.
 *
 * + MySQL      : `DECIMAL(p, s)`
 * + PostgreSQL : `DECIMAL(p, s)`
 * + SQLite     : -NA-; Should be emulated using `TEXT` and custom functions.
 */
export const dtDecimal = makeDecimalDataType(tm.mysql.decimal);
