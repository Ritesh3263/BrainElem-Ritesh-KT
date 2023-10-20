import { createTheme } from '@material-ui/core/styles';
import { plPL } from "@material-ui/data-grid";
import { frFR } from "@material-ui/data-grid";
import { enUS } from "@material-ui/data-grid";
import AuthService from "./services/auth.service";

import i18next from "i18next";

let setLanguage = "en";
let user_language = i18next.language ?? "";
if (user_language === "pl") {
    setLanguage = plPL;
} else if (user_language === "fr") {
    setLanguage = frFR;
} else {
    setLanguage = enUS;
}

const palette = {};
palette.primary = {
    main: "#1976d2",
    light: "#4791db",
    dark: "#115293",
    // Colors from UX/UI team
    yellow: '#EFD135',
    green: '#15A3A5',
    violet: '#B372FF',
    lightViolet:'#A85CFF',
    darkViolet: '#523970',
    creme: '#FBF6F3'
}

palette.secondary = {
    main: "#dc004e",
    // Colors from UX/UI team
    greenBootle: "#047072",
    violetSelect: "#DCA3FF",
    ui: "#D8F0F0"

}
palette.error = {
    main: "#f44336"
}
palette.warning = {
    main: "#ff9800"
}
palette.info = {
    main: "#2196f3"
}
palette.success = {
    main: "#4caf50"
}
// Colors from UX/UI team
palette.neutrals = {
    white: "#FDFDFD",
    lightGrey: "#E1E1E4",
    grey: "#C6CBCC",
    grey50: "#91969C",
    darkGrey: "#606768",
    darkestGrey: "#495151",
    fadeViolet: "#EEEBF1",
    popcover: "rgba(16, 40, 101, 0.5)",
    almostBlack: "#303838"
}

palette.other = {
    lightGreen: '#5BBFC0',
    lightPink: '#D7A6E9',
    darkPink: '#C57DDE'

}

palette.gradients = {
    pink: `linear-gradient(94.87deg, ${palette.other.darkPink} 8.06%, ${palette.other.lightPink} 113.25%);`,
    green: `linear-gradient(94.44deg,  ${palette.primary.green} 6.96%, ${palette.other.lightGreen} 109.69%);`,
    lila: `linear-gradient(94.93deg, #A26DE0 6.9%, #BF9BEA 110.93%);`,
    tab: `linear-gradient(91.84deg, ${palette.primary.violet} 15.09%, #C695FF 100%);`,
    violet: `linear-gradient(91.84deg, #6D30B7 15.09%, #9B71CD 100%);`,
    fire: `linear-gradient(94.8deg, #DB7E24 -5.77%, #EFCC1A 123.46%);`,
    lightBlue: `linear-gradient(94.99deg, #7196F7 10.35%, #9FB8F9 113.22%);`
}

palette.glass = {
    light: `linear-gradient(291.42deg, rgba(255, 255, 255, 0.4) 11.43%, rgba(255, 255, 255, 0.3) 92.97%)`,
    medium: `linear-gradient(291.42deg, rgba(255, 255, 255, 0.5) 11.43%, rgba(255, 255, 255, 0.3) 48.38%, rgba(255, 255, 255, 0.6) 92.97%)`,
    opaque: `linear-gradient(291.42deg, rgba(255, 255, 255, 0.75) 11.43%, rgba(255, 255, 255, 0.6) 48.38%, rgba(255, 255, 255, 0.8) 92.97%)`
}
palette.shades = {
    whiteStroke: `linear-gradient(90deg, rgba(255, 255, 255, 0.7) 9.36%, rgba(255, 255, 255, 0.4) 91.64%)`,
    white30: `rgba(255, 255, 255, 0.3)`,
    white50: `rgba(255, 255, 255, 0.5)`,
    white70: `rgba(255, 255, 255, 0.7)`,
    white90: `rgba(255, 255, 255, 0.9)`,
}

palette.popups = {
    onboarding: `linear-gradient(225.4deg, #9CFFDB 16.09%, #8AFDB8 82.46%)`,
    basic: `linear-gradient(238.29deg, #FFE6A6 17.73%, #FFD18C 94.83%)`,
    suggestion: `linear-gradient(234.69deg, #77F6FF 7.23%, #99F8FF 77.61%)`
}

palette.semantic = {
    error: "#E22D6E",
    success: "#51CB32",
    warning: "#EFD135",
    info: "#3076B7"
}

