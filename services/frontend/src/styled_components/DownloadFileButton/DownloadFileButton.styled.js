import { useTranslation } from "react-i18next";


// Styleds
import { EButton } from "styled_components";
import StyledButton from "new_styled_components/Button/Button.styled";
import ESvgIcon from "styled_components/SvgIcon/SvgIcon.styled";
// MUI v5
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

// MUI v4
import { theme } from "../../MuiTheme";

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as ArrowDownIcon } from 'icons/icons_48/Arrow small D.svg';

const palette = theme.palette;


// Dispaly PDF based on provided URL
const DownloadFileButton = ({ name, url }) => {
    const { t } = useTranslation();

    return (<Grid container sx={{ py: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', overflow: 'auto', width: '100%' }}>
        {/* <Typography onClick={() => { window.open(url, '_blank').focus() }} sx={{ ...theme.typography.p, cursor: 'pointer', textDecoration: 'underline', color: theme.palette.primary.violet }}>{name}</Typography> */}
        <StyledButton
            sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', padding: '5px 4px 5px 15px !important' }}
            onClick={() => { window.open(url, '_blank').focus() }}
            eVariant="primary" eSize="small">
            {t("Open")} <KeyboardArrowDownIcon sx={{height: '30px', width: '30px'}} />
        </StyledButton>
    </Grid>
    )
}

export default DownloadFileButton;