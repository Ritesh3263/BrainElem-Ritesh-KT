
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";


// MUI v5
import EChip from '../Chip';
// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette


function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export default function ETypeChip(props) {
    const { t } = useTranslation();
    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");

    let color = palette.semantic.info
    // Content
    if (props.type.toLowerCase() == "Presentation".toLowerCase()) color = palette.semantic.info
    else if (props.type.toLowerCase() == "Test".toLowerCase()) color = palette.primary.green
    else if (props.type.toLowerCase() == "Asset".toLowerCase()) color = palette.neutrals.almostBlack
    //Event
    else if (props.type.toLowerCase().includes("Exam".toLowerCase())) color = palette.primary.violet
    else if (props.type.toLowerCase().includes("Homework".toLowerCase())) color = palette.primary.green
    else if (props.type.toLowerCase().includes("Online Class".toLowerCase())) color = palette.semantic.info
    // Other
    else if (props.type.toLowerCase() == "Course".toLowerCase()) color = palette.primary.green
    else if (props.type.toLowerCase() == "Certification".toLowerCase()) color = palette.gradients.fire
    else if (props.type.toLowerCase() == "Internship".toLowerCase()) color = palette.gradients.lightBlue
    
    let label = props.type
    // Temoprary - Online Class will be replaced with Lesson 
    if (label.includes('Online Class')) label = label.replace('Online Class', "Lesson")
    // Capitalize and translate
    label = capitalize(t(label))
    // By default it will show only first letter on mobile
    // When `long` is set it will always show full name
    // When `short` is set it will show only first letter  
    let showFirstLetter = !isMdUp
    if (props.long) showFirstLetter = false
    if (props.short) showFirstLetter = true
    return (
        <EChip {...props} background={palette.neutrals.white} border={true} bordercolor={color} labelcolor={color}  size="small" firstletter={+showFirstLetter} label={label}></EChip>
    )
}