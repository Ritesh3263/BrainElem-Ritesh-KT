

import { useState, lazy } from 'react';
import { Box, SvgIcon } from "@mui/material";
import { ReactComponent as InfoIcon } from 'icons/icons_32/Alert_for_credits_32.svg';
import { useTranslation } from "react-i18next";
import ETooltip from "new_styled_components/Tooltip";
import ModalRequestCredits from './ModalRequestCredits';
//const ModalRequestCredits = lazy(() => import("components/Credits/ModalRequestCredits"));

export default function WarningCredits({ text, enableRequest=false, viewBox = "1 1 22 22", ...props }) {
  const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
  const [requestOpen, setRequestOpen] = useState(false)

  const getDefaultText = () =>{
    if (enableRequest) return t("sentinel-Admin-Credits:RESULTS BLOCKED BY CREDITS")
    else return t("sentinel-Admin-Credits:RESULTS BLOCKED BY INVITER CREDITS")
  }
  return (<>
    <Box onClick={()=>setRequestOpen(true)} sx={{ ml: 1, width: '32px', cursor: 'pointer', display: 'inline-block' }} {...props}>
      <ETooltip placement="bottom" title={text?text:getDefaultText()}>
        <SvgIcon viewBox={viewBox} component={InfoIcon} />
      </ETooltip></Box>
  
      {enableRequest && requestOpen && <ModalRequestCredits open={requestOpen} onClose={()=>setRequestOpen(false)}></ModalRequestCredits>}
  </>
  )
}


