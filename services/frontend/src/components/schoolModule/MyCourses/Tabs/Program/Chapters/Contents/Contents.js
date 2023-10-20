import React, { lazy,useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { EAccordion } from "styled_components";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import Typography from "@material-ui/core/Typography";
import { theme } from "MuiTheme";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import { FormControlLabel } from "@material-ui/core";
import Switch from "styled_components/Switch";
import ContentChips from "components/Content/Display/ContentChips";
import EChip from "styled_components/atoms/Chip";
import EIconButton from "styled_components/EIconButton";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { myCourseActions } from "app/features/MyCourses/data";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import ContentService from "services/content.service";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider"
import CommonDataService from "services/commonData.service";
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import OptionsButton from "components/common/OptionsButton";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Confirm from "components/common/Hooks/Confirm";
import SubjectSessionService from "services/subject_session.service";


// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Events = lazy(() => import("./Events"));

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}


const StyledCheckCircleIcon = styled(CheckCircleIcon)({
    "& line": {
        stroke: "#15A3A5",
        fill: "#15A3A5"
    },
    "& polyline": {
        stroke: "#15A3A5",
        fill: "#15A3A5"
    },
    "& path": {
        stroke: "#15A3A5",
        fill: "#15A3A5"
    },
    '& circle': {
        stroke: "#15A3A5",
        fill: "#15A3A5"
    },
})


