import * as tsql from "../../../../../dist";
import {serverAppKeyTpt} from "../app-key-example";

export const result = serverAppKeyTpt.updateAndFetchOneByCandidateKey(
    null as any,
    {
        appKeyId : BigInt(1),
    },
    columns => {
        return {
            ipAddress : tsql.concat(
                tsql.coalesce(columns.serverAppKey.ipAddress, ""),
                "-x"
            ),
            trustProxy : tsql.not(columns.serverAppKey.trustProxy),
            key : tsql.concat(
                tsql.coalesce(columns.serverAppKey.ipAddress, ""),
                "-",
                columns.appKey.key,
                "-y"
            ),
            disabledAt : tsql.timestampAddMillisecond(
                tsql.coalesce(
                    columns.appKey.disabledAt,
                    new Date(0)
                ),
                5
            ),
        };
    }
);
