import React from "react";
import { useTranslation } from "react-i18next";

// Styled compnents
import { ECardWithImage, EChip } from "styled_components";

// Icon
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';


// Contexts
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

// MUI v5
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { SvgIcon } from '@mui/material';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const StyledDelateIcon = styled(DeleteIcon)({
    "& line": {
        stroke: palette.neutrals.almostBlack,
    },
    "& path": {
        stroke: palette.neutrals.almostBlack,
    },
})

// Summary component
export default function Element({ element }) {
    const { t } = useTranslation();

    const {
        getCurrency,
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
    } = useShoppingCartContext();


    const StyledName = styled(Typography)({
        color: palette.neutrals.almostBlack,
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    })

    const StyledCategory = styled(StyledName)({
        color: palette.neutrals.darkestGrey,
        whiteSpace: "nowrap",
        height: '24px'
    })
    return (
        <ECardWithImage  imageUrl={element.imageUrl} imageWidth={158} imageHeight={124} style={{ marginBottom: '17px',background:theme.palette.shades.white30 }}>
            <Grid container alignContent="space-between">
                <Grid item xs={12} md={8}>
                    {element?.category && <StyledCategory component="div" sx={{ whiteSpace: { md: "nowrap" }, fontSize: { xs: '10px', md: "14px" } }} variant="subtitle2" >{`${t("Category")} >> ${element?.category}`}</StyledCategory>}
                    <StyledName component="div" variant="h5" sx={{ whiteSpace: { md: "nowrap" }, fontSize: { xs: '16px', md: "22px" } }}>{element?.name}</StyledName>
                    {element?.category && <Box sx={{ mt:1, overflow: 'hidden', height: { xs: '60px', md: "26px" } }}>
                        <EChip size="small" style={{background: theme.palette.other.darkPink, color:theme.palette.neutrals.white}} sx={{ mr: 1, mb:{xs: 1 , md: 0} }} label={t("Course")}></EChip>
                        <EChip size="small" style={{background:theme.palette.neutrals.white}} sx={{ mr: 1,  mb:{xs: 1 , md: 0}}} label={t("Open for enrolments")}></EChip>
                    </Box>}
                </Grid >
                <Grid container item xs={12} md={4} >
                    <Grid container justifyContent="end" alignItems="end" item xs={9} md={11}  sx={{ margin: 'auto', pr: { xs: 1 } }}>
                        <Typography variant="h3" component="h3" sx={{ fontSize: { xs: '18px', md: "36px" }, color: theme.palette.primary.lightViolet }} > {`${element.price} ${getCurrency()}`}</Typography>
                    </Grid>
                    <Grid item xs={3} md={1} sx={{ margin: 'auto' }}>
                        <IconButton onClick={() => { shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE, payload: element }) }} size="small" variant="contained" style={{ marginLeft:"auto", background: theme.palette.shades.white70 }}>
                            <SvgIcon viewBox="0 0 32 32" component={StyledDelateIcon}  />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid >

        </ECardWithImage>
    )
}
