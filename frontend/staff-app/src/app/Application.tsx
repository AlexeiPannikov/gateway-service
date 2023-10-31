import "./App.css"
import {App, Layout} from "antd";
import React, {SyntheticEvent, useEffect} from "react";
import {Outlet, useLocation, useNavigate, useRoutes} from "react-router-dom";

const {Header, Content, Footer, Sider} = Layout;

function Application() {

    const navigate = useNavigate()

    useEffect(() => {
        navigate("/login")
    }, []);

    return (
        <App style={{height: "100%", width: "100%"}}>
            <Outlet></Outlet>
        </App>
    )
}

export default Application