const Contents = (props) => {
    const navigate = useNavigate()
    const { isConfirmed } = Confirm();
    const {
        contents = [],
        isBase = false,
        isDone = false,
        events
    } = props;
    const { dndHelper, formHelper, programHelper, item } = useSelector(s => s.myCourses);
    const _item = item;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { F_showToastMessage } = useMainContext();
    const {
        F_getHelper,
    } = useMainContext();

    const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
    const { user } = F_getHelper();

    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");

    const [group, setGroup] = useState({});

    function handleOnDragEnd(result) {
        if (result.destination !== null) {
            const items = Array.from(contents);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            dispatch(myCourseActions.dndAction({ type: 'DND_C_UP', payload: items }));
        }
    }

    // options Buttons
    const optionsBtn = [

        {
            id: 2, name: t("Edit in content factory"), action: ({ currentItemId }) => {
                let content = contents.find(c => c._id == currentItemId)
                window.open(
                    `/edit-${content.contentType.toLowerCase()}/${currentItemId}`
                    , '_blank');
            },
        },
        {
            id: 3, name: t("Remove"), action: async ({ currentItemId }) => {
                let confirm = await isConfirmed("Are you sure you want to remove this content?");
                if (!confirm) return;
                dispatch(myCourseActions.programAction({ type: 'REMOVE_CONTENT', payload: currentItemId }));
            },
        }
    ]

    useEffect(()=>{

        SubjectSessionService.read(formHelper.itemId).then(res=>{
            setGroup(res.data.group._id)
        })    
    },[]);

    const assignedContents = contents?.length > 0 ? contents.map((item, index) => (
        <Draggable draggableId={item._id} index={index} key={item._id} isDragDisabled={(programHelper.mode !== 'EDIT') || !dndHelper.dndContent.isActiveDnd}>
            {(provided) => (
                <Box
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    sx={{ marginBottom: '40px', px: { xs: 0, md: '20px' } }}
                >
                    <Grid container className='d-flex justify-content-between' style={{ borderRadius: '8px' }}>
                        <Grid item xs={12}>
                            <Grid item xs={12} container >
                                <Grid item xs={12} className="d-flex align-items-center justify-content-start ">
                                    {(programHelper.mode === 'EDIT') && (
                                        <>
                                            {dndHelper.dndContent.isActiveDnd && (
                                                <SettingsEthernetIcon sx={{ transform: "rotate(90deg)", mr: 3 }} style={{ color: `rgba(82, 57, 112, 1)`, backgroundColor: 'rgba(255,255,255,0)' }} />
                                            )}
                                        </>
                                    )}
                                    <Grid item xs={12} className="align-items-center">

                                        {!item.new && (<Tooltip title={user.role === 'Parent' ? "" : t("Mark as done")}>
                                            <div>
                                                <Checkbox
                                                    icon={<RadioButtonUncheckedIcon />}
                                                    checked={!!item?.isDone} size="small" style={{ padding: '1px' }} name="check"
                                                    className="mr-1"
                                                    // color={isDone?'secondary':'primary'}
                                                    checkedIcon={isDone ? <StyledCheckCircleIcon /> : <StyledCheckCircleIcon />}
                                                    disabled={isBase && programHelper.mode !== 'EDIT' || user.role === 'Parent'}
                                                    onClick={(e, v) => {
                                                        CommonDataService.markCompleted('contents', item._id, !item.isDone);
                                                        dispatch(myCourseActions.dndAction({
                                                            type: 'DONE_CONTENT',
                                                            payload: { contentId: item._id, contentIndex: index, value: !item?.isDone }
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </Tooltip>)}
                                        {item.new && <EChip sx={{ mr: 1 }} label={t("New")} size="small" background={theme.palette.semantic.info} labelcolor={'white'} />}

                                        {user.role !== 'Parent' ?
                                            <Typography
                                                onClick={() => {
                                                    if (item.new) return F_showToastMessage(t("Save the changes first"));
                                                    //window.open(`/my-courses/preview/?chIndcInd=${item._id}&test=${99}`, '_blank');
                                                    navigate(
                                                        `/my-courses/preview/?tmId=${_item?._id}&groupId=${_item?.group?._id}&chInd=${dndHelper.dndChapter.chapterIndex}&chId=${dndHelper.dndChapter.chapterId}&cInd=${index}&cId=${item._id}`);
                                                }}
                                                style={{ textDecoration: "underline", fontSize: "18px", color: theme.palette.primary.lightViolet, cursor: "pointer" }}>
                                                {item?.title || '-'}
                                            </Typography>
                                            :
                                            <Typography
                                                variant="body2" component="span" style={{ margin: "auto", fontSize: "18px", color: `rgba(82, 57, 112, 1)` }}>
                                                {item?.title || '-'}
                                            </Typography>
                                        }
                                    </Grid>
                                    {isSmUp && <Grid container item xs={5} style={{ paddingRight: '10px', height: '100%', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'nowrap' }}>
                                        <ContentChips content={item} hidelabels={+true} elements={true}></ContentChips>
                                    </Grid>}
                                    <Grid container item xs={5} justifyContent='flex-end'>

                                        {/* {formHelper.openType === 'EDIT' && programHelper.mode !== 'EDIT' && (
                                            <ESwitchWithTooltip name={isTrainingCenter ? t('Show to trainees') : t("Show to students")} disabled={isBase || item.new} fontSize="16px" checked={item.isShowOthers}
                                                onChange={(e, s) => {
                                                    dispatch(myCourseActions.dndAction({ type: 'SHOW_OTHERS', payload: { contentIndex: index, isChecked: s } }));
                                                    ContentService.changeVisibility(item._id, group, !s).then((res) => {
                                                        F_showToastMessage(t(res.data.message), "success");
                                                    })
                                                }} />
                                        )} */}

                                        {!item.new && programHelper.mode === 'EDIT' &&
                                            <OptionsButton iconButton={true} btns={optionsBtn} eSize="small" currentItemId={item._id} />
                                        }
                                    </Grid>
                                </Grid>

                            </Grid>

                        </Grid>
                        <hr style={{ paddingTop: "0px", marginTop: "0px", backgroundColor: "#fff" }} />
                    </Grid>
                    {!item.new && <Events events={events?.filter((event) => event?.assignedContent?._id == item._id)} contentId={item._id} contentType={item.contentType}></Events>}
                </Box>)}
        </Draggable>
    )) : [];
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={`droppableContents-1`}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {assignedContents}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default Contents;