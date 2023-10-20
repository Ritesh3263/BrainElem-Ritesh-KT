
import React from "react";
import { FormControlLabel } from "@mui/material";
import EVerticalProperty from "styled_components/VerticalProperty";
import ESwitch from 'styled_components/Switch';




export default function ESwitchWithTooltip(props) {
  return (

    <FormControlLabel
      style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}
      control={
        <ESwitch{...props} />
      }
      labelPlacement="start"
      disableTypography={true}
      label={<EVerticalProperty {...props} width="calc(100% - 66px)"></EVerticalProperty>}
    />

  )
}