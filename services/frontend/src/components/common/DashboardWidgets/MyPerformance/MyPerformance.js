import React, {lazy, useState} from 'react';
import {useTranslation} from "react-i18next";

const Trainee = lazy(()=>import("./PerformanceTypes/Trainee"));
const Trainer = lazy(()=>import("./PerformanceTypes/Trainer"));
const Parent = lazy(()=>import("./PerformanceTypes/Parent"));
const ModuleManager = lazy(()=>import("./PerformanceTypes/ModuleManager"));
const NetworkPerformance = lazy(()=>import("./PerformanceTypes/NetworkPerformance"));
const Architect = lazy(()=>import("./PerformanceTypes/Architect"));

function MyPerformance(props) {
    const {
        type="TRAINEE",
    } = props;
    const { t } = useTranslation();

    return (
        <>
            {type === 'TRAINEE'&&(<Trainee type={type} />)}
            {type === 'TRAINER'&&(<Trainer type={type} />)}
            {type === 'PARENT'&&(<Parent type={type} />)}
            {['MODULEMANAGER','ASSISTANT'].includes(type)&&(<ModuleManager type={type} />)}
            {type === 'ARCHITECT'&&(<Architect type={type} />)}
            {type === 'NETWORK'&&(<NetworkPerformance type={type}/>)}
        </>
    );
}

export default MyPerformance;