import { styled } from "@mui/system";
import Box from '@mui/material/Box';

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TimeIcon } from 'icons/icons_32/Menu schedule_32.svg';
import { ReactComponent as UserIcon } from 'icons/icons_32/Menu users_32.svg';
import { ReactComponent as PriceIcon } from 'icons/icons_32/Bookmark_32.svg';
import { ReactComponent as LocationIcon } from 'icons/icons_32/Location_32.svg';



const getIcon = (iconName, color) => {
    var icon;
    switch (iconName) {
        case 'time': icon = TimeIcon; break;
        case 'user': icon = UserIcon; break;
        case 'price': icon = PriceIcon; break;
        case 'location': icon = LocationIcon; break;
    }

    let styledIcon = styled(icon)({

        "& line": {
            stroke: color,
            fill: 'transparent'
        },
        "& polyline": {
            stroke: color,
            fill: 'transparent'
        },
        "& path": {
            stroke: color,
            fill: 'transparent'
        },
        '& circle': {
            stroke: color,
            fill: 'transparent'
        },
    })


    return styledIcon

}

const Wrapper = styled(Box)({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
})


const Text = styled('span')((props) => ({
    color: props.color,
    fontSize: 14,
    fontFamily: 'Roboto',

    display: 'inline-flex',
    flexWrap: 'nowrap',
    maxWidth: 'calc(100% - 32px)',
}));

const Property = styled('div')((props) => ({
    flex: '0 1 auto',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
}))

const Value = styled('div')((props) => ({
    flex: '1 0 auto',
    whiteSpace: 'nowrap',
}))

const StyledPropertyWithIcon = (props) => {
    return (
        <Wrapper>
            <SvgIcon sx={{ width: 32, height: 32 }} viewBox="0 0 32 32" component={getIcon(props.icon, props.color)} />
            <Text sx={{pl: 1}} color={props.color}>
                {props.property && <Property>{`${props.property}:`}</Property>}
                <Value>&nbsp;{props.value}&nbsp;</Value>
            </Text>
        </Wrapper>
    )
}

export default StyledPropertyWithIcon;