import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingCartProvider, useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ReactComponent as One } from '../../icons/icons_32/One.svg';
import { ReactComponent as Two } from '../../icons/icons_32/Two.svg';
import { ReactComponent as Three } from '../../icons/icons_32/Three.svg';
import { ReactComponent as Four } from '../../icons/icons_32/Four.svg';

// MUIv5
import { styled } from '@mui/material/styles';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

export default function IconLabelTabs() {
    const { t } = useTranslation();
    const {
        currentShoppingCart,
        stageIndex,
        setStageIndex
    } = useShoppingCartContext();


    const tabStyleBase = {

        fontSize: {xs:"12px", md:"16px"}, 
        padding:{sm: 0, md:"10px"},
    }
    const tabStyle = { ...tabStyleBase,
    
        color: theme.palette.neutrals.almostBlack,
    
        "& polyline": {
            stroke:  "#fff",
            fill:"#C695FF",
        },
        "& path": {
            stroke:  "#fff",
            fill:"#fff",
        },
        '& circle': {
            fill:"#C695FF",
        }, }
    
    const tabStyleDisabled = { ...tabStyleBase, 
    
        fontSize: {xs:"8px", md:"12px"}, 
        padding:{sm: 0, md:"10px"},
    }

    const StyledTabs = styled(Tabs)({

        "& .MuiTabs-indicator": {
            display: "none",
          },
          minWidth: "10px",
    })

    const StyledTab = styled(Tab)({

        color: theme.palette.shades.white30,
        minWidth: "50px",
        textTransform:"none",
        padding:"2px",

        "&.MuiButtonBase-root.MuiTab-root.Mui-selected": {
            color: theme.palette.neutrals.almostBlack,
        }
    })

        return (
            <StyledTabs            
                value={stageIndex} onChange={(e, i) => setStageIndex(i)} aria-label="icon label tabs example" >
                <StyledTab  icon={<One/>} label="Start" sx={stageIndex != 0 ? tabStyleDisabled : tabStyle} />
                <StyledTab  icon={<Two />} label="Payment's details" disabled={stageIndex < 1 || !currentShoppingCart.length } sx={stageIndex != 1 ? tabStyleDisabled : tabStyle} />
                <StyledTab  icon={<Three  />} label="Summary" disabled={stageIndex < 2 || !currentShoppingCart.length } sx={stageIndex != 2 ? tabStyleDisabled : tabStyle} />
                <StyledTab icon={<Four />} label="Confirmation" disabled={stageIndex < 3} sx={stageIndex != 3 ? tabStyleDisabled : tabStyle} />
            </StyledTabs>
          );
        }