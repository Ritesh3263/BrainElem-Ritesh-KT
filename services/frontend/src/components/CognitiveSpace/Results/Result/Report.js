import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Components
import PdfComponent from 'styled_components/PdfComponent'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import StyledButton from "new_styled_components/Button/Button.styled";
import CloseIcon from '@mui/icons-material/Close';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import Typography from "@mui/material/Typography"

//Context
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

//Services
import ResultService from "services/result.service";

// Theme
import { new_theme } from "NewMuiTheme";
export default function Report({ activeResults, userTraits, open, setOpen }) {
  const { t, i18n } = useTranslation(['payment', 'common']);
  const navigate = useNavigate();
  // Type of results: student/employee/teacher
  // For the moment we only support `student`
  const [resultsType, setResultsType] = useState('student')

  const [isFullAccess, setIsFullAccess] = useState(false)
  const [scrolledToTheBottom, setScrolledToTheBottom] = useState(false)

  const {F_getLocalTime} = useMainContext();

  // Handle scoll on rendered PDF
  const handleScroll = (e) => {
    const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) < 1;
    if (bottom) setScrolledToTheBottom(true)
  }

  const getProductName = () => {
    return `${t("payment:FULL_REPORT")} - ${activeResults.content.title} - ${F_getLocalTime(activeResults.createdAt, true)}`
  }


  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: '0px',
          overflow: 'unset',
          width: 'fit-content',
          maxWidth: {xs:'90%', md: '655px'},
          overflowX: 'hidden'
        }
      }}
      sx={{ display: 'block', scroll: 'auto', zIndex: 1020, overflowX: 'hidden'}}
      open={open}
      onClose={() => setOpen(false)}
    >
      {/* <StyledEIconButton sx={{ alignSelf: 'self-end', margin: '5px 0', marginRight: '5px', padding: '0' }} onClick={() => setOpen(false)}><CloseIcon /></StyledEIconButton> */}

      <PdfComponent renderTimeout={1500} onScroll={handleScroll} onError={()=>{setOpen(false)}} onLoad={(pages)=>{if (pages.length > 10) setIsFullAccess(true)}} style={{ filter: !isFullAccess && scrolledToTheBottom ? 'blur(0px)' : 'unset' }} url={`/api/v1/users/cognitive-report/download/${activeResults.user._id}/${activeResults._id}?lang=${i18n.language}`}  ></PdfComponent>

      {isFullAccess && <DialogActions sx={{ background: "white", padding: '24px'}} >

        <StyledButton eVariant="secondary" eSize="small" onClick={() => setOpen(false)}>{t("common:CLOSE")}</StyledButton>
        <StyledButton eVariant="primary" eSize="small" onClick={() => { window.open(`/api/v1/users/cognitive-report/download/${activeResults.user._id}/${activeResults._id}?lang=${i18n.language}`, '_blank').focus(); }}>{t("common:DOWNLOAD")+" (PDF)"}</StyledButton>
      </DialogActions>}

      <Fade timeout={1000} in={!isFullAccess && scrolledToTheBottom}>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'flex-end', position: 'absolute', bottom: 0, height: '100%', width: '100%', p: 0, m: 0 }}>
          {/* GRADIENT ABOVE MESSAGE */}
          <Grid item style={{ width: '100%', height: '100%', maxHeight: '580px', background: `linear-gradient(178.04deg, ${new_theme.palette.primary.PBlack} 5.04%, ${new_theme.palette.shades.black80} 98.35%)` }}></Grid>
          {/* MESSAGE ABOUT PAYMENT */}
          <Grid container sx={{ flexDirection: 'column', alignItems: 'center', width: '100%', height: 'fit-content', background: "white", m: '0px !important', padding: '24px', boxShadow: `0px -4px 4px ${new_theme.palette.shades.black25}` }}>
            <Typography variant="h3" sx={{ mb: '21px', textAlign: 'center', color: new_theme.palette.neutrals.black }}>{t("payment:NO_FULL_REPORT_TITLE")}</Typography>
            <Typography variant="subtitle3" sx={{ mb: '21px', textAlign: 'center', color: new_theme.palette.neutrals.black, fontWeight: 'normal' }}>{t("payment:NO_FULL_REPORT_MESSAGE")}</Typography>
            <StyledButton eVariant="primary" eSize="small" onClick={() => { 
                navigate(`/cognitive-pricing?resultId=${activeResults._id}&productName=${getProductName()}`)

            }}>{t("payment:BUY")}</StyledButton>
          </Grid>
        </DialogActions>
      </Fade>

    </Dialog>
  );
}
