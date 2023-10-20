import React from "react";
import {EIconButton} from 'styled_components'
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(theme => ({
    box: {
        borderRadius: '50%',
        width: '200px',
        height: '200px',
        boxSizing: 'border-box',
        background: 'linear-gradient(91.87deg, #15A3A5 -1.4%, #523970 101.59%)',
        backgroundPosition: '0px 0px',
        margin: '50px auto',
        padding: '8px',
        transition: '10s',
        '&:hover':{
            backgroundPosition: '-1000px 0px',
        }
    },
    glow:{
        borderRadius: '50%',
        width: '115%',
        height: '115%',
        top: '-10px',
        left:'-10px',
        position: 'absolute',
        zIndex: -1,
        background: 'linear-gradient(91.87deg, #15A3A5 -1.4%, #523970 101.59%)',
        backgroundPosition: '0px 0px',
        filter: `blur(10px)`,
        '&:hover':{
            backgroundPosition: '-1000px 0px',
        }
    },
    black:{
        borderRadius: '50%',
        background:'black',
        width:'100%',
        height:'100%',
        position:'relative'
    }
}))

export default function IconButton(){
    const classes = useStyles();
    return(
        <>
        <div style={{padding: "20px", backgroundColor:"black"}}>

            <div className={classes.box}>
                <div className={classes.black}>
                    <div className={classes.glow}>
                    </div>
                </div>
            </div>


        </div>
            <div className="mt-5">
                <EIconButton>
                    <Icon
                        style={{
                            textAlign: "center",
                            height: "26px",
                            width: "26px",
                            fontSize: "0rem",
                            overflow: "visible",
                        }}
                    >
                        <img src="/img/icons/navbar_notifications.svg" style={{ height: "100%" }} />
                    </Icon>
                </EIconButton>
            </div>
        </>
    )
}