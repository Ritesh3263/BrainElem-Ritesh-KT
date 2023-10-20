import React from "react";

// MUI v5
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// MUI v4
import { theme } from "../../MuiTheme";
const palette = theme.palette;

export default function StyledTextWithLabel({ label, value, ...props }) {

    return (
        <TextField
            {...props}
            label={label}
            value={value}
            fullWidth
            style={{ maxWidth: "400px" }}
            margin="dense"
            InputProps={{
                readOnly: true,
                disableUnderline: true,
            }}
            name='filed'
            variant='standard'
            required={false}
            InputLabelProps={{
                shrink: true,
            }}
        />
    )
}