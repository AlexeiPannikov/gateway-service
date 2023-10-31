import React from "react"
import ReactDOM from "react-dom/client"
import {Provider} from "react-redux"
import {setupStore} from "./app/store"
import "./index.css"
import {RouterProvider} from "react-router-dom";
import router from "./app/router/router";
import {ConfigProvider} from "antd";
import {lightTheme} from "./app/themes";

const store = setupStore()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider theme={lightTheme}>
                <RouterProvider router={router}/>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
)
