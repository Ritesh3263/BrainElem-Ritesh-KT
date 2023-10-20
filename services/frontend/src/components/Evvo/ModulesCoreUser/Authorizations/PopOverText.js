import React,{ useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Popover from "@mui/material/Popover";
import Typography from '@mui/material/Typography';
import Box  from '@mui/system/Box';
import { new_theme } from 'NewMuiTheme';
import { ThemeProvider } from '@mui/material';

const PopOverText = ({text}) => {
    const [containerEl, setContainerEl] = useState(null);
    const { t } = useTranslation();

    const handleOpennew = (e) => {
        setContainerEl(e.currentTarget);
        // console.log('hovered')
    };
    const handleClosenew = () => {
        setContainerEl(null);
    };
    const opennew = Boolean(containerEl);
    return (
        <ThemeProvider theme={new_theme}>
        <div>
           <p
                className='txt-ellipses'
                style={{maxWidth:'350px'}}
                onMouseEnter={handleOpennew} 
                onMouseLeave={handleClosenew} 
            >
                {t(text)}
            </p>
                <Popover
                    sx={{
                        pointerEvents: "none",
                    }}
                    open={opennew}
                    anchorEl={containerEl}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    onClose={handleClosenew}
                    disableRestoreFocus
                >
                    <Box className="popover_style" sx={{ backgroundColor: new_theme.palette.primary.PWhite, maxWidth:'400px',  borderRadius: '5px', border: `1px solid ${new_theme.palette.primary.PLGrey}`, padding: '15px' }} >
                        <span></span>
                        {/* <React.Fragment > */}
                            <Typography variant="subtitle3" component="span" >{t(text)}</Typography>
                        {/* </React.Fragment> */}
                       
                    </Box>
                </Popover> 
        </div>
        </ThemeProvider>
    );
};

export default PopOverText;