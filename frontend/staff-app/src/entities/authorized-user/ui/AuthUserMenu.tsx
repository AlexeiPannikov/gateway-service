import React, {PropsWithChildren} from 'react';
import {Dropdown, Flex, MenuProps, message, Space} from "antd";
import {useAppSelector} from "../../../app/hooks";
import {EnterOutlined, DownOutlined} from "@ant-design/icons";

interface IProps {
    onClick: MenuProps['onClick'];
}

const items: MenuProps['items'] = [
    {
        label: 'Log Out',
        key: 'logout',
        icon: <EnterOutlined />,
    },
];

export const AuthUserMenu = ({onClick}: PropsWithChildren<IProps>) => {

    const {user} = useAppSelector(state => state.authSliceReducer)

    const menuProps = {
        items,
        onClick,
    };

    return (
        <Dropdown
            menu={menuProps}
            trigger={["click"]}
        >
            <Space>
                <Flex>
                    <div style={{fontSize: 20, textTransform: "uppercase", marginRight: "5px", cursor: "pointer"}}>
                        {user?.name}
                    </div>
                    <DownOutlined />
                </Flex>
            </Space>
        </Dropdown>
    );
};