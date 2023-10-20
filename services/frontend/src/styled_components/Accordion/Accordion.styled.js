import { styled } from '@mui/system';
import React from "react";

// Mui v5
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import {Divider, Typography} from "@mui/material";

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = styled(({cptRef,...otherProps }) => (
    <Accordion {...otherProps} disableGutters={true}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
        >
            {otherProps.headerName ? (
                <Typography variant={otherProps.typoVariant??'h5'} component="h3" className="text-left" style={{color: `rgba(82, 57, 112, 1)`,paddingLeft:'10px'}}>
                    {otherProps.headerName}
                </Typography>
            ):(
                <Divider/>
            )}
        </AccordionSummary>
        <AccordionDetails>
                {otherProps.children ? (
                    otherProps.children
                ):(
                    <span>No data</span>
                )}
        </AccordionDetails>
    </Accordion>
))`
    background-color: rgba(255,255,255,0);
    box-shadow: none;
    svg{
      background-color: rgba(255,255,255,.75);
      border-radius: 50%;
      fill: rgba(82, 57, 112, 1);
    };
    .MuiCheckbox-root svg{
      background-color: transparent;
    };
    hr{
      width: 100%;
      height: 1px;
      background-color: rgba(0, 0, 0,.25);
    };
    .MuiGrid-root{
      display: flex;
    };
    .MuiAccordionSummary-root{
      background-color: ${({headerBackground})=> headerBackground ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,0)'};
      border-radius: 16px;      
      padding-top: 4px;      
      padding-bottom: 4px;
      min-height: unset;      
      margin: 0;
            &.Mui-expanded{
                    min-height: unset;
                    margin: 0;
            };
            &.MuiButtonBase-root{
                    padding: 2px;
            }
    };
    &.MuiPaper-rounded{
            &:before{
                    opacity: 0;
            }
    };
        
    .MuiAccordionDetails-root{
        padding: 10px 0;    
    };    
    .MuiAccordionSummary-content{
      min-height: unset;
      margin: 0;
      &.Mui-expanded{
        min-height: unset;
        margin: 0;
      };
    .Mui-expanded{
      min-height: unset;
      margin: 0;
    };
    };
`;
export default StyledAccordion;