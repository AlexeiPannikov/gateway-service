import {Button, Form, FormInstance} from "antd";
import React, {useEffect} from "react";
import {useLogInMutation} from "../api/AuthApi";
import {useLocation, useNavigate} from "react-router-dom";

export const SignInButton = ({form}: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const [login, loginResult] = useLogInMutation({fixedCacheKey: "signIn"})
    const navigate = useNavigate()
    const location = useLocation()

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
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
            .unwrap()
            .then(() => navigate(location.state?.from || "/"))
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