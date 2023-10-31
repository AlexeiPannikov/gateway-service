import React from 'react';
import {Flex} from "antd"
import {LoginForm} from "../../features";

export const LoginPage = () => {

    return (
        <Flex
            justify={"center"}
            align={"center"}
            style={{height: "100%"}}
        >
            <LoginForm />
        </Flex>
    );
};