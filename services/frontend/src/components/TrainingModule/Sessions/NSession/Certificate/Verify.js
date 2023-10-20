import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavCurrentRoute from "components/Navigation/NavCurrentRoute";
import { QRCodeSVG } from 'qrcode.react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CommonProperty from 'components/common/Property';
import CommonExpandBar from 'components/common/ExpandBar'
import { styled } from "@mui/system";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import { theme } from "MuiTheme";
import { ReactComponent as LogoElia } from "../../../../assets/logo/elia_color.svg";

import CertificateService from "services/certificate.service";

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const StyledPaper = styled(Paper)`
background: ${theme.palette.glass.light};
box-shadow: none;
border-radius: 0px;
padding: 1.5rem;
min-height: 100%;
${props => props.theme.breakpoints.down("md")} {
    background: transparent;
    padding: 0px;
    margin-top: 160px;
  }
`

const StyledCard = styled(Card)`
background: ${theme.palette.glass.opaque};
border-radius: 8px;
width: 500px;
float: right;
position: relative;
overflow: visible;
${props => props.theme.breakpoints.down("lg")} {
    width: 340px;
}
${props => props.theme.breakpoints.down("md")} {
    width: 100%;
    border-radius: unset;
}
`;

const AmeliaImageWrapper = styled(Box)`
height: 500px;
position: absolute;
top: -20px;
left: -20px;
z-index: 1020;
${props => props.theme.breakpoints.down("lg")} {
    height: 340px;
}
${props => props.theme.breakpoints.down("md")} {
    height: 300px;
    left: calc(50% - 90px);
    top: -150px;
    z-index: -1;
}
`

const LogoWrapper = styled(Box)`
display: flex;
align-items: center;
padding-left: 10px;
padding-right: 50px;
padding-bottom: 7px;
background-color: rgba(255, 255, 255, 0.75);
border-bottom-right-radius: 75px;
border-top-right-radius: 75px;
height: 95px;
width: 410px;
`;

const LogoWrapperSmall = styled(Box)`
display: flex;
flex: auto;
align-items: center;
padding-top: 0px;
padding-bottom: 0px;
justify-content: center;
background-color: rgba(255, 255, 255, 0.75);
height: auto;
`;

