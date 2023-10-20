import React, {useEffect, useRef, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";
import { makeStyles} from "@material-ui/core/styles";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import {Divider, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useReactToPrint} from "react-to-print";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import certBorder from "../../../../img/certificate/Background2.svg";
import certBorderLeft from "../../../../img/certificate/cert3_left.png";
import logo from "../../../../img/certificate/logo.svg";
import qr from "../../../../img/certificate/cert3_qr.png";
import certBorderRight from "../../../../img/certificate/cert3_right.png";
import { theme } from "../../../../MuiTheme";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import {QRCodeSVG} from 'qrcode.react';


const useStyles = makeStyles({
    root:{
        maxWidth:"780px", 
        maxHeight: '640px',
        marginLeft:"auto",
        marginRight:"auto",
    },
    card:{
        transform:"scale(0.40) translate(-65%, -65%)", 
        maxHeight:'470px'
    },
    certificateHeader:{
        color: theme.palette.neutrals.white, 
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "144px",
        letterSpacing:"5px",
    },
    certificateTitle:{
        color: theme.palette.neutrals.white,
        fontFamily: "Didot",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: "32px",
        marginTop:"10px",
    },
    signature:{
        fontFamily:"'AlexBrush', cursive", 
        fontSize:"33px",
        letterSpacing:"1px",
        whiteSpace: 'nowrap'
    },
    certificateFooter:{
        color: new_theme.palette.secondary.DarkPurple,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "24px",
    },
    certificateName:{
        color: theme.palette.neutrals.white,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "32px",
        lineHeight:"54px",
    },
    nameOfTrainee:{
        color: theme.palette.neutrals.white.almostBlack,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "54px",
    },
    Completed:{
        color: new_theme.palette.neutrals.purplegrey,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "48px",
    },
    Completed2:{
        marginLeft:"auto",
        marginRight:"auto"
    },
    courseName:{
        color: new_theme.palette.primary.PBlack,
        fontFamily: "Didot",
        fontWeight: 400,
        fontStyle: "normal",
        fontSize: "48px",
    },
    logo:{
        width: "200px",
        height: "200px",
        marginTop:"25px",
        marginLeft:"960px",
        marginBottom:"40px"
    },
    logo1:{
        marginLeft:"210px",
        marginTop:"40px" 
    },
    footer:{
        width: "250px",
    },
    print:{       
        background:"white"  
    }, 
    divider:{
        backgroundColor: "black"
    },
    // certBorder:{
    //     backgroundImage: `url(${certBorder})`,
    //     backgroundRepeat:"no-repeat",
    //     backgroundSize:"cover",
    //     height:"1096px",
    //     width:"1542px",
    //     minWidth:"100%"
    // },  this cert border is for the old cert template, the new one having two parts, the left and right side
    // write the new cert borders here, the left and the right side, two svg
    certBorder:{
        backgroundImage: `url(${certBorderLeft}), url(${certBorderRight})`,
        backgroundRepeat:"no-repeat",
        backgroundSize:"contain",
        backgroundPosition:"left, right",
        height:"1089px", // Chrome max
        width:"1542px",
        minWidth:"100%",
        backgroundColor: 'white'
    },
    certText:{
        textAlign: 'center',
        fontFeatureSettings: "'clig' off, 'liga' off",
        fontFamily: 'Montserrat',
        lineHeight: 1.5,
        fontWeight: 300
    },

    
});

const pageStyle = `
  @page {
    size: auto;
  }
`;

export default function CertificatePreviewModal({isOpenPreviewModal, setIsOpenPreviewModal, certificate, getVerificationBlock, getQRAddress, directDownload, setDirectDownload}){
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const componentRef = useRef();
    const classes = useStyles();
    const { t, i18n, translationsLoaded } = useTranslation();
    const [qrAaddress, setQrAddress] = useState(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: false,
        onBeforeGetContent: async () => {
            // F_handleSetShowLoader(true)
        },
        onAfterPrint: () => {
            // This is not working when using using custom `print` function
            setIsOpenPreviewModal(false)
            setDirectDownload(false)
        },
        
    });
    useEffect(()=>{
        let addr = getQRAddress()
        setQrAddress(addr)
    },[])

    useEffect(()=>{
        if (directDownload){handlePrint()}

    },[directDownload])


    return(
        <ThemeProvider theme={new_theme}>
            <Dialog className={classes.root} 
                style={{ display:  (directDownload ? "none" : "")}}
                open={isOpenPreviewModal}
                onClose={()=>setIsOpenPreviewModal(false)}
                maxWidth={'false'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                <div className={classes.card}>
                    <div ref={componentRef} className={classes.certBorder}>
                        <Box sx={{ width: '100%', height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box className={classes.certText} sx={{ color: new_theme.palette.primary.MedPurple, fontSize: 148, fontWeight: '500 !important', mt: 10 }}>
                                {"Certificate"}
                            </Box>
                            <Box className={classes.certText} sx={{ color: new_theme.palette.primary.MedPurple, fontSize: 56, mb: 2.5, mt: -3 }}>
                                {"of Achievement"}
                            </Box>
                            <Box className={classes.certText} sx={{ color: new_theme.palette.primary.PinkPurple, fontSize: 100, fontWeight: '500 !important' }}>
                                {`${user?.name ?? "Name"} ${user?.surname ?? "Surname"}`}
                            </Box>
                            <Box className={classes.certText} sx={{ color: new_theme.palette.secondary.Lavender, fontSize: 40, mb: 2 }}>
                                {certificate.courseName}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '24px', mt: 5, mb: 3 }}>
                                {/* draw a small bar line both sides of the qr */}
                                <Box sx={{ width: '16rem', height: '1px', backgroundColor: new_theme.palette.shades.black50, mt: 4.2 }}></Box>
                                {/* <img src={qr} alt="logo" style={{ width: '4.3rem' }} /> */}
                                <Grid item style={{ background: "white", padding: 10 }}>
                                    <a target="_blank" href={qrAaddress} style={{ color: "inherit", textDecoration: "none" }}>
                                        <QRCodeSVG size={108} value={qrAaddress} />
                                    </a>
                                </Grid>
                                <Box sx={{ width: '16rem', height: '1px', backgroundColor: new_theme.palette.shades.black50, mt: 4.2 }}></Box>
                            </Box>
                            <Box className={classes.certText} sx={{ color: theme.palette.neutrals.almostBlack, fontFamily: 'Roboto !important', fontSize: 16, width: '40%', mb: 1 }}>
                                <a target="_blank" href={qrAaddress} style={{ color: "inherit", textDecoration: "none" }}>
                                    {qrAaddress}
                                </a>
                            </Box>
                            <Box sx={{ mt: 6 }}>
                                <img height={108} src={logo} alt="logo" />
                            </Box>
                        </Box>
                    </div>
                </div>
                </DialogContent>
                <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                    <style type="text/css" media="print">{"\ @page {\ size: A4 landscape;\ }\ "}</style>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}