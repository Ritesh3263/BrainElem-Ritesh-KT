// Single list element with image
// Contents and Courses are supported
// Events are not supported

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import ContentService from 'services/content.service'
import CommonService from 'services/common.service'

// MUI v5
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

//Styled components
import ETooltip from "styled_components/Tooltip";
import ETypeChip from "styled_components/atoms/TypeChip";
import { EChip, ECoursePriceLabel } from "styled_components";

// Other
import ListItem from 'components/Item/ListItem'

// MUIv4
import { theme } from "MuiTheme";

// ########### ########### ########### ###########
// ########### ########### ########### ###########
// Single element on the list with image
// `element` - element to display
// `deleteElementCallback` - function to run after deleting element in the list - can be used to reload list or update the state
// `editElementCallback` - function to run after editing element in the list - can be used to reload list or update the state
// `width` - width of the element by default 375
const ElementImageListItem = ({ element, deleteElementCallback, editElementCallback, width }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { F_formatSeconds } = useMainContext();

    function getElementWidth() {
        let minWidht = 325
        let maxWidht = 445

        if (width<minWidht) return minWidht
        else if (width>maxWidht) return maxWidht
        else return width??minWidht
    }

    function getType() {
        if (element.contentType) return 'content'
        else return 'course'
    }

    // Open on click
    function openItem() {
        if (getType() == 'content') navigate(`/content/display/${element._id}`)
    }

    function getImage() {
        if (element.img) return element.img
        else return ContentService.getImageUrl(element)
    }

    function getTagsComponent() {
        let tagType;

        if (getType() == 'content') tagType = element.contentType
        else if (getType() == "event") tagType = element.type
        else tagType = getType()
        let TypeChip = <ETypeChip sx={{ mr: 1}} type={tagType} long={+true}></ETypeChip>

        //Content
        if (getType() == 'content'){
            // Check if this is an original(source) content which has been approved and duplicated in Library
            let isOld = (element.newerVersion)
            let archiveRequested = element.archiveContentFromLibraryRequested
            let hideFromTrainees = element.hideFromTrainees

            let version = element.version
            return <>
                {TypeChip}
                {CommonService.isDevelopment() && <>
                
                {archiveRequested && <EChip sx={{ mr: '8px' }} size="small" labelcolor={'white'} background={theme.palette.primary.green} label={t("Archiving of the content requested")}></EChip>}
                {isOld &&  <ETooltip style={{display: 'inline-block'}} placement="bottom" title={"Only visible for development. This tag indicates that for this content `newerVersion` property is set"}>
                    <EChip sx={{ mr: '8px' }} size="small" labelcolor={'white'} background={theme.palette.neutrals.almostBlack} label={t("Old")}></EChip>
                </ETooltip>}
                {version && <ETooltip style={{display: 'inline-block'}} placement="bottom" title={t('This is the')+` ${version}'th ` + t('version of the content.')}>
                    <EChip sx={{ mr: '8px' }} size="small" labelcolor={'white'} background={theme.palette.neutrals.darkGrey} label={"v"+version}></EChip>
                </ETooltip>}
                </>}
                {hideFromTrainees && <ETooltip style={{display: 'inline-block'}} placement="bottom" title={t("This content will not be visible to trainees until it is assigned to an exam or homework.")}>
                    <EChip sx={{ mr: '8px' }} size="small" background={theme.palette.primary.creme} label={t("Hidden")}></EChip>
                </ETooltip>
                }
            </>
        }
        
        // Course
        if (getType() == 'course'){
            var msInDay = 24 * 60 * 60 * 1000;
            let now = new Date()
            let created = element.createdAt ? new Date(element.createdAt) : undefined
            let oldInDays = (now.getTime() - created?.getTime())/msInDay

            // Open for enrollments
            let start = element.enrollmentStartDate ? new Date(element.enrollmentStartDate) : undefined
            let end = element.enrollmentEndDate ? new Date(element.enrollmentEndDate) : undefined
            let isOpenForEnrollment = undefined
            if (start && end) isOpenForEnrollment = (now.getTime()>start.getTime() && end.getTime()>now.getTime())

            //Certificate
            let certificate = element.certificate

            return <>
                {oldInDays<7 && <EChip sx={{ mr: '8px' }} size="small" labelcolor={'white'} background={theme.palette.primary.green} label={t("New")}></EChip>}
                {certificate && <EChip sx={{ mr: '8px' }} size="small" background={theme.palette.primary.yellow} label={t("Certification")}></EChip>}
                
                {TypeChip}
                {isOpenForEnrollment && <EChip sx={{ mr: '8px' }} size="small" background={theme.palette.neutrals.fadeViolet} label={t("Open for enrollments    ")}></EChip>}
            </>
        }
    }

    function getTimeComponent() {
        let time = ''
        // Content
        if (element.durationTime) time = element.durationTime
        else if (element.maxTimeToFinish) time =  element.maxTimeToFinish

        // Course
        if (element.startDate && element.endDate){
            let start = (new Date(element.startDate)).getTime()
            let end = (new Date(element.endDate)).getTime()
            time = (end - start)/1000
        }
        
        if (time) time = F_formatSeconds(time) 

        return <Typography sx={{ ...theme.typography.p, color: theme.palette.neutrals.white, fontSize: 12 }}>{time}</Typography>
    }

    function getProgressBarComponent() {
        if (element.progress != undefined) {
            return <Grid container sx={{ position: 'absolute', top: 150 - 8, left: 0, width: '100%' }}>
                <Box sx={{ height: '8px', width: `${element.progress}%`, background: theme.palette.primary.violet }}></Box>
                <Box sx={{ height: '8px', width: `${100 - element.progress}%`, background: theme.palette.neutrals.darkestGrey }}></Box>
            </Grid>
        }
    }

    function getPriceComponent() {
        if (getType() != 'course') return <></>
        return <ECoursePriceLabel
            price={(element.paymentEnabled && element.price) ? element.price.toString() : t("FREE")}
            currency={(element.paymentEnabled && element.price) ? element.currency : ""}
            style={{ top: 99, background: ((element.paymentEnabled && element.price) ? theme.palette.primary.yellow : theme.palette.neutrals.white) }}
        />
    }

    return (
        <ImageListItem sx={{ width: getElementWidth(), cursor: 'pointer' }} onClick={() => { openItem() }}>
            <Box>
                <Box sx={{height: '150px'}}>
                <img  
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.style.display='none'
                    }}
                    style={{ width: getElementWidth(), height: 150, display: "block", borderRadius: '8px 8px 0px 0px' }}
                    src={`${getImage()}`}
                    loading="lazy"
                    alt=""
                />
                </Box>
                {getProgressBarComponent()}
                {getPriceComponent()}
                <Box sx={{ p: "8px", position: 'absolute', top: 0, left: 0 }}>{getTagsComponent()}</Box>
                <Box sx={{ p: "8px", position: 'absolute', top: 0, right: 0 }}>{getTimeComponent()}</Box>
                <ListItem element={element} editElementCallback={editElementCallback} deleteElementCallback={deleteElementCallback}></ListItem>
            </Box>
        </ImageListItem>
    )
}

export default ElementImageListItem;