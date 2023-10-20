// Explore view - final view for exploring exising contents and courses on the platform
// It will be fist only used for `contents` in School Centers
// but all the elements are compatible for `courses` in  Training Centers


import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import ContentService from "services/content.service";


// Styled components
import { EChip } from "styled_components";
import SvgIcon from "@mui/material/SvgIcon";
import ESvgIcon from "styled_components/SvgIcon";
import EIconButton from "styled_components/EIconButton";
import EMenuWithFilters from 'styled_components/MenuWithFilters';
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';
import BrainCoreLabel from "styled_components/BrainCoreLabel";
// Icons
import { ReactComponent as FiltersIcon } from 'icons/icons_32/Filters_32.svg';

// Other components
import ImageList from 'components/Item/ImageList';


// Other
import qs from 'qs';


// MUIv5
import { styled } from '@mui/material/styles';
import { Grid, Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';

// MUI v4
import { theme } from "MuiTheme";
import StudentForm from "components/TrainingModule/Sessions/NSession/Certificate/Students/StudentForm";


//Redux
import {useDispatch, useSelector} from "react-redux";
import { setList, editElement, deleteElement, setSearchQuery } from "app/features/Explore/data";
import Autocomplete from 'styled_components/Autocomplete'
import CertificationSessionService from 'services/certification_session.service'


// Styled elements
const Container = styled(Box)(() => {
    return {
        paddingTop: '24px',
        paddingBottom: '24px',
        background: theme.palette.glass.medium,
        borderRadius: '16px'
    }

})

const Header = styled(Typography)(() => {
    return {
        ...theme.typography.h,
        color: theme.palette.primary.darkViolet,
        fontSize: "18px",
        fontWeight: "400",
        paddingTop: '8px',
        paddingBottom: '8px'
    }

})

const StyledDivider = styled(Divider)(() => {
    return {
        background: 'transparent',
        borderColor: theme.palette.neutrals.fadeViolet,
        marginTop: '24px',
        marginBottom: '24px'
    }
})



// Explore view
const Explore = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        F_getHelper
    } = useMainContext();
    const { user } = F_getHelper();

    // Load state from Redux store
    const {searchQuery, contentsTaken, contentsRecommended, contentsOwned,contentsCocreated,contentsByTag,contentsByQuery} = useSelector(s=>s.explore);
    const dispatch = useDispatch();

    // Interests/Tags
    const [recommendedInterests, setRecommendedInterests] = useState(null)
    const [currentTab, setCurrentTab] = useState(0);

    // Contents
    const [contentsByQueryFiltered, setContentsByQueryFiltered] = useState(null)


    // Element for opening searchFilters in search results
    const [searchFiltersElement, setSearchFiltersElement] = useState(null);
    const openSearchFilters = Boolean(searchFiltersElement);
    const [fitersChips, setFitersChips] = useState()

    const initFilters = [
        { key: "DATE", sorter: 1, name: t("Date"), values: [{ key: "NEWEST", name: t("Newest"), selected: 0 }, { key: "OLDEST", name: t("Oldest") }], single: true },
        { key: "OWNERSHIP", values: [{ key: "MY", name: t("My content") }] },
        { key: "TYPE", name: t("Content type"), values: [{ key: "TEST", name: t("Test") }, { key: "PRESENTATION", name: t("Presentation") }] },

    ]
    const [searchFilters, setSearchFilters] = useState(initFilters)


    // Main context
    const { myCurrentRoute, setMyCurrentRoute, F_handleSetShowLoader, F_showToastMessage } = useMainContext();

    // Search query taken from URL parameter - it is set in Navigation component
    let { query } = useParams();

    const { activeIndex, contents } = useSelector(s => s.contentFactory);
    const [searchQueryValue, setSearchQueryValue] = useState('');
    const [searchQueryInputValue, setSearchQueryInputValue] = useState('');
    const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
    
    useEffect(() => {
        setSearchQueryValue(searchQuery)
        search(searchQuery)
    }, [searchQuery]);

    const search = (query) => {
        if (query && query.length > 0) {
            if (isTrainingCenter) {
                navigate(`/explore-courses/${query}`);
            } else {
                navigate(`/explore/${query}`);
            }
        }
        else {
            if (isTrainingCenter) {
                navigate(`/explore-courses/${query}`);
            } else if (myCurrentRoute == "Explore") {
                //navigate(`/explore`);
            }
        }
    }

    // Initial load of the component
    useEffect(() => {
        setMyCurrentRoute("Explore");
        loadContents()
        // loadSessions()

        if (query) dispatch(setSearchQuery(query))
        else dispatch(setSearchQuery(query))

    }, []);

    // Search action
    useEffect(() => {
        if (searchQuery) loadContentsByQuery(searchQuery)
    }, [searchQuery]);





    // ##########################
    // Filters or results changed
    useEffect(() => {
        if (searchFilters && contentsByQuery) {
            let contents = [...contentsByQuery]
            contents = ContentService.applyFilters(contents, user, searchFilters)
            setContentsByQueryFiltered(contents)
        } else setContentsByQueryFiltered([])
    }, [searchFilters, contentsByQuery]);



    // Search contents by query
    const loadContentsByQuery = (query) => {
        F_handleSetShowLoader(true)
        if (!query) setSearchFilters(initFilters)

        ContentService.search(query).then(response => {
            let contents = response.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } })
            contents = contents.filter(c=>c.contentType!="ASSET")// Hide assets
            dispatch(setList({list: 'contentsByQuery',elements: contents}))
            //setSearchedContents(contents)
            setTimeout(() => { F_handleSetShowLoader(false) }, 500)
        }).catch(error => {
            F_handleSetShowLoader(false)
            F_showToastMessage(t("Could not load content"), "error");
        })
    }

    // Search contents by tag
    const loadContentsByTag = (tag) => {
        F_handleSetShowLoader(true)

        ContentService.searchByInterestId(tag._id, tag.name).then(response => {
            let contents = response.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } })
            // Do not show assets
            contents = contents.filter(c=>c.contentType!="ASSET")
            dispatch(setList({list: 'contentsByTag',elements: contents}))
            setTimeout(()=>{F_handleSetShowLoader(false)}, 500)
        }).catch(error => {
            F_handleSetShowLoader(false)
            F_showToastMessage(t("Could not load content"), "error");
        })
    }

    // Load contents recent/recommended/owned/cocreated
    const loadContents = () => {
        F_handleSetShowLoader(true)
        ContentService.getContents(null, 'taken-recent').then(response => {
            let contents = response.data
            dispatch(setList({list: 'contentsTaken',elements: contents}))
        })

        ContentService.searchRecommended().then(response => {
            let contents = response.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } })
            contents = contents.filter(c=>c.contentType!="ASSET")
            dispatch(setList({list: 'contentsRecommended',elements: contents}))
            let interests = response.data.aggregations.interests_ids.buckets.map(bucket => {
                let interestId = bucket.key
                // Find name of the interest by _id
                let interestName = bucket.interests_source.hits.hits[0]._source.tags
                    .find((tag) => { return tag.interest._id === interestId }).interest.name
                return {
                    _id: interestId,
                    name: t(interestName)
                }
            }
            )
            setRecommendedInterests(interests)
        }).catch(error => {
            console.error('searchRecommended', error.message)
            F_showToastMessage(t("Could not load recommended content"), "error");
        })


        ContentService.getContents(null, 'owned-recent').then(response => {
            let contents = response.data
            dispatch(setList({list: 'contentsOwned',elements: contents}))
        })

        ContentService.getContents(null, 'cocreated-recent').then(response => {
            let contents = response.data
            dispatch(setList({list: 'contentsCocreated',elements: contents}))
        })

        setTimeout(()=>{F_handleSetShowLoader(false)}, 2000)
    }

    const getTagsComponent = () => {
        return <Box sx={{mb: '24px'}}>
            <EChip sx={{ mt: '4px', mx: '2px' }} onClick={(e) => { setCurrentTab(0) }} labelcolor={currentTab == 0 ? theme.palette.neutrals.white : undefined} background={currentTab == 0 ? theme.palette.primary.violet : theme.palette.shades.white70} label={t("All")}></EChip>
            {recommendedInterests?.length > 0 && recommendedInterests.map((tag, i) => {
                return <EChip key={i} sx={{ mt: '4px', mx: '2px' }} onClick={(e) => { loadContentsByTag(tag); setCurrentTab(i + 1); }} labelcolor={currentTab == i + 1 ? theme.palette.neutrals.white : undefined} background={currentTab == i + 1 ? theme.palette.primary.violet : theme.palette.shades.white70} label={tag.name}></EChip>
            })}
        </Box>

    }

    // ##### ##### ##### ##### #####
    // SEARCH RESULTS
    // ##### ##### ##### ##### #####
    if (query) return (<Container sx={{ px: { xs: '0px', sm: '18px', lg: '24px' } }}>

        {/* NAVIGATION */}
        <Grid container sx={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <Grid item container sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
                <EIconButton size="large" color="secondary" onClick={() => { dispatch(setSearchQuery('')); navigate('/explore') }}>
                    <SvgIcon viewBox={"15 15 18 18"} component={BackIcon} />
                </EIconButton>
                <Header sx={{ pl: '8px' }}>{t("Search results") + ': "' + searchQuery + '"'}</Header>
            </Grid>
            <Grid item container sx={{ width: '100px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <EIconButton size="large" onClick={(e) => { setSearchFiltersElement(e.currentTarget) }} color="secondary" >
                    <ESvgIcon viewBox="0 0 32 32" component={FiltersIcon} />
                </EIconButton>
            </Grid>
        </Grid>
        <StyledDivider sx={{ mt: '4px', mb: '24px' }} />
        <Grid container sx={{ pb: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ ...theme.typography.p, fontSize: '16px' }}>{t("Total found") + ": " + (contentsByQueryFiltered ? contentsByQueryFiltered?.length : 0)}</Typography>
            <Grid item>{fitersChips}</Grid>
        </Grid>
        {/* LIST */}
        <ImageList 
            elements={contentsByQueryFiltered} 
            editElementCallback={(elementId, field, newValue)=>{
                dispatch(editElement({list: 'contentsByQuery', elementId: elementId, field: field, newValue: newValue}))
            }}
            deleteElementCallback={(elementId)=>{
                dispatch(deleteElement({list: 'contentsByQuery', elementId: elementId}))
                // Remove from all other lists
                dispatch(deleteElement({ list: 'contentsTaken', elementId: elementId }))
                dispatch(deleteElement({ list: 'contentsRecommended', elementId: elementId }))
                dispatch(deleteElement({ list: 'contentsOwned', elementId: elementId }))
                dispatch(deleteElement({ list: 'contentsCocreated', elementId: elementId }))
            }}
            ></ImageList>


        <EMenuWithFilters
            filters={searchFilters} setFilters={setSearchFilters}
            anchorEl={searchFiltersElement}
            open={openSearchFilters}
            onClose={() => { setSearchFiltersElement(null) }}
            setFitersChips={setFitersChips}
        />
    </Container>
    );

    // ##### ##### ##### ##### #####
    // SELECTED CATEGORY
    // ##### ##### ##### ##### #####
    if (currentTab > 0) return (<Container sx={{ px: { xs: '0px', sm: '18px', lg: '24px' } }}>
        {/* TAGS */}
        {getTagsComponent()}
        {/* BY TAG */}
        <Header>{t(recommendedInterests[currentTab - 1].name)}</Header>
        <ImageList 
            elements={contentsByTag} 
            editElementCallback={(elementId, field, newValue)=>{
                dispatch(editElement({list: 'contentsByTag', elementId: elementId, field: field, newValue: newValue}))
            }}
            deleteElementCallback={(elementId)=>{
                dispatch(deleteElement({list: 'contentsByTag', elementId: elementId}))
                // Remove from all other lists
                dispatch(deleteElement({ list: 'contentsTaken', elementId: elementId }))
                dispatch(deleteElement({ list: 'contentsRecommended', elementId: elementId }))
                dispatch(deleteElement({ list: 'contentsOwned', elementId: elementId }))
                dispatch(deleteElement({ list: 'contentsCocreated', elementId: elementId }))
            }}
        ></ImageList>
    </Container>)

    // ##### ##### ##### ##### #####
    // MAIN VIEW
    // ##### ##### ##### ##### #####
    return (


        <Container sx={{ px: { xs: '0px', sm: '18px', lg: '24px' } }}>
            <Grid item xs={12}>
                        {myCurrentRoute == "Explore" && <Autocomplete
                            explore={true}
                            freeSolo
                            //blurOnSelect={true}
                            value={searchQueryValue}
                            inputValue={searchQueryInputValue}
                            onInputChange={(event, value) => {
                                setSearchQueryInputValue(value)
                            }
                            }
                            onChange={(event, value) => {
                                if (value) dispatch(setSearchQuery(value))
                            }}
                            suggestions={[]}
                            getSuggestions={async (query) => {
                                if (isTrainingCenter) {
                                    let res = await CertificationSessionService.getSessionsForExplore(undefined, query)
                                    let data = res?.data?.hits?.hits
                                    if (data) return data.map(a => a._source?.name)
                                    else return []
                                }
                                else {
                                    let res = await ContentService.suggest(query)
                                    let data = res?.data?.hits?.hits
                                    data = data.filter(a => a._source.contentType != "ASSET")//Ignore assets
                                    if (data) return data.map(a => a._source.title)
                                    else return []
                                }
                            }}


                            sx={{ ml: '32px' }}
                            placeholder={`${t("Search")}`}
                            class="search_textbox"
                        >
                        </Autocomplete>}
                    </Grid>

            {/* BRAINCORE CHIP */}
            {<BrainCoreLabel/>}

            {/* TAGS */}
            {getTagsComponent()}

            {/* RECENT */}
            {
                contentsTaken?.length > 0 && <>
                    <Header>{t("Recently taken")}</Header>
                    <ImageList
                        elements={contentsTaken}
                        editElementCallback={(elementId, field, newValue) => {
                            dispatch(editElement({ list: 'contentsTaken', elementId: elementId, field: field, newValue: newValue }))
                        }}
                        deleteElementCallback={(elementId) => {
                            dispatch(deleteElement({ list: 'contentsTaken', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsRecommended', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsOwned', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsCocreated', elementId: elementId }))
                        }}
                    >
                        
                    </ImageList>
                    <StyledDivider />
                </>
            }



            {/* RECOMMENDED */}
            {
                contentsRecommended?.length > 0 && <>
                    <Header>{t("Recommended")}</Header>
                    <ImageList 
                        elements={contentsRecommended} 
                        editElementCallback={(elementId, field, newValue) => {
                            dispatch(editElement({ list: 'contentsRecommended', elementId: elementId, field: field, newValue: newValue }))
                        }}
                        deleteElementCallback={(elementId) => {
                            dispatch(deleteElement({ list: 'contentsTaken', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsRecommended', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsOwned', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsCocreated', elementId: elementId }))
                        }}
                    ></ImageList>
                    <StyledDivider />
                </>
            }

            {/* OWNED */}
            {
                contentsOwned?.length > 0 && <>
                    <Header>{t("Owned")}</Header>
                    <ImageList 
                    elements={contentsOwned} 
                    editElementCallback={(elementId, field, newValue) => {
                        dispatch(editElement({ list: 'contentsOwned', elementId: elementId, field: field, newValue: newValue }))
                    }}
                    deleteElementCallback={(elementId) => {
                        dispatch(deleteElement({ list: 'contentsTaken', elementId: elementId }))
                        dispatch(deleteElement({ list: 'contentsRecommended', elementId: elementId }))
                        dispatch(deleteElement({ list: 'contentsOwned', elementId: elementId }))
                        dispatch(deleteElement({ list: 'contentsCocreated', elementId: elementId }))
                    }}
                    carousel={true}></ImageList>
                    <StyledDivider />
                </>
            }

            {/* COCREATED */}
            {
                contentsCocreated?.length > 0 && <>
                    <Header>{t("Cocreated")}</Header>
                    <ImageList 
                        elements={contentsCocreated} 
                        editElementCallback={(elementId, field, newValue) => {
                            dispatch(editElement({ list: 'contentsCocreated', elementId: elementId, field: field, newValue: newValue }))
                        }}
                        deleteElementCallback={(elementId) => {
                            dispatch(deleteElement({ list: 'contentsTaken', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsRecommended', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsOwned', elementId: elementId }))
                            dispatch(deleteElement({ list: 'contentsCocreated', elementId: elementId }))
                        }}
                        carousel={true}></ImageList>
                    <StyledDivider />
                </>
            }


        </Container>
    )
}

export default Explore;