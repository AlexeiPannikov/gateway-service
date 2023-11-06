import {api} from "../../../shared";
import {BaseResponse} from "../../../shared/api/BaseResponse";
import {logOut, refreshAccessToken, setUser, signIn} from "../../../entities";
import {RefreshResponse} from "./RefreshResponse";
import {SignInResponse} from "./SignInResponse";
import {SignInRequest} from "./SignInRequest";
import {User} from "../models/User";

export const authApi = api.injectEndpoints({
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
                    api.dispatch(refreshAccessToken(res.data.data.tokens.accessToken))
                }
            }
        }),
        me: builder.query<BaseResponse<{ user: User }>, null>({
            query: () => ({
                url: "auth/me"
            }),
            onQueryStarted: async (arg, api) => {
                try {
                    const res = await api.queryFulfilled
                    if (res?.data?.data?.user) {
                        api.dispatch(setUser(res.data.data.user))
                    }
                } catch (e) {
                    logOut()
                }
            },
            providesTags: ["Me"],
        }),
        logOut: builder.mutation<BaseResponse<undefined>, null>({
            query: () => ({
                url: "auth/log-out"
            }),
            onQueryStarted: async (arg, api) => {
                try {
                    const res = await api.queryFulfilled
                    api.dispatch(logOut())
                } catch (e) {

                }
            },
            // invalidatesTags: ["Me"],
        }),
    })
})

export const {
    useLogInMutation,
    useLazyMeQuery,
    useLogOutMutation,
} = authApi