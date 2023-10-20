import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, CardMedia, CardActions, Grid, Button, Typography, Hidden, Checkbox, } from "@material-ui/core";
import { theme } from "../../MuiTheme";
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useMediaQuery } from "@material-ui/core";
import { IconButton } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

const useStyles = makeStyles(theme => ({
  mainContainer:{
    height: '100%', 
    zIndex: 20, 
  },

  CardContainer: {
    justifyContent: "center",
    alignContent: "center"
  },
  CardContainerAlone: {
    justifyContent: "center",
    alignContent: "unset"
  },
  CardRoot: {
    overflow: 'visible',
    animation: `$display 1000ms`,
    height: 'fit-content',
    maxWidth: 600,
    borderRadius: 16,
    boxShadow: '0px 0px 16px rgba(191, 251, 255, 0.5)'
  },
  CardContentRoot: {
    animation: `$display 2000ms`,
    padding: "0px !important",
    overflow: "hidden"

  },
  selectionArea: {
    background: theme.palette.primary.creme,
    borderRadius: 16

  },

  CardActionsRoot: {
    position: 'relative',
    zIndex: 1 // For border of secondary button
  },
  title: {
    color: theme.palette.primary.violet,
    textAlign: "left",
    fontSize: 20,
  },
  text: {
    color: theme.palette.neutrals.black,
    fontSize: 15
  },
  ameliaImageInside: {
    height: 350,
    minWidth: 120,

    transform: "rotate(-11.31deg)",
    backgroundSize: "contain",
    backgroundPosition: "bottom"
  },
  ameliaImageOutside: {
    zIndex: -2,
    position: 'relative',
    height: 412,
    width: "100%",
    backgroundSize: "contain",
    animation: `$ameliaShow 1500ms`,
    //position: "absolute",
    left: 0,
    bottom: 0,
    backgroundPosition: 'right',
    marginLeft: -50
  },
  ameliaImageOutsideHiding: {
    animation: `$ameliaHide 800ms`,
  },
  shadowShort: {
    position: 'absolute',
    height: 'calc( 100% - 24px )',
    top: 12,
    left: -70,
    width: 70,
  },
  shadowMediumPart1: {
    position: 'absolute',
    height: 'calc( 107% )',
    top: 12,
    left: -70,
    width: 70,
  },
  shadowMediumPart2: {
    zIndex: -1,
    position: 'absolute',
    height: 'calc( 107% )',
    top: 12,
    width: 'calc( 100% - 12px )',
  },
  "@keyframes ameliaShow": {
    "0%": {
      backgroundPosition: -200
    },
    "50%": {
      transform: "rotate(3deg)",
    },
    "100%": {
      backgroundPosition: "right"
    }
  },
  "@keyframes ameliaHide": {
    "0%": {
      backgroundPosition: "right"
    },
    "50%": {
      transform: "rotate(-3deg)",
    },
    "100%": {
      backgroundPosition: -200
    }
  },
  "@keyframes display": {
    "0%": {
      opacity: 0
    },
    "100%": {
      opacity: 1
    }
  },


}))

const getColor = (type) => {
  if (type === "onboarding") return theme.palette.popups.onboarding
  else if (type === "suggestion") return theme.palette.popups.suggestion
  else return theme.palette.popups.basic
}

