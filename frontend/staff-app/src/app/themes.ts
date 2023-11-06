import {ThemeConfig, theme} from "antd";

const {defaultAlgorithm, darkAlgorithm} = theme

export const lightTheme: ThemeConfig = {
    token: {

    },
    algorithm: defaultAlgorithm,
    components: {
        Layout: {
            headerBg: "white"
        }
    }
}