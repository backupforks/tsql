import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {fetchOneOrUndefinedImpl} from "./fetch-one-or-undefined-impl";

export async function fetchOneOrUndefined<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : Promise<FetchedRow<QueryT>|undefined> {
    return fetchOneOrUndefinedImpl(query, connection)
        .then(({row}) => row);
}
