import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

// MUIv5
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

//Services
import blockchainService from "services/blockchain.service";
import certificationService from "services/certificate.service";

// Styled components
import { baseURL } from "services/axiosSettings/axiosSettings";
import { EButton, EDataGrid } from "styled_components";
import EDialog from "styled_components/Dialog";
import OptionsButton from "components/common/OptionsButton";

// MUI v4
import { theme } from "MuiTheme";

// Component with Blockchain Interface 
export default function Interface() {
    const { setMyCurrentRoute, F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const { t, i18n, translationsLoaded } = useTranslation();
    const navigate = useNavigate();

    // External scripts
    const [truffleContractScript, setTruffleContractScript] = useState({ loaded: 0, url: `${baseURL}blockchain/scripts/truffle-contract.min.js` });
    const [web3Script, setWeb3Script] = useState({ loaded: 0, url: `${baseURL}blockchain/scripts/web3.min.js` });
    const [utilsScript, setUtilsScript] = useState({ loaded: 0, url: `${baseURL}blockchain/scripts/utils.js` });

    const [certifications, setCertifications] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [truffleContracts, setTruffleContracts] = useState([]);

    const [rows, setRows] = useState([]);
    const [showTestingInfo, setShowTestingInfo] = useState(false)

    const [loadingError, setLoadingError] = useState();

    const optionsRef = useRef()

    const columns = [
        {
            field: 'user',
            headerName: 'User',
            width: 150,
            editable: false,
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Certification name',
            width: 150,
            editable: false,
            flex: 1,
        },

        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            editable: false,
            type: 'date',
            flex: 1,
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                let current = certifications.find(c => c._id == params.row.id)

                if (!current?.blockchainStatus) {
                    return (
                        <EButton disabled={loadingError || contracts.length <= 0}onClick={() => {
                            handleAddCertifications([current])
                        }}>
                            {t(`Send`)}
                        </EButton>
                    )
                }
                else {

                    return (
                        <EButton onClick={() => {
                            navigate(`/certifications/verify/${current._id}`)
                        }}>
                            {t(`Open`)}
                        </EButton>
                    )
                }
            }
        }
    ];

    //####################################################################################
    //  Functions for connection to blockchain serivce
    //####################################################################################
    function getContracts() {
        return blockchainService.getContracts().then(response => response.data)
    }

    // Default function for adding new network
    function addNetwork(contractName, network) {
        var data = JSON.stringify(network)
        return blockchainService.addNetwork(contractName, network).then(function (response) {
            window.initContracts(getContracts, setContracts, setTruffleContracts);
            F_handleSetShowLoader(false)
        })
    }

    function loadData(contractName) {
        certificationService.readAllForBlockchain()
            .then(response => {
                let _rows = response.data.map(c => {
                    return {
                        id: c._id,
                        name: c.name,
                        user: `${c.userName} ${c.userSurname}`,
                        date: new Date(c.date).toLocaleDateString()
                    }
                })
                setRows(_rows);
                setCertifications(response.data)
            });
    }
    // Load external script from blockchain service
    function loadExternalScript(url, loadedCallback) {
        let name = url.split("/").pop();
        const script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
        script.addEventListener('load', function () {
            F_showToastMessage(`Loaded ${name} script from blockchain service`, "success")
            loadedCallback({ loaded: 1 })
        });
        script.addEventListener('error', () => {
            F_showToastMessage(`Could not load ${name} script from blockchain service`, "error")
            F_handleSetShowLoader(false)
            setLoadingError(true)
        });
        return script
    }
    //####################################################################################
    // Effects
    //####################################################################################
    useEffect(() => { // load rows
       if (loadingError) loadData()
    },[loadingError]);

    useEffect(() => {
        F_showToastMessage(`Loading external scripts from blockchain service. Plase wait.`, "info")
        F_handleSetShowLoader(true)
        let script1 = loadExternalScript(truffleContractScript.url, setTruffleContractScript)
        let script2 = loadExternalScript(web3Script.url, setWeb3Script)
        let script3 = loadExternalScript(utilsScript.url, setUtilsScript)
        setMyCurrentRoute("Blockchain")
        return () => {
            console.log('Uload scripts from blockchain service')
            document.body.removeChild(script1);
            document.body.removeChild(script2);
            document.body.removeChild(script3);
        }

    },
        [],
    );


    useEffect(() => { // When all external scripts are loaded
        async function initializeWeb3() {
            if (truffleContractScript.loaded && web3Script.loaded && utilsScript.loaded) {
                await window.initWeb3();
                window.initContracts(getContracts, setContracts, setTruffleContracts);
                loadData()
                F_handleSetShowLoader(false)
            }
        }
        initializeWeb3()

    }, [truffleContractScript, web3Script, utilsScript]);


    useEffect(() => {
        if (certifications.length && truffleContracts.length) {
            let certification = certifications[0]
            let args = [certification._id]
            let callback = (data) => { console.log('Data from Blockchain', data) }
            let contract = window.getContract('Certification', truffleContracts)
            window.callMethod(contract, 'getCertification', args, callback)

            args = [certification.userId]
            window.callMethod(contract, 'getUser', args, callback)
            //handleCallMethod('Certification', 'getCertification', args, (data) => { console.log('Data from Blockchain', data) })
            //'0x0000000000000000000000000000000000000000' empty address
        }
    }, [certifications, truffleContracts]);



    //####################################################################################
    // Handlers
    //####################################################################################
    function errorCallback(err) {
        F_handleSetShowLoader(false)
        console.error(err)
        F_showToastMessage(`Error: ${err.message}`, "error")
    }

    async function addCertificationsCallback(certifications) {
        F_handleSetShowLoader(false);
        F_showToastMessage(`Certifications added`, "success")
        let networkId = await window.web3.eth.net.getId()
        let contract = window.getContract('Certification', truffleContracts)
        let contractAddress = contract.networks[networkId].address
        for (let i = 0; i < certifications.length; i++) {
            let certification = certifications[i]
            await certificationService.certifyOnBlockchain(certification.userId, certification.sessionId, networkId, contractAddress)
        }
        // Reload data after saving changes in database
        loadData();

    }

    async function handleDeployContract(contractName, args) {
        F_handleSetShowLoader(true)
        let contract = window.getContract(contractName, contracts);
        window.deployContract(contract, args, addNetwork, errorCallback)
    }

    function handleRemoveCertification(certification) {
        F_handleSetShowLoader(true)
        let contract = window.getContract('Certification', truffleContracts)
        window.removeCertification(contract, certification, () => {
            F_handleSetShowLoader(false);
            F_showToastMessage(`Certifications was removed`, "success")
        }, errorCallback)
    }

    function handleAddCertifications(_certifications) {
        F_handleSetShowLoader(true)
        let contract = window.getContract('Certification', truffleContracts)
        window.addCertifications(contract, _certifications, () => addCertificationsCallback(_certifications), errorCallback)
    }

    function handleRemoveCertificationContract() {
        F_handleSetShowLoader(true)
        let contract = window.getContract('Certification', truffleContracts)
        let callback = (data) => { console.log('Contract removed from the Blockchain', data) }
        window.callMethod(contract, 'removeContract', [], callback, errorCallback)

    }

    //####################################################################################
    return (
        <>
            <Box>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography style={{ ...theme.typography.h, fontSize: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{"Certifications"}</Typography>
                    <Box ref={optionsRef}>
                        <OptionsButton btns={[
                            { name: 'Instructions', action: () => { setShowTestingInfo(true) } },
                            { name: 'Deploy contract', disabled: loadingError, action: () => { handleDeployContract('Certification', [window.location.hostname]) } },
                            { name: 'Remove contract', disabled: loadingError || contracts.length <= 0, action: handleRemoveCertificationContract },
                            { name: 'Send all certifications to the Blockchain', disabled: loadingError || contracts.length <= 0, action: () => handleAddCertifications(certifications.filter(c=>!c.blockchainStatus)) }
                        ]} iconButton={true} eSize="small" />
                    </Box>
                </Grid>




                <div style={{ width: '100%' }}>
                    <EDataGrid
                        rows={rows}
                        setRows={setRows}
                        columns={columns}
                        isVisibleToolbar={false}
                        pageSize={5}
                        disableSelectionOnClick
                    />
                </div>
            </Box>
            <EDialog fullWidth={true} maxWidth={'lg'} sx={{ '& .MuiDialog-paper': { p: 2, background: theme.palette.glass.opaque } }} open={showTestingInfo} onClose={() => setShowTestingInfo(false)}>
                <Typography sx={{ ...theme.typography.h, fontSize: '24px' }}>{"Prerequisites"}</Typography>
                <Typography style={{ ...theme.typography.p, fontSize: '16px' }}>{"1. Please make sure you have "} <a target="_blank" href="https://metamask.io/">{"MetaMask"}</a>{" installed or any other "}<a target="_blank" href="https://en.wikipedia.org/wiki/Ethereum">{"Ethereum"}</a>{" wallet compatible with "} <a target="_blank" href="https://github.com/web3/web3.js#readme">{"web3.js"}</a> {""}</Typography>

                <Typography sx={{ ...theme.typography.p, fontSize: '16px' }}>{"2. In order to send and store any certification on the Blockchain the contract must be deployed first - to do it use `Deplay contract` option."}</Typography>

                <Typography sx={{ ...theme.typography.h, fontSize: '24px' }}>{"For testing"}</Typography>
                <Typography sx={{ ...theme.typography.p, fontSize: '16px' }}>{`Enable "Show test networks" in "MetaMask" and add new network`}
                    <ul>
                        <li>URL RPC: http://65.108.147.12:30301</li>
                        <li>Chain ID: 1337</li>
                        <li>Currency symbol: ETH</li>
                    </ul>
                    {`Then click "Import new account" and use this "ganache" private key:`}
                    <ul><li>0x6f1313062db38875fb01ee52682cbf6a8420e92bfbc578c5d4fdc0a32c50266f</li></ul>

                    {`You can use this account and network for deploying contracts and sending certifications.`}
                </Typography>
            </EDialog>
        </>

    );



};
