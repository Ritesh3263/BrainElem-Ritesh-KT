import React from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import StyledButton from "new_styled_components/Button/Button.styled";
import { Grid, Box, Typography, Divider, Menu, MenuItem, ThemeProvider } from "@mui/material";
import { BiCalendarEvent } from "react-icons/bi";
// import CollapsibleTable from "./TraineeTbl";
import { new_theme } from "NewMuiTheme";
import "./FullTrainee.scss";



export default function Progress(chapters) {
    const { t } = useTranslation();
    const { F_getLocalTime } = useMainContext();
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <>
        {chapters?.progressData &&  <ThemeProvider theme={new_theme}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box class="search_filter filter">
                            <div class="filterRight-sec">
                                <input aria-invalid="false" placeholder={t("Search Value")} type="text" style={{ border: '1px solid', borderColor: new_theme.palette.primary.PBorder, borderRadius: '8px', padding: '5px' }}>
                                </input>
                            </div>
                            <div class="exportBtn">
                                <StyledButton eVariant="secondary" eSize="small" sx={{}}>{t("Export")}</StyledButton>
                                <Menu
                                    id="export-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'export-button',
                                    }}
                                >
                                    <MenuItem >{t("Export as CSV")}</MenuItem>
                                    <MenuItem >{t("Print")}</MenuItem>
                                </Menu>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            {chapters?.progressData.map(item => {
                                return <>
                                    <Accordion expanded={expanded === 'panel1'} className="progress_accordion_trainee" onChange={handleChange('panel1')} sx={{ mb: 2, border: 'none', boxShadow: 'none' }}>
                                        <AccordionSummary
                                            sx={{ borderRadius: '8px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, minHeight: '32px !important' }}
                                            expandIcon={<ExpandMoreIcon sx={{ height: '32px', width: '32px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', color: new_theme.palette.newSupplementary.NSupText, padding: '4px' }} />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                        >
                                            <Typography variant="body2" component="span">{item?.name}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                                            {item?.chosenChapters.map(chosenChapter => {
                                                return <>
                                                    {chosenChapter?.chosenContents.map(content => {
                                                        return <>
                                                            <Box className="box_main_item" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX:"scroll", backgroundColor: new_theme.palette.primary.PWhite }}>
                                                                    <div className="inner_box_pri" style={{paddingRight:"20px"}}>
                                                                        <Typography variant="body2" component="span" sx={{ textWrap:'nowrap'}}>{content?.content?.title}</Typography>
                                                                    </div>
                                                                    <div className="inner_box_item">
                                                                        <Box className="box_flex" style={{ paddingRight: '20px' }}>
                                                                            <ListItemText className='text-right pr-2' primary={<Chip style={{ fontSize: '14px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, textWrap:'nowrap' }} label={content?.content?.eventType ? content?.content?.eventType : "-"} />} />
                                                                        </Box>
                                                                        {content?.content?.date && <Box className="box_flex">
                                                                            <ListItemText className='text-right pr-3'
                                                                                primary={<Typography variant="subtitle1" component="span" sx={{ fontWeight: '600', textWrap:'nowrap' }}>{t("Scheduled at")}</Typography>} />
                                                                                <ListItemText className='text-center px-2'
                                                                                primary={<Typography variant="body4" component="span" sx={{ border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '8px', padding: '5px 10px', display:'flex' }}>{F_getLocalTime(content?.content?.date, true)}<BiCalendarEvent style={{ marginLeft: '10px', width: '20px', height: '20px', verticalAlign: 'text-top', color: new_theme.palette.newSupplementary.NSupText, cursor: 'pointer' }}
                                                                                // onClick={() => {
                                                                                //     if (!userPermissions.bcCoach.access) {
                                                                                //         let event = {
                                                                                //             assignedContent: cont?.content._id,
                                                                                //             assignedChapter: chapter.chapter._id,
                                                                                //         }
                                                                                //         setEventHelper(p => {
                                                                                //             return ({
                                                                                //                 ...p, event: { ...p.event, ...event }, isOpen: true
                                                                                //             })
                                                                                //         });
                                                                                //     }
                                                                                // }
                                                                                // } 
                                                                                />
                                                                                </Typography>} />
                                                                        </Box>}
                                                                        <Box className="box_flex" sx={{ mr: 2, textWrap:'nowrap' }}>
                                                                            <ListItemText className='text-right pr-3' primary={<Typography variant="body4" component="span" sx={{ fontWeight: '600' }}>{t("Status")}</Typography>} />
                                                                            <Typography variant="body4" component="span" sx={{ border: `1px solid ${new_theme.palette.newSupplementary.NSupText}`, borderRadius: '6px', minWidth: '100px', padding: '5px 6px', display: 'flex', justifyContent: 'space-between' }}>{content?.content?.status ? content?.content?.status : t("TO DO")}</Typography>
                                                                        </Box>
                                                                        <IconButton style={{ height: "15px", width: "15px", color: new_theme.palette.newSupplementary.NSupText }}>
                                                                            <KeyboardArrowRightIcon />
                                                                        </IconButton>
                                                                    </div>
                                                            </Box>
                                                        </>
                                                    })}
                                                </>
                                            })}

                                        </AccordionDetails>
                                    </Accordion>
                                </>
                            })

                            }
                        </Box>
                    </Grid>

                    {/* <div id="divcontents">
                    <CollapsibleTable className="tableIn1"  />
                </div> */}
                </Grid>
            </ThemeProvider>
        }
        {!chapters?.progressData &&
            <span>{t("No data")}</span>
        }
        
        </>
    )
}