// Ux defined classes
var classes = {
    subheader3: {
        fontFamily: "Nunito",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: '24px',
        lineHeight: '33px',
    },
    "icon-button-large": { // size `large` is not supported for IconButton
        width: '48px',
        height: '48px',
    },
    "icon-button-extra-large": {// size `extraLarge` is not supported for IconButton
        width: '64px',
        height: '64px',
    },
}

const typography = {
        body1: {
            fontFamily: 'Nunito',
            fontStyle: 'normal',
        },
        h3: {
            color: palette.primary.darkViolet,//Defalult
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '36px',
            lineHeight: '49px',
            textAlign: 'center',
        },
        h5: {
            color: palette.primary.darkViolet,//Defalult
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '25px',
            textAlign: 'center'
        },
        h4: {
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            padding: '10px',
            fontWeight: 'bold',
            fontSize: '40px',
            lineHeight: '65px',
            textAlign: 'center'
        },
        sh3: {
            color: palette.primary.creme,//Defalult
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontSize: '24px',
            lineHeight: '33px',
            textAlign: 'left',
        },
        h: { // Global h - Typography sx={{...theme.typography.h, fontSize: 15}}>
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontWeight: 'bold',
            lineHeight: '150%',
            color: palette.primary.darkViolet,
        },
        p: { // Global p - Typography sx={{...theme.typography.p, fontSize: 10}}>
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '150%',
            color: palette.neutrals.almostBlack
        },
        p16: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '150%',
            color: palette.neutrals.almostBlack
        },
        contextualItalic: {
            fontFamily: 'Roboto',
            fontStyle: 'italic',
            fontWeight: '300',
            fontSize: '14px',
            lineHeight: '150%',
            color: palette.neutrals.almostBlack
        },
}

