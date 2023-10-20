
import React from "react";

import { ECard } from 'styled_components'

// MUI v5
import Grid from "@mui/material/Grid";
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

const StyledCardWithImage = (props) => {
    return (
        <ECard {...props} sx={{maxHeight: {md: props.imageHeight}}}>
            <CardMedia
                component="img"
                sx={{ 
                    width: props.imageWidth,
                    height: props.imageHeight, 
                    padding: {xs: '11px', md: '0px'},
                    borderRadius: {xs: '4px', md: '0px'} 
                }}
                image={props.imageUrl}
            />
            <CardContent sx={{ padding: {xs: '11px', md: '20px !important'}, 
                               width: `calc(100% - ${props.imageWidth}px)`
                            }}>
                {props.children}
            </CardContent>
        </ECard>
    )
}

export default StyledCardWithImage;