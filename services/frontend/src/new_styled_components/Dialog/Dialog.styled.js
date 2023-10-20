
import React from "react";
import Dialog from '@mui/material/Dialog';

import { styled } from '@mui/system';


const StyledDialog = styled(Dialog)`

    .MuiDialog-container {
        align-items: baseline;
        justify-content: end;

        .MuiPaper-root {
            margin: 0;
            border-radius: 0;
            overflow: auto;
        }
    }

    .dialog_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #EEEBF1;
        padding-bottom: 8px;
    }

    .dialog_content {
        height: 79vh;
        overflow: auto;
        padding-right: 6px;

        .checkbox_group {
            .checkbox_item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
        }
    }

    .dialog_button {
        display: flex;
        justify-content: space-between;
    }


    .teams_checkbox_label{
        display: flex;
        flex-direction: column;
    }
`


export default function EDialog(props) {
    return (
        <StyledDialog {...props}>
            {props.children}
        </StyledDialog>

    )
}