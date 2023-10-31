import React, {PropsWithChildren} from 'react';
import {Alert, Card, Form, Input, Space} from "antd";
import {SignInRequest, UiCard} from "../../../../shared";
import {SignInButton} from "./SignInButton";

export const LoginForm = () => {
    const [form] = Form.useForm();

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

                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input type={"password"}/>
                </Form.Item>
                <Form.Item>
                    <SignInButton form={form}/>
                </Form.Item>
                {

                }
            </Form>
        </UiCard>
    );
};