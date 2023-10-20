import React, { useState } from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ContentItem from "./ContentItem";
import { ThemeProvider, Typography } from '@mui/material';
import { new_theme } from 'NewMuiTheme';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';


export default function ChapterItem({ chapter, index, isOpenChapter, setIsOpenChapter, setCurrentCourseObject, setContentDetailsHelper, contentDetailsHelper, groupId, manageContentHelper, setManageContentHelper, setEventHelper }) {


    return (
        <ThemeProvider theme={new_theme}>
            <ListItem button onClick={() => {
                if (isOpenChapter.chapterId === chapter.chapter._id) {
                    setContentDetailsHelper({ isOpen: false, contentId: undefined });
                    setIsOpenChapter(p => ({ ...p, isOpen: !p.isOpen }));
                } else {
                    setContentDetailsHelper({ isOpen: false, contentId: undefined });
                    setIsOpenChapter({ isOpen: true, chapterId: chapter.chapter._id });
                }
            }}
                className={!(isOpenChapter.isOpen && isOpenChapter.chapterId === chapter.chapter._id) && "mb-3"}
                style={{
                    backgroundColor: new_theme.palette.primary.PWhite,
                    borderRadius: '8px',
                    border: `1px solid ${new_theme.palette.primary.PBorderColor}`
                }}>
                {/* <ListItemIcon >
                    {(isOpenChapter.isOpen) ? (
                        <Avatar className="ml-1" style={{ width: "25px", height: "25px", }}>
                            <Typography variant="body2" component="span" className="text-left" >
                                <small>{index + 1}</small>
                            </Typography>
                        </Avatar>
                    ) : (
                        <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} />
                    )}
                </ListItemIcon> */}
                <ListItemText className="drag_parent" primary={<Typography variant="body2" component="span" sx={{fontWeight: '700'}}>{chapter?.chapter.name}</Typography> || "-"} />
                {/* <ListItemText className='text-right pr-5' primary={<small>{`contents: ${chapter?.chosenContents?.length || 0}`}</small>} /> */}
                <StyledEIconButton color="primary" size="medium">{(isOpenChapter.isOpen && isOpenChapter.chapterId === chapter.chapter._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}</StyledEIconButton>
            </ListItem>
            <Collapse in={isOpenChapter.isOpen && isOpenChapter.chapterId === chapter.chapter._id} timeout="auto" unmountOnExit style={{padding: '0 12px'}}>
                <List component="div" disablePadding>
                    <ContentItem chapter={chapter} index={index} setEventHelper={setEventHelper}
                        setCurrentCourseObject={setCurrentCourseObject}
                        setContentDetailsHelper={setContentDetailsHelper}
                        contentDetailsHelpe={contentDetailsHelper}
                        groupId={groupId}
                        manageContentHelper={manageContentHelper}
                        setManageContentHelper={setManageContentHelper}
                    />
                </List>
            </Collapse>
        </ThemeProvider>
    )
}