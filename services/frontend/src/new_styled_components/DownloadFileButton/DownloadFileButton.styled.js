import { useTranslation } from "react-i18next";


// Styleds
import { EButton } from "styled_components";
import ESvgIcon from "styled_components/SvgIcon/SvgIcon.styled";
// MUI v5
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

// MUI v4
import { theme } from "../../MuiTheme";

// Icons
import { ReactComponent as ArrowDownIcon } from 'icons/icons_48/Arrow small D.svg';

const palette = theme.palette;


// Dispaly PDF based on provided URL
const DownloadFileButton = ({ name, url }) => {
    const { t } = useTranslation();

    return (<Grid container sx={{ py: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', overflow: 'auto', width: '100%' }}>
        <Typography onClick={() => { window.open(url, '_blank').focus() }} sx={{ ...theme.typography.p, cursor: 'pointer', textDecoration: 'underline', color: theme.palette.primary.violet }}>{name}</Typography>
        <EButton
            sx={{ ml: { md: '32px', lg: '128px' }, display: { xs: 'none', md: 'inline-block' } }}
            onClick={() => { window.open(url, '_blank').focus() }}
            endIcon={<ESvgIcon color={theme.palette.primary.violet} viewBox="18 18 12 12" component={ArrowDownIcon} />}
            eVariant="secondary" eSize={'small'}>
            {t("Open")}
        </EButton>
    </Grid>
    )
}

export default DownloadFileButton;