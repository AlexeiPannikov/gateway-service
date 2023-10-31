import React, {PropsWithChildren} from 'react';
import {Card} from "antd";
import {CardProps} from "antd/es/card/Card";
import style from "./UiCard.module.css"

export const UiCard = (props: PropsWithChildren<CardProps>) => {
    return (
        <Card className={style.CardBox} {...props}>
            {props.children}
        </Card>
    );
};

