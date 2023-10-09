import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import App from "./App";
import {UsersPage} from "../pages";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route path="/users" element={<UsersPage/>}></Route>
        </Route>
    )
)

export default router