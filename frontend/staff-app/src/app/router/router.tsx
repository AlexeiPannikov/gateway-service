import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import Application from "../Application";
import {UsersPage, LoginPage} from "../../pages";
import Main from "../Main";
import {AuthProtectedRoute} from "./AuthProtectedRoute";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Application/>}>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<AuthProtectedRoute/>}>
                <Route path="/" element={<Main/>}>
                    <Route path="/users" element={<UsersPage/>}></Route>
                </Route>
            </Route>
        </Route>
    )
)

export default router