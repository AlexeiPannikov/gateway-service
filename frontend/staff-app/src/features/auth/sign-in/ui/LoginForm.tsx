import React from 'react';
import {Alert, Form, Input} from "antd";
import {SignInButton} from "./SignInButton";
import {UiCard} from "../../../../shared";
import {SignInRequest} from "../api/SignInRequest";
import {useLogInMutation} from "../api/AuthApi";
import {useAppSelector} from "../../../../app/hooks";

export const LoginForm = () => {
    const [form] = Form.useForm();
    const [, loginResult] = useLogInMutation({fixedCacheKey: "signIn"})
    const {user} = useAppSelector(state => state.authSliceReducer)

    return (
        <UiCard style={{flexBasis: "500px", flexShrink: 1}}>
            <Form
                form={form}
                layout={"vertical"}
                size={"large"}
            >
                <Form.Item<SignInRequest>
                    label="Email"
                    name="email"
                    initialValue={"alexeipannicov@icloud.com"}
                    rules={[{required: true, message: 'Please input your email!'}, {
                        type: "email",
                        message: "Email is not valid!"
                    }]}
                >
                    <Input type={"email"}/>
                </Form.Item>
                <Form.Item<SignInRequest>
                    label="Password"
                    name="password"
                    initialValue={"1AsDfGhw34rwdcxfgryLJHKJHGLjrtetr2"}
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input type={"password"}/>
                </Form.Item>
                <Form.Item>
                    <SignInButton form={form}/>
                </Form.Item>
                {user?.name}
                {
                    loginResult.isError
                    &&
                    <Alert
                        type={"error"}
                        message={loginResult?.error?.data?.messages?.join("\n")}
                    />
                }
            </Form>
        </UiCard>
    );
};