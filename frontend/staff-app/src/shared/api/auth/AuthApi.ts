import {api} from "../BaseApi";
import {BaseResponse} from "../BaseResponse";
import {RefreshResponse, SignInResponse, User, SignInRequest} from "./models";
import {logOut, refreshAccessToken, setUser, signIn} from "../../../features";

const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        logIn: builder.mutation<BaseResponse<SignInResponse>, SignInRequest>({
            query: (body) => ({
                url: "auth/sign-in",
                method: "POST",
                body,
            }),
            onQueryStarted: async (arg, api) => {
                const res = await api.queryFulfilled
                if (res?.data?.data) {
                    api.dispatch(signIn(res.data.data))
                }
            }
        }),
        refresh: builder.query<BaseResponse<RefreshResponse>, null>({
            query: () => ({
                url: "auth/refresh"
            }),
            onQueryStarted: async (arg, api) => {
                const res = await api.queryFulfilled
                if (res?.data?.data) {
                    api.dispatch(refreshAccessToken(res.data.data))
                }
            }
        }),
        me: builder.query<BaseResponse<{ user: User }>, null>({
            query: () => ({
                url: "auth/me"
            }),
            onQueryStarted: async (arg, api) => {
                const res = await api.queryFulfilled
                if (res?.data?.data?.user) {
                    api.dispatch(setUser(res.data.data.user))
                }
            }
        }),
        logOut: builder.query<BaseResponse<undefined>, null>({
            query: () => ({
                url: "auth/refresh"
            }),
            onQueryStarted: async (arg, api) => {
                const res = await api.queryFulfilled
                if (res?.data?.success) {
                    api.dispatch(logOut())
                }
            }
        }),
    })
})

export const {
    useLogInMutation,
    useLazyRefreshQuery,
    useMeQuery,
    useLazyLogOutQuery
} = authApi