const Popup = ({ title, text, type = 'basic', confirmButtonText, confirmCallback, cancelButtonText, cancelCallback, showTitleBorder, selections, absolutePosition=false, showAmeliaInside, ameliaAnimation, shadowType = "short", abortCall }) => {
  const { t, i18n, translationsLoaded } = useTranslation();
  const classes = useStyles();

  const [animationFinished, setAnimationFinished] = useState(false)
  const [hideAnimation, setHideAnimation] = useState(false)
  const isNarrowScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
  const isLowScreen = window.innerHeight < 660;
  const isSmallScreen = isNarrowScreen || isLowScreen
  const [chosenCallback, setChosenCallback] = useState(undefined)
  const [selection, setSelection] = useState();


  useEffect(() => {// When callback was set, start hiding animation
    if (chosenCallback && (isSmallScreen || !ameliaAnimation)) eval(chosenCallback)(selection);
    else if (chosenCallback) setHideAnimation(true)
  }, [chosenCallback]);


  const handleAnimationEnd = (event) => {
    if (!animationFinished) setAnimationFinished(true)
    else if (chosenCallback) eval(chosenCallback)(selection);
  }


  //justifyContent: 'center'
  //alignContent: 'center',
  return (
    <Grid container 
    className={classes.mainContainer}
    style={{alignContent: (!isSmallScreen && ameliaAnimation && shadowType === 'medium' ? 'flex-end' : 'center'),
            position: (absolutePosition ? 'absolute' : ""),
            ...(absolutePosition && isSmallScreen && { top: -28 }),// to center and not include mobile header 56px
            ...(absolutePosition && !isSmallScreen && { top: -55 })// to center and not include desktop header 110px
    }}>

      {ameliaAnimation && !isSmallScreen &&
        <Hidden xsDown>
          <Grid item xs={5} md={4} style={{ zIndex: 1021 }}>
            <CardMedia
              onAnimationEnd={handleAnimationEnd}
              className={`${classes.ameliaImageOutside} ${hideAnimation ? classes.ameliaImageOutsideHiding : ""}`}
              image="/img/popup/amelia_1.png"
            >
            </CardMedia>
          </Grid>
        </Hidden>
      }
      <Grid container
        style={{
          zIndex: 1022,
          alignContent: "center",
          justifyContent: ((ameliaAnimation && !isSmallScreen) ? "flex-start" : "center")

        }}
        item xs={12}
        sm={isSmallScreen || !ameliaAnimation ? 12 : 7}
        md={isSmallScreen || !ameliaAnimation ? 12 : 8}
      >
        <Card style={{
          background: getColor(type),
          display: (!hideAnimation && (animationFinished || !ameliaAnimation || isSmallScreen) ? '' : 'none'),
          position: "relative",
          ...(!isSmallScreen && ameliaAnimation && shadowType === 'short' && { bottom: '7px' }),
          ...(!isSmallScreen && ameliaAnimation && shadowType === 'medium' && { position: 'absolute', bottom: '265px' })
        }}
          classes={{ root: classes.CardRoot }}>
            {/* add a cancel button as cross icon in the top right corner. works as finish onboarding function */}
            {abortCall instanceof Function && <IconButton onClick={abortCall} style={{ position: "absolute", top: 0, right: 0, zIndex: 1023 }}>
              <GridCloseIcon />
            </IconButton>}
          <CardContent classes={{ root: classes.CardContentRoot }}>
            <Grid container className={selections ? "py-3 px-3" : ""}>
              <Grid item xs={12} sm={showAmeliaInside ? 7 : 12} md={showAmeliaInside ? 8 : 12} className={`${selections ? classes.selectionArea : ''} p-3`}>
                <Typography style={{ borderBottom: (showTitleBorder ? "1px solid" : "") }} className={`py-2 ${classes.title}`} component="h5" variant="h5">
                  {title}
                </Typography>
                <Typography className={`py-2 ${classes.text}`} variant="subtitle1">
                  {text}
                </Typography>
                {selections && <>
                  {selections.map(option => {
                    return <div index={option._id}><Checkbox
                      edge="start"
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<RadioButtonCheckedIcon />}
                      checked={option.name === selection?.name}
                      tabIndex={option._id}
                      color="secondary"
                      onChange={() => {
                        console.log(option)
                        setSelection(option)
                      }}
                    />
                      <span>{option.name}</span>
                    </div>
                  })
                  }
                  <div>
                    <Checkbox
                      edge="start"
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<RadioButtonCheckedIcon />}
                      checked={selection === null}
                      color="secondary"
                      onChange={() => {
                        setSelection(null)
                      }}
                    />
                    <span>{t("None of those")}</span>
                  </div>
                </>}

                <CardActions style={{ justifyContent: (!cancelButtonText ? "flex-end" : "space-between") }} classes={{ root: classes.CardActionsRoot }}>
                  {cancelButtonText && <Button onClick={() => setChosenCallback("cancelCallback")} disabled={selections && !selection} size="small" variant="contained" color="secondary">{cancelButtonText}</Button>}
                  {confirmButtonText && <Button onClick={() => setChosenCallback("confirmCallback")} disabled={selections && selection===undefined} size="small" variant="contained" color="primary">{confirmButtonText}</Button>}
                </CardActions>
              </Grid>
              {showAmeliaInside && <Grid item sm={5} md={4} style={{ height: 0 }}>

                <CardMedia
                  className={classes.ameliaImageInside}
                  image="/img/popup/amelia.png"
                />

              </Grid>}
            </Grid>

          </CardContent>
          {ameliaAnimation && !isSmallScreen && <>
            {shadowType === 'short' &&
              <div className={classes.shadowShort}>
                <img src={`/img/popup/shadow_${type}_1.png`} style={{ width: '100%', height: "100%" }} alt="" />
              </div>
            }
            {shadowType === 'medium' && <>
              <div className={classes.shadowMediumPart1}>
                <img src={`/img/popup/shadow_${type}_2a.png`} style={{ width: '100%', height: "100%" }} alt="" />
              </div>
              <div className={classes.shadowMediumPart2}>
                <img src={`/img/popup/shadow_${type}_2b.png`} style={{ width: '100%', height: "100%" }} alt="" />
              </div>
            </>}
          </>}
        </Card>
      </Grid>
    </Grid>
  );
}

export default Popup;
