import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthorizedUser} from "./AuthorizedUser";
import {RefreshResponse, SignInResponse, User} from "../../../shared";

const initialState: { user: AuthorizedUser | null } = {
    user: null
}

export const ACCESS_TOKEN = "ACCESS_TOKEN"

const setAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN, token)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<SignInResponse>) => {
            state.user = action.payload.user
            setAccessToken(action.payload.tokens.accessToken)
        },
        logOut: (state, action: PayloadAction<undefined>) => {
            state.user = null
            localStorage.removeItem(ACCESS_TOKEN)
        },
        refreshAccessToken: (state, action: PayloadAction<RefreshResponse>) => {
            setAccessToken(action.payload.tokens.accessToken)
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = new AuthorizedUser({...action.payload})
        },
    }
})

export const {
    signIn,
    refreshAccessToken,
    logOut,
    setUser
} = authSlice.actions

export const authSliceReducer = authSlice.reducer