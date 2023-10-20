import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import withWidth, {isWidthUp} from "@material-ui/core/withWidth";
import { Typography} from '@mui/material';

const WelcomePage=({width})=>{
    function getNumberOfCols(){
        if (isWidthUp("md", width)) return 3;
        return 1;
    }

    function getFotSize(){
        if (isWidthUp("xl", width)) return "h4";
        if (isWidthUp("lg", width)) return "h5";
        if (isWidthUp("md", width)) return "h6";
        if (isWidthUp("xs", width)) return "h5";
        return "body2";
    }

    return (
        <ImageList sx={{ width: "auto", height: "auto", maxWidth: 1600, minWidth: 320}} cols={getNumberOfCols()} gap={4} rowHeight={250} variant="quilted">
            {/*<ImageListItem key="Subheader" cols={getNumberOfCols()}>*/}
            {/*    <ListSubheader component="div">December</ListSubheader>*/}
            {/*</ImageListItem>*/}
            {itemData.map((item) => (
                <ImageListItem key={item.img} cols={1} className="p-2 mr-2 ml-2" sx={{backgroundColor:`rgba(255,255,255,0.65)`, borderRadius: 2}}>
                    <img
                        src={`${item.img}?h=250&fit=crop&auto=format`}
                        srcSet={`${item.img}?h=250&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        sx={{bgcolor: `rgba(255,255,255,0.75)`, color: `rgba(168, 92, 255, 1)`}}
                        className="mr-2 ml-2 mb-2 pr-2"
                        title={
                            <Typography variant={getFotSize()} component="h2" className="text-left" sx={{ fontWeight: "bold", color: `rgba(168, 92, 255, 1)` }}>
                                {item.title}
                            </Typography>}
                        //subtitle={item.secondTitle}
                        actionIcon={
                            <IconButton
                                sx={{
                                    color: `rgba(255,255,255,0.65)`,
                                    bgcolor: `rgba(168, 92, 255, 1)`,
                                    ":hover":{
                                        color: `rgba(168, 92, 255, 1)`,
                                        bgcolor: `rgba(255,255,255,0.3)`,
                                    }
                                }}
                                aria-label={`Log in ${item.title}`}
                            >
                                <LoginIcon />
                            </IconButton>
                        }
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

const itemData = [
    {
        img: "/img/welcome_screen/trainee.png",
        title: 'School Center',
        secondTitle: 'Log in to School Center',
    },
    {
        img: "/img/welcome_screen/training_center_small.png",
        title: 'Training Center',
        secondTitle: 'Log in to Training Center',
    },
    {
        img: '/img/login_screen/login_cognitive.png',
        title: 'Cognitive Center',
        secondTitle: 'Log in to Cognitive Center',
    },
];
export default withWidth()(WelcomePage);