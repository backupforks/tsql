import {QueryBaseUtil} from "../../../query-base";
import {IQuery} from "../../query";

export type NonCorrelated = (
    & QueryBaseUtil.NonCorrelated
    & IQuery
);
