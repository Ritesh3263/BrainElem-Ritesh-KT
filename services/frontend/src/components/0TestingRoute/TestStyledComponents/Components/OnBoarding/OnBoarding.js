import React, {useEffect, useRef, useState} from 'react';
import Grid from "@mui/material/Grid";
import {EButton} from "styled_components";
import Boarding from "styled_components/Boarding/Boarding";
import Typography from "@material-ui/core/Typography";

const OnBoarding=(props)=> {

    const tooltip1 = useRef(null);
    const tooltip2 = useRef(null);
    const tooltip3 = useRef(null);
    const tooltip4 = useRef(null);
    const tooltip5 = useRef(null);
    const tooltip6 = useRef(null);
    const tooltip7 = useRef(null);

    const [isOpenBoarding,setIsOpenBoarding] = useState(false);

    const story = [
        {
            component: 'modal',
            title: 'Hi there 👋',
            intro: true,
            children: (
                    <Typography variant="body1"
                        component="h6" className="text-left"
                        style={{color: `rgba(82, 57, 112, 1)`}}>
                        Welcome to User Onboarding Demo. This is a sample illustration of how the library can be implemented.
                        Would you like to have a tour to see how it works? (If you skip, you can click the "Boarding" button to get started again)
                    </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip1,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip2,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip3,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip4,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip5,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip6,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'tooltip',
            ref: tooltip7,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        },
        {
            component: 'speech-bubble',
            title: 'Tip for You 🚀',
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            ),
            className: 'test_class',
        },
        {
            component: 'modal',
            end: true,
            children: (
                <Typography variant="body1"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae fringilla leo. Maecenas elit felis, maximus quis tempor porta, fringilla et nisl. Fusce massa mi, dignissim et pulvinar ac, congue eu sapien.
                </Typography>
            )
        }
    ];

     return (
         <>
            <Grid container className="d-flex flex-row flex-grow-1">
                <Grid item xs={3}>
                    <EButton
                        eSize='small'
                        eVariant="primary"
                        onClick={()=>setIsOpenBoarding(true)}
                    >
                        Boarding
                    </EButton>
                </Grid>
                <Grid item xs={3}>
                    <p ref={tooltip1} className="text-center" style={{backgroundColor:"pink"}}>TEST 1</p>
                </Grid>
                <Grid item xs={3} >
                    <p ref={tooltip2} className="text-center" >TEST 2</p>
                </Grid>
                <Grid item xs={3}>
                    <p ref={tooltip3} className="text-center">TEST 3</p>
                </Grid>


                <Grid item xs={3} style={{height:'600px', display:'flex', alignItems:"end", backgroundColor:"lightblue"}}>
                    <EButton
                        cptRef={tooltip4}
                        eSize='small'
                        eVariant="primary"
                        onClick={()=>{}}
                    >
                        example 1
                    </EButton>
                </Grid>
                <Grid item xs={3} style={{height:'600px', display:'flex', alignItems:"center", justifyContent:'center', backgroundColor:"pink"}}>
                    <EButton
                        cptRef={tooltip5}
                        eSize='small'
                        eVariant="primary"
                        onClick={()=>{}}
                    >
                        example 2
                    </EButton>
                </Grid>
                <Grid item xs={3} style={{height:'600px', display:'flex', alignItems:"start", justifyContent:'center', backgroundColor:"lightblue"}}>
                    <EButton
                        cptRef={tooltip6}
                        style={{marginTop:'100px'}}
                        eSize='small'
                        eVariant="primary"
                        onClick={()=>{}}
                    >
                        example 3
                    </EButton>
                </Grid>
                <Grid item xs={3} style={{height:'600px', display:'flex', alignItems:"end", justifyContent: 'start', backgroundColor:"pink"}}>
                    <EButton
                        cptRef={tooltip7}
                        eSize='small'
                        eVariant="primary"
                        onClick={()=>{}}
                    >
                        example 4
                    </EButton>
                </Grid>
            </Grid>
             <Boarding story={story}
                       isOpenBoarding={isOpenBoarding}
                       setIsOpenBoarding={setIsOpenBoarding}
             />
         </>
     )
 }

export default OnBoarding;