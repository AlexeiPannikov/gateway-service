import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import Application from "../Application";
import {UsersPage, LoginPage} from "../../pages";
import Main from "../Main";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Application/>}>
            <Route path="/login" element={<LoginPage/>}></Route>
            <Route path="/" element={<Main/>}>
                <Route path="/users" element={<UsersPage/>}></Route>
            </Route>
        </Route>
    )
)

export default router