import {Button, Form, FormInstance} from "antd";
import React, {useEffect} from "react";
import {useLogInMutation} from "../../../../shared";

export const SignInButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const [login, loginResult] = useLogInMutation()

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    const onSubmit = () => {
        login({...values})
    }

    return (
        <Button
            type="primary"
            htmlType="submit"
            loading={loginResult.isLoading}
            disabled={!submittable}
            onClick={onSubmit}
        >
            Submit
        </Button>
    );
};