// Component with Toolbox for ContentFactory

import { useState, useEffect, lazy } from "react";
import { useTranslation } from "react-i18next";


// Contexts
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import ContentService from "services/content.service";

// MUI v4
import { theme } from 'MuiTheme'
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

// MUI v5
import { styled } from '@mui/material/styles';
import Divider from "@mui/material/Divider" 
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Drawer from '@mui/material/Drawer';
import SvgIcon from "@mui/material/SvgIcon";
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// Styled components
import ESvgIcon from 'styled_components/SvgIcon'
import EIconButton from 'styled_components/EIconButton'
import CommonDrawer from 'components/common/Drawer';
import EChip from 'styled_components/atoms/Chip'
import ETypeChip from "styled_components/atoms/TypeChip";

// Icons
import { ReactComponent as EditorIcon } from 'icons/content_factory/toolbox/editor.svg';
import { ReactComponent as FileIcon } from 'icons/content_factory/toolbox/file.svg';
import { ReactComponent as TrueFalseIcon } from 'icons/content_factory/toolbox/truefalse.svg';
import { ReactComponent as MultiSelectIcon } from 'icons/content_factory/toolbox/multiselect.svg';
import { ReactComponent as SingleSelectIcon } from 'icons/content_factory/toolbox/singleselect.svg';
import { ReactComponent as SingleLineIcon } from 'icons/content_factory/toolbox/singleline.svg';
import { ReactComponent as MultiLineIcon } from 'icons/content_factory/toolbox/multiline.svg';
import { ReactComponent as DictationIcon } from 'icons/content_factory/toolbox/dictation.svg';
import { ReactComponent as BlanksIcon } from 'icons/content_factory/toolbox/blanks.svg';
import { ReactComponent as SortIcon } from 'icons/content_factory/toolbox/sort.svg';
import { ReactComponent as RatingIcon } from 'icons/content_factory/toolbox/rating.svg';
import { ReactComponent as SliderIcon } from 'icons/content_factory/toolbox/slider.svg';
import { ReactComponent as DateIcon } from 'icons/content_factory/toolbox/date.svg';

import { ReactComponent as LinkIcon } from 'icons/content_factory/toolbox/link.svg';
import { ReactComponent as WooclapIcon } from 'icons/content_factory/toolbox/wooclap.svg';
import { ReactComponent as AssetIcon } from 'icons/content_factory/toolbox/asset.svg';

import { ReactComponent as ArrowDownIcon } from 'icons/icons_48/Arrow small D.svg';
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';

import { ReactComponent as CloseIcon } from "icons/icons_32/Close_32.svg";
import { ReactComponent as LayerIcon } from 'icons/icons_32/Bookmark_32.svg';

// Other components
const Elements = lazy(() => import("components/Content/Elements"));
const ContentSettings = lazy(() => import("components/Content/ContentFactory/SaveContent"));

const StyledContainer = styled(Grid)((props) => {
    return {
        '&.MuiGrid-root': (props.isMobileScreen ? {
            paddingBottom: 0,
            position: 'relative',
            bottom: '12%',
            height: '12%',
        } : {
            height: "calc(100%)",
            position: 'relative',
            alignContent: 'space-between',
            padding: '16px'
        }),
    }
})

const StyledItem = styled(Grid)((props) => {
    return {
        '&.MuiGrid-root': (props.isMobileScreen ? {
            position: 'absolute'
        } : {
            overflowY: 'auto',
            height: "100%"
        }),
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        }
    }
})

const StyledDrawer = styled(Drawer)((props) => {
    return {
        '& .MuiPaper-root': (props.isMobileScreen ? {
            overflow: 'hidden',
            background: theme.palette.neutrals.white,
            width: '90%',
            padding: '10px'

        } : {
            overflow: 'hidden',
            position: 'unset',
            background: 'transparent',
            border: 'unset'
        })
    }
})


const StyledListItem = styled(Grid)((props) => {
    return {
        padding: '12px',
        alignItems: 'center',
        height: "48px",
        marginTop: '8px',
        marginBottom: '8px',
        background: theme.palette.shades.white70,
        borderRadius: '8px',
        cursor: 'pointer',
        flexWrap: "nowrap",
        "&:hover": {
            background: theme.palette.secondary.violetSelect
        }
    }
})


const StyledSvgIcon = styled(SvgIcon)({
    fill: `transparent !important`,
    "&line": { fill: `transparent !important` },
    "& line": { fill: `transparent !important` },
    // "& path": {fill: `transparent !important`},
    marginRight: '16px'
})

const StyledAddIcon = styled(EIconButton)({
    height: '64px !important',
    width: '64px !important',
    position: 'fixed',
    bottom: '15%',
    right: '5%',
    zIndex: 100

})

