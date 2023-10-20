import React from "react";
import Box from "@material-ui/core/Box";
import {Skeleton} from "@material-ui/lab";

export default function SkeletonLoading(){
    return (
        <Box>
            <Skeleton animation="wave" height={720} sx={{ bgColor: 'pink' }}/>
        </Box>
    )
}