import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import {Card, CircularProgress} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CoursePathService from "../../../../services/course_path.service";


export default function ItemImage({image='DEFAULT', fromSingeItem = false}){
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [contentImageLink, setContentImageLink] = useState(undefined);


    useEffect(()=>{
       setIsImageLoading(true);
            let imgLink = undefined;
            if(image !== 'DEFAULT'){
                imgLink =  CoursePathService.getImageUrl(image);
            }else{
                imgLink =  CoursePathService.getImageUrl(image);
            }
            if(imgLink){
                setContentImageLink(imgLink);
                setIsImageLoading(false);
            }
    },[image]);
    return(
            <Card sx={{maxHeight: '250px'}} style={{boxShadow:"none"}}>
                {isImageLoading ? (
                    <Box className="p-4 d-flex justify-content-center">
                        <CircularProgress style={{color: `rgba(82, 57, 112, 1)`}}/>
                    </Box>
                ) : (
                    <CardMedia
                        style={{opacity: fromSingeItem ? 0.95 : 1}}
                        loading="lazy"
                        component="img"
                        height={fromSingeItem ? '210px' : "206px"}
                        //image={contentImageLink}
                        src={contentImageLink}
                        alt="img"
                    />
                )}
            </Card>
    )
}