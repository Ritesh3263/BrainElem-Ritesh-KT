// MUI v5
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

// MUI v4
import {theme} from 'MuiTheme'
const palette = theme.palette


const StyledCard = styled(Card)((props) => ({
    display: 'flex',
    borderRadius: 8,
    //backdropFilter: 'blur(20px)',
    boxShadow: '0px 1px 24px -1px rgba(0, 0, 0, 0.1)',
    background: palette.shades.white50
}))

export default StyledCard;