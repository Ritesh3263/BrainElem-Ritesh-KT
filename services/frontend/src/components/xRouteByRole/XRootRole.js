import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";

const Scripts = lazy(() => import("../Script/Script"));
const EcosystemsList = lazy(() => import("../../components/Ecosystem/EcosystemsList/EcosystemsList"));
const EcosystemForm = lazy(() => import("../../components/Ecosystem/EcosystemsList/EcosystemForm"));
const EcosystemManagers = lazy(() => import("../../components/Ecosystem/EcosystemsManagersList/EcosystemManagers"));
const EcosystemManagerForm = lazy(() => import("../../components/Ecosystem/EcosystemsManagersList/EcosystemManagerForm"));
const BlockchainInterface = lazy(() => import("../../components/Blockchain/Interface"));
const DatabaseDiagram = lazy(() => import("../../components/Database/Diagram"));

export default function XRootRole(){
    return(
        <Routes>
            <Route path="/database/diagram" element={<DatabaseDiagram/>}/>
            <Route path="/blockchain/interface" element={<BlockchainInterface/>}/>
            <Route path="/scripts" element={<Scripts/>}/>
            <Route path="/ecosystems" element={<EcosystemsList/>}/>
            <Route path="/ecosystems/form/:ecosystemId" element={<EcosystemForm/>}/>
            <Route path="/ecosystems/managers" element={<EcosystemManagers/>}/>
            <Route path="/ecosystems/managers/form/:uId" element={<EcosystemManagerForm/>}/>
        </Routes>
    )
}