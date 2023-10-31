import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReAuth} from "../../app/BaseQuery";

export const api = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({})
})