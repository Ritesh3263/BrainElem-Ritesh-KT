import React from "react";
import { useTranslation } from "react-i18next";

// Components
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import StyledButton from "new_styled_components/Button/Button.styled";

// Colors
import { new_theme } from "NewMuiTheme";


export default function PricingBlock({ title, image, descriptions, price, onButtonClick }) {
    const { t } = useTranslation(['translation', 'payment']);

    return (
        <Grid container sx={{ p: '24px', justifyContent: 'center', width: '100%' }}>
            <Grid item container sx={{
                background: 'white',
                boxShadow: `0px 4px 4px ${new_theme.palette.shades.black25}`,
                border: `1px solid ${new_theme.palette.primary.PBorderColor}`,
                borderRadius: '16px',
                maxWidth: '520px',
                display: "block",
                p: "24px"
            }}>
                <Typography sx={{ mb: '36px', fontSize: "24px", color: new_theme.palette.primary.MedPurple, fontWeight: "bold" }} >
                    {title}
                </Typography>
                <Grid item container sx={{ justifyContent: 'center' }}>
                    <Grid item sx={{ mb: '16px' }}>
                        <img style={{ width: '100%', maxWidth: '314px' }} src={image} />
                    </Grid>
                    <Grid item sx={{ width: '314px', mb: '36px' }}>
                        <ul style={{ padding: 0, paddingLeft: '16px' }}>
                            {descriptions.map(text =>
                                <li>
                                    <Typography sx={{ mb: '16px', fontSize: "18px", fontFamily: 'Nunito', color: new_theme.palette.neutrals.darkGrey }} >
                                        {text}
                                    </Typography></li>
                            )}
                        </ul>
                    </Grid>
                </Grid>
                <Grid item container sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ mb: '16px', fontSize: "24px", color: new_theme.palette.neutrals.darkGrey }} >
                        {t("payment:SPECIAL_OFFER")}
                    </Typography>
                    <Typography sx={{ mb: '16px', fontSize: "24px", color: new_theme.palette.neutrals.darkGrey, fontWeight: 'bold' }} >
                        {price}
                    </Typography>
                    <StyledButton sx={{ width: '100%', mb: '16px' }} eSize="large"
                        onClick={onButtonClick}>
                        {t("payment:PROCEED_TO_PAYMENT")}
                    </StyledButton>
                    <Typography sx={{ fontSize: "14px", color: 'black' }} >
                        {t("payment:CANCEL_ANYTIME")}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}