const StyledDivider = styled(Divider)(() => {
    return {
        marginBottom: '8px',
        background: theme.palette.neutrals.white,
        borderColor: theme.palette.neutrals.fadeViolet,
    }
})


// Component with Toolbox for CF
//  isMobileScreen - is mobile screen
//  addNewElement - function to add new element from toolbox
//  getNavigation - load component with navigation
//  importAsset - function to load assets
export default function Toolbox({ isMobileScreen, addNewElement, getNavigation, importAsset }) {
    const { t, i18n } = useTranslation();
    const {
        F_handleSetShowLoader,
        F_showToastMessage,
        F_getHelper
    } = useMainContext();
    const { user } = F_getHelper();

    // Contol opening for mobile
    const [open, setOpen] = useState(false);

    // Toolbox accordions 
    const [fileExpanded, setFileExpanded] = useState(true);
    const [toolsExpanded, setToolsExpanded] = useState(true);
    const [questionsExpanded, setQuestionsExpanded] = useState(false);
    const [assetsExpanded, setAssetsExpanded] = useState(false);


    // Drawer with assets ##########################################
    const [openAssetsDrawer, setOpenAssetsDrawer] = useState(false);
    const [assetForPreview, setAssetForPreview] = useState(false);
    const [showSettingsInPreview, setShowSettingsInPreview] = useState(false);
    const [assets,setAssets] = useState();
    const [assetsFiltered, setAssetsFiltered] = useState();
    const [selectedAssets, setSelectedAssets] = useState();
    const initFilters = [
        { key: "DATE", sorter: 1, name: t("Date"), values: [{ key: "NEWEST", name: t("Newest"), selected: 0 }, { key: "OLDEST", name: t("Oldest") }], single: true },
        { key: "OWNERSHIP", values: [{ key: "MY", name: t("My content") }] }
    ]
    const [assetsFilters, setAssetsFilters] = useState(initFilters)


    // Load asset fro preview
    const loadAssetsForPreview = async (assetId, showSettings=false) => {
        setShowSettingsInPreview(showSettings)

        if (assetId == assetForPreview?._id) return
        F_handleSetShowLoader(true)
        // Prepare new elements from asset
        let response = await ContentService.getContent(assetId)
        let asset = response.data
        setAssetForPreview(asset)
        F_handleSetShowLoader(false)
    }

    // Suggest assets names
    const suggestAssets = async (query) => {
        let res = await ContentService.suggest(query, 'ASSET')
        let data = res?.data?.hits?.hits
        if (data) return data.map(a => a._source.title)
        else return []
    }

    // Search for assets
    const searchAssets = async (query) => {
        try {
            let response = await ContentService.searchByType(query, "ASSET")
            let foundAssets = response.data.hits.hits.map(hit => { 
                let assetForDrawer = { 
                    '_id': hit._id,
                    name: hit._source.title,
                    ...hit._source
                }
                if (hit._source?.trainingModule?.name){
                    assetForDrawer.description = <>{hit._source.trainingModule.name + " > " + hit._source.chapter.name}<ETypeChip sx={{ ml: '8px' }} type={"ASSET"} short={0}></ETypeChip></>
                }
                return assetForDrawer
            })
            setAssets(foundAssets)

        }catch (error) {
            console.error('searchAssets', error.message)
            F_showToastMessage(t("Could not load assets"), "error");
        }
    }


    
    // When closing frawer clear selected/filters/search and close preview
    useEffect(() => {
        if (!openAssetsDrawer){// When closing
            setAssetForPreview(false)
            if (selectedAssets){
                let assetsIds = selectedAssets.map(a=>a._id)
                for (let id of assetsIds) importAsset(id)
            }

            setSelectedAssets([])
            searchAssets('')// Load initial list of assets
            setAssetsFilters(initFilters)
        }
    }, [openAssetsDrawer]);
    
    // ##########################
    // Filters or results changed
    useEffect(() => {
        if (assetsFilters && assets) {
            let before = [...assets]
            let filtered = ContentService.applyFilters(before, user, assetsFilters)
            setAssetsFiltered(filtered)
        } else setAssetsFiltered([])
    }, [assetsFilters, assets]);

    // Get tools
    const getTools = () => {
        let tools = [
            { name: t('WYSIWYG Editor'), surveyJsType: 'expression', icon: EditorIcon },
            { name: t("Attach the help materials"), surveyJsType: 'file', icon: FileIcon },
            { name: t("Link"), disabled: 1, surveyJsType: 'file', icon: LinkIcon },
            { name: t("Wooclap"), disabled: 1, surveyJsType: 'file', icon: WooclapIcon },
        ]

        return tools;
    }

    // Get question tools
    const getQuestionTools = () => {
        let qusetionTools = [
            { name: t('Select True/False'), surveyJsType: 'boolean', icon: TrueFalseIcon },
            { name: t('Select single answer'), surveyJsType: 'radiogroup', icon: SingleSelectIcon },
            { name: t('Select multiple answers'), surveyJsType: 'checkbox', icon: MultiSelectIcon },

            { name: t('Single line answer'), surveyJsType: 'text', icon: SingleLineIcon },
            { name: t('Open answer'), surveyJsType: 'editor', icon: MultiLineIcon },
            { name: t('Dictation'), surveyJsType: 'dictation', icon: DictationIcon },
            { name: t('Blanks'), surveyJsType: 'blanks', icon: BlanksIcon },
            { name: t('Sort answers'), surveyJsType: 'sortablelist', icon: SortIcon },
            { name: t('Rating'), surveyJsType: 'barrating', icon: RatingIcon },
            { name: t('Slider'), surveyJsType: 'nouislider', icon: SliderIcon },
            { name: t('Date picker'), surveyJsType: 'datepicker', icon: DateIcon },

            { name: t('Answer with a file'), surveyJsType: 'attachment', icon: FileIcon },

        ]

        return qusetionTools;

    }

    // Get tools
    const getAssets = () => {
        let tools = [
            { name: t('Add Asset'), surveyJsType: '', icon: AssetIcon, disabled: 0, onClick: ()=>{
                setOpenAssetsDrawer(true)
            }},
            { name: t("Create & add Asset "), onClick: ()=>{
                //navigate(/create-asset?redirect=)
            }, disabled: 1, surveyJsType: '', icon: AssetIcon },
        ]

        return tools;
    }


    function ToolboxAccordion({ title, elements, ...props }) {

        return <Accordion {...props} sx={{
            '&.MuiPaper-root': {
                background: 'transparent',
                boxShadow: 'none',
                margin: 0,
                marginBottom: '16px',
                "&::before": {
                    background: 'transparent'
                }
            },
            '& .MuiAccordionSummary-root': {
                minHeight: 'unset !important',
                paddingRight: '0px',
                paddingLeft: '8px',
            },
            '& .MuiAccordionSummary-content': {
                margin: '0 !important',
                minHeight: 'unset'
            },

            '& .MuiAccordionDetails-root': {
                paddingRight: '0px',
                paddingLeft: '0px',
                paddingTop: '8px',
                paddingBottom: '8px',
            }

        }}>
            <AccordionSummary
                sx={{ borderBottom: `${theme.palette.neutrals.fadeViolet} 1px solid` }}
                expandIcon={<ESvgIcon viewBox={"12 12 24 24"} component={ArrowDownIcon} />}
            >
                <Typography sx={{ ...theme.typography.h, fontSize: '18px', fontWeight: '400' }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {elements && <>
                    {elements.map((tool, index) => (
                        <StyledListItem
                            container
                            key={index}
                            onClick={() => { 
                                if (tool.disabled) return; 
                                else if (tool.onClick) tool.onClick()
                                else {addNewElement(tool.surveyJsType); setOpen(false)} }}
                            draggable
                            onDragStart={(ev) => ev.dataTransfer.setData("surveyJsType", tool.surveyJsType)}
                            sx={tool.disabled ? { color: new_theme.palette.newSupplementary.NSupText, background: new_theme.palette.newSecondary.NSIconBorder, "&:hover": { background: new_theme.palette.newSecondary.NSIconBorder } } : {}}>

                            <StyledSvgIcon viewBox="0 0 48 48" component={tool.icon} />
                            <Typography sx={{ ...theme.typography.h, fontSize: 18, fontWeight: 400, color: theme.palette.neutrals.almostBlack, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</Typography>

                        </StyledListItem>
                    ))}
                </>}
                {props.children}
            </AccordionDetails>
        </Accordion>



    }

    return (
        <ThemeProvider theme={new_theme}>
            <StyledContainer container isMobileScreen={isMobileScreen}>
                <StyledItem item xs={12}>
                    <StyledDrawer
                        isMobileScreen={isMobileScreen}
                        anchor='right'

                        open={!isMobileScreen || open}
                        variant={isMobileScreen ? "temporary" : "permanent"}
                        onClose={() => setOpen(false)}
                    >

                        {!isMobileScreen && <ToolboxAccordion title={t("File")} expanded={fileExpanded} onChange={()=>setFileExpanded(!fileExpanded)}>
                            {getNavigation()}
                        </ToolboxAccordion>}

                        <ToolboxAccordion title={t("Tools")} expanded={toolsExpanded} onChange={()=>setToolsExpanded(!toolsExpanded)} elements={getTools()}></ToolboxAccordion>
                        <ToolboxAccordion title={t("Questions")} expanded={questionsExpanded} onChange={()=>setQuestionsExpanded(!questionsExpanded)} elements={getQuestionTools()}>

                        </ToolboxAccordion>
                        <ToolboxAccordion title={t("Assets")} expanded={assetsExpanded} onChange={()=>setAssetsExpanded(!assetsExpanded)} elements={getAssets()}></ToolboxAccordion>






                    </StyledDrawer>
                </StyledItem>
                {isMobileScreen &&
                    <StyledAddIcon
                        onClick={() => setOpen(true)}
                        variant="contained" color="primary">
                        <ESvgIcon color="white" viewBox="8 8 16 16" component={AddIcon} />
                    </StyledAddIcon>
                }
            {openAssetsDrawer && <CommonDrawer name={t("Assets")}
                    filters={assetsFilters} setFilters={setAssetsFilters} 
                    dragFunction={(event, asset)=>{
                        setSelectedAssets([])
                        // Set assetId in the drag event
                        event.dataTransfer.setData("assetId", asset._id); 
                        setTimeout(()=>{// When draging asset close the right-tabs
                            if (isMobileScreen) setOpen(false)
                            setOpenAssetsDrawer(false)
                        },10)
                    }}
                    //hoverFunction={(element)=>{if (!isMobileScreen) loadAssetsForPreview(element._id);}}
                    elementForPreview ={assetForPreview}
                    previewFunction={(element)=>{loadAssetsForPreview(element._id, true)}} 
                    suggestFunction={suggestAssets} 
                    searchFunction={searchAssets} 
                    show={openAssetsDrawer} setShow={setOpenAssetsDrawer} 
                    list={assetsFiltered} setSelected={setSelectedAssets} selected={selectedAssets} multiple={true} 
            />}

            
                {assetForPreview && 
                <Grid container sx={{ position: 'fixed', p: {xs: '0px', sm: '24px'}, top: 0, left: 0, zIndex: 1201, width: (isMobileScreen ? '100%' : 'calc(100% - 520px)'), height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid container sx={{ maxHeight: '100%', maxWidth: '1024px', overflow: 'auto', py: '24px', px: {xs: '0px', sm: '24px'}, borderRadius: '8px', background: theme.palette.glass.opaque, backdropFilter: 'blur(10px)' }} onClose={() => { setAssetForPreview(null) }}>
                        {/* HEADER */}
                        <Grid item xs={12} sx={{pb: '24px'}}>
                            <Grid container item xs={12} sx={{ justifyContent: 'space-between' }}>
                                <Typography sx={{ ...theme.typography.h, fontSize: '28px', color: theme.palette.neutrals.almostBlack }}>{t("Asset preview")}</Typography>
                                <EIconButton size="large" onClick={(e) => { setAssetForPreview(null) }} color="secondary">
                                    <ESvgIcon viewBox="0 0 32 32" component={CloseIcon} />
                                </EIconButton>
                            </Grid>
                            {!showSettingsInPreview && <Typography sx={{ ...theme.typography.h, pt: '8px', fontSize: '18px', fontWeight: 400, color: theme.palette.neutrals.almostBlack }}>{assetForPreview.title}</Typography>}
                        </Grid>

                        {/* SETTINGS */}
                        {showSettingsInPreview && <Grid item xs={12} xl={6}>
                            <ContentSettings contentJSON={assetForPreview} isPreview={true} setContentJSON={() => { }} singleColumn={true} getNavigation={() => { }} setShow={() => { }} show={true} sx={{'&.MuiCard-root': {background: 'transparent', boxShadow: 'none'}}}/>
                        </Grid>}

                        {/* ELEMENTS PREVIEW */}
                        <Grid item xs={12} xl={showSettingsInPreview ? 6 : 12}>
                            <Elements content={assetForPreview} singlePage={true} readOnly={true} showCorrectAnswer={true} showSettings={true} showPointsForCorrectAnswer={true} sx={{ borderRadius: '8px 8px 0px 0px' }}></Elements>
                            <Grid sx={{ px: '16px', 'py': '8px', background: theme.palette.neutrals.white, borderRadius: '0px 0px 8px 8px' }}>
                                <StyledDivider></StyledDivider>
                                {assetForPreview.trainingModule && <EChip
                                    showlabels={+true}
                                    icon={<ESvgIcon viewBox="0 0 32 32" component={LayerIcon} />}
                                    sx={{ m: '2px', border: 'none' }}
                                    label={assetForPreview.trainingModule.name}>
                                </EChip>}
                                {assetForPreview.chapter && <EChip
                                    showlabels={+true}
                                    icon={<ESvgIcon viewBox="0 0 32 32" component={LayerIcon} />}
                                    sx={{ m: '2px', border: 'none' }}
                                    label={assetForPreview.chapter.name}>
                                </EChip>}
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>}
            </StyledContainer>
        </ThemeProvider>
    );
};
