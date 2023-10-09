import React from "react"
import ReactDOM from "react-dom/client"
import {Provider} from "react-redux"
import {store} from "./app/store"
import App from "./app/App"
import "./index.css"
import {RouterProvider} from "react-router-dom";
import router from "./app/router";
import {ConfigProvider} from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider>
                <RouterProvider router={router}/>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
)
