import React from "react";
import { InputAdornment } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AddIcon } from 'icons/icons_48/add.svg';
import { ReactComponent as ArrowDownIcon } from 'icons/icons_32/Sort_D_32.svg';

import Drawer from './Drawer';

import ETextField from "styled_components/TextField";
import ESelect from "styled_components/Select";


export default function SelectWithDrawer({
  name, list, suggested, selected, setSelected, showDrawer, setShowDrawer, emptyItemText, multiple, ...props}) {

  const getValue = (event) => {
    if (emptyItemText && Array.isArray(selected) && !selected.length) return emptyItemText;
    else if (!selected) return "";
    else if (multiple) return selected.map((t) => t.name).join(', ')
    else return selected.name;
  };



  return (<>
    {showDrawer !== undefined && setShowDrawer !== undefined && <Drawer name={name} show={showDrawer} setShow={setShowDrawer} list={list} suggested={suggested} setSelected={setSelected} selected={selected} emptyItemText={emptyItemText} multiple={multiple} />}
    <ETextField
      {...props}
      sx={{marginBottom: '16px'}}
      autoComplete="off"
      fullWidth
      label={name}
      variant="filled"
      onClick={() => {!props.disabled && setShowDrawer(true)}}
      value={getValue()}
      onKeyDown={()=>{return false}}
      inputProps={{ style: { cursor: 'pointer', caretColor: 'transparent' } }}
      InputProps={
        {
          startAdornment:
            (multiple && <InputAdornment position="start" style={{ cursor: 'pointer' }}>
              <SvgIcon viewBox="6 6 32 32" component={AddIcon} />
            </InputAdornment>)
          ,
          endAdornment:
            (!multiple && <InputAdornment position="end" style={{ cursor: 'pointer' }}>
              <SvgIcon viewBox="0 0 32 32" component={ArrowDownIcon} />
            </InputAdornment>)
        }
      }


    />
  </>
  )
}