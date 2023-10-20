import {styled} from "@mui/system";
import Box from '@mui/material/Box';

const CoursePriceChipStyled = styled(Box)({
    //Size
    width: 88,
    height: 36,
    // Styles
    borderRadius: "16px 0px 0px 16px",
    padding: "8px 16px 8px 32px",
    // Position
    position: 'absolute', 
    bottom: 10,
    right: 0,
    // Text
    whiteSpace: 'nowrap',
    fontSize: '14px',
    textAlign: 'end',
    lineHeight: '20px',
    fontFamily: "Roboto",
});

export default CoursePriceChipStyled;