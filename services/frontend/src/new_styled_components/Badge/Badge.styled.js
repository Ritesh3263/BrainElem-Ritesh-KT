// MUI v5
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette


const StyledBadge = styled(Badge)((props) => {
    var color = ''
    if (props.color in palette.semantic) color = palette.semantic[props.color]
    else if (props.ecolor in palette.semantic) color = palette.semantic[props.ecolor]
    else color = props.ecolor;
    let style = { color: color, background: color }


    if (props.esize == 'small') {
        style.height = '4px'
        style.width = '4px'
        style.minWidth = 'unset'
    }

    return {
        "&.MuiBadge-root": { width: '4px' },
        "& .MuiBadge-badge": style
    }
})

export default StyledBadge;