// Component for verifying certifications 
export default function VerifyCertification({ externalUser }) {
    const [certification, setCertification] = useState(undefined);
    const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");
    const { setMyCurrentRoute, F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const { t, i18n, translationsLoaded } = useTranslation();
    let { certificationId } = useParams();

    // Get height of main Paper
    function getHeight(offset = 0) {
        if (externalUser) offset += isSmUp ? 200 : 170;
        else offset += isSmUp ? 130 : 110;
        return `calc(100vh - ${offset}px`
    }

    function getNavigation() {
        return isSmUp ? (
            <Grid item container className="mt-5 mb-4" style={{ flexWrap: "nowrap" }}>
                <Grid item>
                    <Link to={'/'}>
                        <LogoWrapper>
                            <LogoElia />
                        </LogoWrapper>
                    </Link>
                </Grid>
                <Grid item>
                    <Grid container alignItems="center" className="ml-2" style={{ height: "100%" }}>
                        <NavCurrentRoute whiteSpace="break-spaces" />
                    </Grid>
                </Grid>
            </Grid>
        ) : (
            <>
                <Grid container className="mb-1">
                    <Grid item xs={12}>
                        <Link to={'/'}>
                            <LogoWrapperSmall>
                                <LogoElia style={{ width: "280px" }} />
                            </LogoWrapperSmall>
                        </Link>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="center" style={{ height: "100%" }}>
                            <NavCurrentRoute whiteSpace="break-spaces" textAlign="center" />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        )
    }

    useEffect(() => {
        setMyCurrentRoute("Confirmation of authenticity")
        F_handleSetShowLoader(true)
        CertificateService.verifyCertification(certificationId).then(res => {
            if (res.status === 200 && res.data) {
                setCertification(res.data);
                F_handleSetShowLoader(false)
            }
        }).catch(error => {
            console.error(error)
            F_showToastMessage("Could not load certification", 'error')
            F_handleSetShowLoader(false)
        })

    }, []);


    return (
        <>
            <Grid container direction="column" spacing={0}>
                {externalUser && getNavigation()}
                <Grid item>
                    <StyledPaper elevation={17} style={{ height: getHeight() }} >
                        {certification && certification.status &&
                            <Grid container justifyContent="center">
                                <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}
                                    style={{
                                        height: isMdUp ? getHeight(40) : "",
                                        overflowY: isMdUp ? "auto" : "",
                                    }}>
                                    <StyledCard className="pb-3">
                                        <Grid container>

                                            <Grid item xs={7}>
                                                <CardContent className="pb-0">
                                                    <CommonProperty label={t("Full name") + ":"}
                                                        value={certification.fullName}
                                                    />
                                                    <CommonProperty label={t("Aquired title") + ":"}
                                                        value={certification.certificationSession.name}
                                                    />
                                                    <CommonProperty label={t("Issued by") + ":"}
                                                        value={window.location.host}
                                                    />
                                                     <CommonProperty label={t("Issued on") + ":"}
                                                        value={certification.verificationDate ? certification.verificationDate.slice(0, 10) : "-"}
                                                    />
                                                    <CommonProperty label={t("Validation status") + ":"}
                                                        value={certification.status}
                                                    />
                                                    <CommonProperty label={t("Valid through") + ":"}
                                                        value={t("Lifetime")}
                                                    />
                                                </CardContent>
                                            </Grid>
                                            <Grid item xs={5} className="p-4">
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: "100%", maxWidth: 96, float: 'right' }}
                                                    image="/img/certificate/verified.png"
                                                    alt="Verified"
                                                />
                                                <p className="p-2" style={{ position: "absolute", right: 0, bottom: -50, float: 'right', fontSize: 12, color: "white" }}>{t("find out more at") + ": "}
                                                    <a target="_blank" href={"https://www.brainelem.com"} style={{ color: "white", fontWeight: "bold" }}>{"www.brainelem.com"}</a>
                                                </p>
                                            </Grid>
                                            {certification.blockchainStatus &&
                                                <Grid item xs={12} className="px-2 pb-0">
                                                    <CommonExpandBar text={t("Blockchain certification details")} value={showBlockchainDetails} setValue={setShowBlockchainDetails}>
                                                        <CommonProperty label={t("Hosting blockchain") + ":"}
                                                            value={certification.blockchainName}
                                                        />
                                                        <CommonProperty label={t("Contract adress") + ":"}
                                                            value={certification.blockchainContractAddress}
                                                            textareaStyle={{ fontSize: 12, fontWeight: 'unset', fontFamily: 'roboto' }}
                                                        />
                                                        <a target="_blank" href={certification.blockchainAddress}>
                                                            <CommonProperty label={t("Blockchain adress") + ":"}
                                                                value={certification.blockchainAddress}
                                                                textareaStyle={{ fontSize: 10, fontWeight: 'unset', fontFamily: 'roboto', cursor: 'pointer' }}
                                                            />
                                                            <div className="mb-2 p-1" style={{ width: 'min-content', background: "white" }} >
                                                                <QRCodeSVG size={80} value={certification.blockchainAddress} />
                                                            </div>
                                                        </a>
                                                        <CommonProperty label={t("Certification id") + ":"}
                                                            copyIcon={true}
                                                            value={certification._id}
                                                            textareaStyle={{ fontSize: 12, fontWeight: 'unset', fontFamily: 'roboto' }}
                                                        />
                                                        <CommonProperty label={t("User id") + ":"}
                                                            copyIcon={true}
                                                            value={certification.userId}
                                                            textareaStyle={{ fontSize: 12, fontWeight: 'unset', fontFamily: 'roboto' }}
                                                        />
                                                    </CommonExpandBar>
                                                </Grid>
                                            }
                                        </Grid>
                                    </StyledCard>
                                </Grid>
                                <Grid item xs={12} md={5} order={{ xs: 1, md: 2 }} style={{ position: "relative" }}>
                                    <AmeliaImageWrapper component="img" src="/img/amelia/amelia_ok_600.png" />
                                </Grid>


                            </Grid>
                        }
                    </StyledPaper>
                </Grid >
            </Grid >
        </>

    );



};
