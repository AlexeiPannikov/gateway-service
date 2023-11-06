import React, {useEffect} from 'react';
import {Navigate, Outlet, Route, RouteProps, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks";
import {useLazyMeQuery} from "../../features";
// @ts-ignore
import {Ripple} from 'react-preloaders';

export const AuthProtectedRoute = (props: RouteProps) => {

    const {user} = useAppSelector(state => state.authSliceReducer)
    const location = useLocation()
    const [trigger, result] = useLazyMeQuery()

    useEffect(() => {
        trigger(null)
    }, []);

    return (
        !result.isUninitialized && !result.isLoading
            ?
            user || result?.data?.data?.user
                ? <Outlet/>
                : <Navigate
                    to="/login"
                    replace={true}
                    state={{from: location.pathname}}
                />
            : <Ripple/>
    );
};