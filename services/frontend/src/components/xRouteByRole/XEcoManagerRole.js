import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
const EcosystemCloud = lazy(() => import("../../components/Ecosystem/cloud/EcosystemCloud"));
const NetworksList = lazy(() => import("../../components/Network/Networks/NetworksList"));
const NetworkForm = lazy(() => import("../../components/Network/Networks/NetworkForm"));
const NetworksManagersList = lazy(() => import("../../components/Network/NetworksManagers/NetworksManagersList"));
const NetworkManagerForm = lazy(() => import("../../components/Network/NetworksManagers/NetworkManagerForm"));

export default function XEcoManagerRole(){
    return(
        <Routes>
            <Route path="/ecosystems/cloud" element={<EcosystemCloud/>}/>
            <Route path="/networks" element={<NetworksList/>}/>
            <Route path="/networks/form/:subscriptionId" element={<NetworkForm/>}/>
            <Route path="/networks/owners" element={<NetworksManagersList/>}/>
            <Route path="/networks/owners/form/:uId" element={<NetworkManagerForm/>}/>
        </Routes>
    )
}