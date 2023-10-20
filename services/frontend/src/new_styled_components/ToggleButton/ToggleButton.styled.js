// MUI v5
import ToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';

// MUI v4
import { theme } from "../../MuiTheme";
const palette = theme.palette;



const EToggleButton = styled(ToggleButton)({
  height:"40px",
  fontFamily:"Roboto",
  fontSize:"14px",
  fontWeight:"400",
  textTransform: "none",
  lineHeight:"21px",
  color:theme.palette.neutrals.darkestGrey,
"&.Mui-selected, &.Mui-selected:hover": {
  color: "white",
  background: theme.palette.primary.lightViolet
},
});


export default EToggleButton;