export const theme = createTheme(setLanguage, {
    palette: palette,
    classes: classes,
    typography: typography,
    overrides: {
        MuiIconButton: {
            sizeSmall: {
                fontSize: '14px',
                lineHeight: '24px',
                width: '24px',
                height: '24px',
                "& .m-2": { // Fix for old edit icons inside tables which used margins
                    margin: 'unset !important'
                }
            },
            colorPrimary: {
                background: palette.gradients.pink,
                color: palette.primary.creme,
                "&:hover": {
                    backgroundColor: 'unset',
                    background: `${palette.gradients.lila} !important`
                },
                "&:active": {
                    background: `${palette.primary.yellow} !important`
                },
            },
            colorSecondary: {
                backgroundColor: `${palette.primary.creme} !important`,
                color: `${palette.primary.darkViolet} !important`,

                '&:hover': {
                    backgroundColor: `${palette.neutrals.fadeViolet} !important`,
                },
                "&:active": {
                    background: `${palette.primary.violet} !important`
                },

            },

        },
        MuiButton: {
            root: {
                borderRadius: `16px`,
                padding: "4px 24px !important",// 4px instead of 8px
                marginRight: `3px`,
                textTransform: "none",
                outlined: "none",
                "&$disabled": {
                    "border": "none"
                }
            },
            label: {
                //fontWeight: '600',
                fontFamily: "Nunito",
            },

            contained: {
                color: `rgba(0, 0, 0, 1)`,
            },
            containedPrimary: {
                background: palette.gradients.pink,
                color: palette.primary.creme,
                "&:hover": {
                    backgroundColor: 'unset',
                    background: `${palette.gradients.lila} !important`
                },
                "&:active": {
                    background: `${palette.primary.yellow} !important`,
                    color: `${palette.primary.darkViolet} !important`,
                },
            },
            containedSecondary: {
                padding: "4px 19px !important",//One px less as there is a border
                backgroundColor: palette.neutrals.white,
                color: palette.primary.violet,
                position: 'relative',
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                //transformStyle: "preserve-3d",
                '&:hover': {
                    backgroundColor: `${palette.neutrals.white} !important`
                },
                "&:active": {
                    backgroundColor: `${palette.primary.violet} !important`,
                    border: '2px solid transparent',
                    color: `${palette.primary.creme} !important`,
                    '&:after': {
                        content: "",
                        background: `${palette.primary.creme} !important`,
                    },
                },
                '&:after': {
                    position: 'absolute',
                    top: '-2px',
                    bottom: '-2px',
                    left: '-2px',
                    right: '-2px',
                    content: "''",
                    zIndex: -1,
                    borderRadius: '16px',
                    background: `linear-gradient(132.79deg, #C972FF 0%, ${palette.primary.green} 104.17%);`,

                },
                // Add className="Nav-btn" to header-nav-btn to disable btn :after background => example [http://localhost/modules-core/users]
                '&.Nav-btn':{
                    borderColor: `${palette.neutrals.white}`,
                    '&:after':{
                        background: 'none !important',
                    },
                    '&:hover':{
                        borderColor: `${palette.primary.violet}`,
                    }
                },
                '&.MuiButton-containedSizeLarge': {
                    padding: "7px 31px !important",//One px less as there is a border
                },
                '&.MuiButton-containedSizeLarge:after': {
                    borderRadius: '24px',
                },


            },
            sizeLarge: {
                padding: "8px 32px !important",// 8px instead 16px
                borderRadius: `24px`,
            },
            colorInherit: {
                background: `linear-gradient(94.87deg, #f44336 8.06%, #f44336 113.25%)`,
                color: `rgba(253, 253, 253, 1)`,
                '&:hover': {
                    background: `linear-gradient(94.87deg, #f44336 8.06%, #f44336 113.25%)`,
                }
            },
            textPrimary: {
                // background: `linear-gradient(94.87deg, #EFD135 8.06%, #EFD135 113.25%)`,
                // color: `rgba(253, 253, 253, 1)`,
                // '&:hover': {
                //     backgroundColor: `linear-gradient(94.87deg, #EFD135 8.06%, #EFD135 113.25%)`,
                // }
                background: `linear-gradient(94.87deg, #FDFDFD 8.06%, #FDFDFD 113.25%)`,
                //color: `rgba(168, 92, 255, 1)`,
                color: `rgba(168, 92, 255, 1)`,
                border: `1px solid rgba(168, 92, 255, 1)`,
            },
            // outlinedPrimary:{
            //     background: `linear-gradient(94.87deg, #f44336 8.06%, #f44336 113.25%)`,
            //     color: `rgba(253, 253, 253, 1)`,
            //     border: "none !important"
            // },
            // outlinedSecondary:{
            //     background: `linear-gradient(94.87deg, #EFD135 8.06%, #EFD135 113.25%)`,
            //     color: `rgba(253, 253, 253, 1)`,
            //     border: "none !important"
            // },
        },
        MuiCheckbox: {
            root: {

            },
            colorSecondary: {
                background: 'transparent !important',
                '&:hover': {
                    background: palette.primary.creme,
                },
                "&:active": {
                    background: palette.primary.violet
                },
                color: palette.secondary.violetSelect,
                '&.Mui-checked': {
                    color: palette.secondary.violetSelect,
                    '&:hover': {
                        backgroundColor: `${palette.primary.creme} !important`,
                    },
                }
            },
            colorPrimary: {
                background: 'transparent !important',
                '&:hover': {
                    background: palette.primary.creme,
                },
                "&:active": {
                    background: palette.primary.yellow
                },
                color: palette.primary.violet,
                '&.Mui-checked': {
                    color: palette.primary.violet,
                    '&:hover': {
                        backgroundColor: `${palette.primary.creme} !important`,
                    },
                }
            }
        },
        MuiChip: {
            root: {
                color: palette.primary.darkViolet,
                backgroundColor: palette.neutrals.fadeViolet,
                textTransform: "capitalize",
                paddingLeft: 4,
                paddingRight: 4,
            },
            colorPrimary: {
                color: palette.primary.darkViolet,
                backgroundColor: palette.neutrals.fadeViolet,
            },
            colorSecondary: {
                color: palette.primary.darkViolet,
                backgroundColor: palette.neutrals.fadeViolet,
            },
            outlined: {
                backgroundColor: 'transparent',
                color: palette.semantic.info,
                borderColor: palette.semantic.info,
            },
            outlinedPrimary: {
                color: palette.primary.green,
                borderColor: palette.primary.green,
            },
            outlinedSecondary: {
                color: palette.primary.violet,
                borderColor: palette.primary.violet,
            },
            labelSmall: {
                fontSize: 10,
            }

        },
        MuiPaper: {
            elevation10: {
                backgroundColor: `rgba(255,255,255,0.3)`,
                boxShadow: "none",
                borderRadius:"0"
            },
            elevation11: {
                backgroundColor: `rgba(255,255,255,0.65)`,
                boxShadow: "none",
                '&.hoverON':{
                    '&:hover': {
                        scale: 1.05,
                        cursor:'pointer !important'
                    },
                },
            },
            elevation12: {
                backgroundColor: `rgba(255,255,255,0.0)`,
                boxShadow: "none",
            },
            elevation13: {
                backgroundColor: `rgba(255,255,255,0.3)`,
                boxShadow: "none",
                borderRadius: "22px"
            },
            elevation14: {
                background: `linear-gradient(91.87deg, #15A3A5 -1.4%, #523970 101.59%)`,
                boxShadow: "none"
            },
            elevation15: {
                backgroundColor: `rgba(255,255,255,0.2)`,
                boxShadow: "none"
                
            },
            elevation16: {
                backgroundColor: `rgba(255,255,255,0.3)`,
                boxShadow: `0px 1px 24px -1px rgba(0, 0, 0, 0.1)`,
            },
            elevation17: {
                background: palette.glass.light,
                boxShadow: "none",
                borderRadius: "0px",
                padding:'1.5rem',
                minHeight:"100%",
            },
        },
        MuiDataGrid: {
            root: {
                border: 'none !important',
                '& .super-app-theme--cell': {
                    display: 'flex',
                    justifyContent: 'center',
                },
                '& .MuiDataGrid-row': {
                    backgroundColor: `rgba(255,255,255,0.65)`,
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: `rgba(255,255,255,0.65) !important`,
                },
            },
        },
        MuiTableContainer: {
            root: {
                backgroundColor: `rgba(255,255,255,0.0)`
            }
        },
        // MuiTable:{
        //     root:{
        //         backgroundColor: `rgba(255,255,255,0.0) !important`,
        //     }
        // },
        MuiTableHead: {
            root: {
                backgroundColor: `rgba(255,255,255,0.65)`,
            }
        },
        MuiTableRow: {
            root: {
                backgroundColor: `rgba(255,255,255,0.35)`,
            }
        },
        // MuiTableCell:{
        //     root:{
        //         backgroundColor: `rgba(255,255,255,0.0) !important`,
        //     },
        //     head:{
        //         backgroundColor: `rgba(255,255,255,0.0) !important`,
        //     },
        //     body:{
        //         backgroundColor: `rgba(255,255,255,0.0) !important`
        //     },
        //     sizeSmall:{
        //         backgroundColor: `rgba(255,255,255,0.0) !important`
        //     }
        // },
        MuiList: {
            root: {
                backgroundColor: `rgba(255,255,255,0.0)`,
            }
        },
        MuiAccordionSummary: {
            root: {
                borderRadius: "4px"
            },
        },
        MuiAccordion: {
            rounded: {
                backgroundColor: `rgba(255,255,255,0.35)`,
            }
        },
        MuiCard: {
            root: {
                //overflow: "scroll",
                background: palette.glass.light,
            }
        },
        MuiCardHeader: {
            title: {
                ...classes.subheader3,
                color: palette.primary.darkViolet,
            },
        },
        MuiCardActions: {
            root: {
                backgroundColor: `rgba(255,255,255,0.0)`,
            }
        },
        MuiCardContent: {
            root: {
                overflowY: "scroll"
            }
        },
        MuiStepper: {
            root: {
                backgroundColor: `rgba(255,255,255,0.65)`,
            }
        },

        MuiTabs: {
            indicator: {
                display: "none"
            }
        },

        MuiFilledInput: {
            root: {
                color: palette.neutrals.darkestGrey,
                backgroundColor: palette.neutrals.white,
                opacity: 0.7,
                borderBottom: `2px solid ${palette.primary.green}`,
                borderRadius: '8px 8px 0px 0px',
                "&$disabled": {
                    opacity: 0.4,
                    borderBottom: `2px solid ${palette.neutrals.darkestGrey}`,
                },
                '&$focused': {
                    opacity: 0.9,
                    backgroundColor: palette.neutrals.white,
                    borderBottom: `2px solid ${palette.primary.violetSelect}`,
                },
                '&:hover': {
                    opacity: 0.75,
                    backgroundColor: palette.neutrals.white,
                    borderBottom: `2px solid ${palette.secondary.violetSelect}`,
                }
            },

            underline: {
                '&:after': {
                    borderBottomColor: `none`
                },
                '&:before': {
                    borderBottom: `none`
                },
                '&$focused': {
                    '&:before': {
                        borderBottom: `none`,
                    },
                    '&:after': {
                        borderBottom: `none`,
                    },
                },
                '&:hover': {
                    '&:before': {
                        borderBottom: `none`,
                    },

                },
                "&$disabled": {
                    '&:before': {
                        borderBottom: `none`,
                    },
                }

            }
        },
        MuiInput:{
          underline: {
              color: palette.primary.darkViolet,
              '&.Mui-focused': {
                  '&:after':{
                      borderBottom: `2px solid ${palette.primary.green}`
                  }
              },
              '&.MuiInputBase-formControl':{
                  '&:after':{
                      borderBottom: `2px solid ${palette.primary.green}`
                  }
              }
          }
        },
        MuiInputLabel: {
            filled: {
                '&$focused': {
                    color: palette.neutrals.darkestGrey,
                }
            }
        },
        MuiLinearProgress: {
            colorPrimary: {
                backgroundColor: palette.other.lightGreen
            },
            barColorPrimary: {
                backgroundColor: palette.primary.green
            }
        },
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: `rgba(238, 235, 241, 1)`,
                height: 'auto',
            }
        },
        MuiPickersYear: {
            yearSelected: {
                color: `rgba(82, 57, 112, 1)`
            }
        },
        MuiPickersDay: {
            daySelected: {
                backgroundColor: `rgba(21, 163, 165, 1)`,
                '&:hover': {
                    backgroundColor: `rgba(21, 163, 165, 1)`,
                }
            },
            current: {
                color: `rgba(82, 57, 112, 1)`
            }
        },
        MuiPickersToolbarText: {
            toolbarTxt: {
                color: `rgba(82, 57, 112, 1)`
            },
            toolbarBtnSelected: {
                color: `rgba(82, 57, 112, 1)`
            }
        },
        MuiPickersCalendarHeader: {
            switchHeader: {
                backgroundColor: `rgba(251, 246, 243, 1)`
            },
            iconButton: {
                color: `rgba(82, 57, 112, 1)`,
                backgroundColor: `rgba(238, 235, 241, 1)`
            }
        },
        MuiPickersClockPointer: {
            pointer: {
                backgroundColor: `rgba(82, 57, 112, 1)`
            },
            thumb: {
                border: `14px solid rgba(82, 57, 112, 1)`
            }
        },
        MuiPickersClockNumber: {
            clockNumberSelected: {
                backgroundColor: `rgba(82, 57, 112, 1)`
            }
        },
        MuiPickersClock: {
            pin: {
                backgroundColor: `rgba(82, 57, 112, 1)`
            }
        },
        MuiSlider: {
            root: {
                height: 60

            },
            rail: {
                color: palette.neutrals.darkestGrey,
                height: 12,
                borderRadius: 4

            },
            track: {
                color: palette.secondary.violetSelect,
                height: 12,
                borderRadius: 4
            },
            thumb: {
                color: palette.primary.violet,
                height: 24,
                borderRadius: 4,
            },
            valueLabel: {
                color: palette.neutrals.darkestGrey,
                background: palette.neutrals.fadeViolet,
                borderRadius: 4,
                top: -20,
                height: 24,
                "& span": {
                    height: '100%',
                    color: palette.neutrals.darkestGrey,
                    background: 'transparent',
                    borderRadius: 0,
                    transform: 'unset',
                    "& *": {
                        height: "unset",
                        transform: 'unset'
                    }
                }
            },
            mark: {
                width: 1,
                color: palette.neutrals.almostBlack,
                top: 41,
                height: 16
            },
            markActive: {
                width: 1,
                opacity: 1,
                backgroundColor: palette.neutrals.almostBlack,
            },
            markLabel: {
                opacity: 1,
                fontSize: 14,
                top: 60,
                color: palette.neutrals.almostBlack,
            },
            markLabelActive: {
                color: palette.neutrals.almostBlack,
            }
        },
        MuiDialog: {
            paper: {
                backgroundColor: `rgba(255, 255, 255, 0.65)`,
            }
        },
        // MuiBackdrop: {
        //     root: {
        //         background: 'rgba(0, 0, 0, 0.5) !important',
        //     }
        // },
        MuiBadge: {
            colorPrimary:{
                backgroundColor:'#EFD135'
            }
        }
    },
});