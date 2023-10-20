import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";

import { EChip } from "styled_components";
import ETypeChip from "styled_components/atoms/TypeChip";
import ETooltip from "styled_components/Tooltip";

import ContentService from "services/content.service"

// Icons
// Icons
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as InfoIcon } from 'icons/icons_32/Info_32.svg';
import { ReactComponent as QuizIcon } from 'icons/icons_32/Label_Test.svg';
import { ReactComponent as EditorIcon } from 'icons/icons_32/Label_Editor.svg';
import { ReactComponent as WooclapIcon } from 'icons/icons_32/Label_Wooclap.svg';
import { ReactComponent as FileIcon } from 'icons/icons_32/Label_File.svg';


import { styled } from '@mui/material/styles';

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI v4
import { theme } from "MuiTheme";

const palette = theme.palette

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}


export default function ContentChips({ content, event, ...props}) {
    const { F_getLocalTime } = useMainContext();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");
    
    const hasQuizQuestion = () => {
        var found = false;
        if (!content?.pages?.length) return found
        if (ContentService.isBraincoreTest(content?._id)) return false
        content.pages.forEach(page => {
            if (page.elements) {
                page.elements.forEach(element => {
                    if (!element.subtype && ['boolean','radiogroup','checkbox','text','editor','sortablelist','barrating','nouislider','datepicker'].includes(element.type)) found=true;
                    else if (['dictation', 'blanks'].includes(element.subtype)) found=true
                })
            }
        })
        return found;
    }

    const hasEditor = () => {
        var found = false;
        if (ContentService.isBraincoreTest(content?._id)) return false
        if (!content?.pages?.length) return found
        content?.pages?.forEach(page => {
            if (page.elements) {
                page.elements.forEach(element => {
                    if (element.type == 'expression' && !element.subtype) found=true;
                })
            }
        })
        return found;
    }

    const hasWooclap = () => {
        var found = false;
        if (!content?.pages?.length) return found
        content?.pages?.forEach(page => {
            if (page.elements) {
                page.elements.forEach(element => {
                    if (element.subtype == 'wooclap') found=true;
                })
            }
        })
        return found;
    }

    const hasFile = () => {
        var found = false;
        if (!content?.pages?.length) return found
        content?.pages?.forEach(page => {
            if (page.elements) {
                page.elements.forEach(element => {
                    if (element.subtype == 'file') found=true;
                })
            }
        })
        return found;
    }

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    }

    const getType = () => {
        if (!event?.eventType && content?.contentType) return content.contentType
        else if (event?.eventType) return event?.eventType + " " + (event?.assignedContent ? t("online") : t("in class"))
        else return undefined
    }

    return (
        <>

            
            {getType() && <ETooltip placement="bottom" title={t(capitalize(getType()))}>
                <ETypeChip {...props} sx={{ mr: 1, my: '1px' }} type={getType()} short={+props.hidelabels}></ETypeChip>
            </ETooltip>}
            {event?.date && <EChip {...props} size="small" sx={{ mr: 1, my: '1px' }} label={F_getLocalTime(event?.date, true)}></EChip>}


            {props.elements && <>
                {content?.level && <ETooltip placement="bottom" title={t("Level")+" " + content?.level}>
                    <EChip {...props} size="small" sx={{ mr: 1, my: '1px'}}
                        label={(t("Level")+" " + content?.level)} background={palette.shades.white30} labelcolor={palette.neutrals.darkestGrey}
                        icon={<SvgIcon viewBox="4 4 24 24" component={InfoIcon}></SvgIcon>}>
                    </EChip>
                </ETooltip>}
                
                {hasQuizQuestion() && <ETooltip placement="bottom" title={t("Quiz")}>
                    <EChip {...props} size="small" sx={{ mr: 1, my: '1px', textTransform: 'capitalize'}}
                        label={t("Quiz")} background={palette.shades.white30} labelcolor={palette.neutrals.darkestGrey}
                        icon={<SvgIcon viewBox="0 0 32 32" component={QuizIcon}></SvgIcon>}>
                    </EChip>
                </ETooltip>}

                
                {hasEditor() && <ETooltip placement="bottom" title={t("Editor")}>
                    <EChip {...props} size="small" sx={{ mr: 1, my: '1px'}}
                        label={t('Editor')} background={palette.shades.white30} labelcolor={palette.neutrals.darkestGrey}
                        icon={<SvgIcon viewBox="0 0 32 32" component={EditorIcon}></SvgIcon>}>
                    </EChip>
                </ETooltip>}
                {hasWooclap() && <ETooltip placement="bottom" title={t("Wooclap")}> 
                    <EChip {...props} size="small" sx={{ mr: 1, my: '1px'}}
                        label={t('Wooclap')} background={palette.shades.white30} labelcolor={palette.neutrals.darkestGrey}
                        icon={<SvgIcon viewBox="0 0 32 32" component={WooclapIcon}></SvgIcon>}>
                    </EChip>
                </ETooltip>}

                {hasFile() && <ETooltip placement="bottom" title={t("File")}> 
                    <EChip {...props} size="small" sx={{ mr: 1, my: '1px'}}
                        label={t("File")} background={palette.shades.white30} labelcolor={palette.neutrals.darkestGrey}
                        icon={<SvgIcon viewBox="0 0 32 32" component={FileIcon}></SvgIcon>}>
                    </EChip>
                </ETooltip>}
            </>}
        </>

    )
}