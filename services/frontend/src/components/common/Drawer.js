// Drawer for selecting the values from the list

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import { Divider, Typography, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Grid, SwipeableDrawer } from "@mui/material";
import { styled } from '@mui/material/styles';




// Common
import Chip from '@mui/material/Chip';
import {ECheckbox, ERadioButton } from "styled_components";
import EVerticalProperty from "styled_components/VerticalProperty";
import ESvgIcon from "styled_components/SvgIcon";
import EMenuWithFilters from 'styled_components/MenuWithFilters';
import EIconButton from "styled_components/EIconButton";
import Autocomplete from 'styled_components/Autocomplete'

// Icons
import { ReactComponent as MoveVerticallyIcon } from 'icons/icons_32/move_vertically.svg';
import { ReactComponent as FiltersIcon } from 'icons/icons_32/Filters_32.svg';
import { ReactComponent as SearchIcon } from "icons/icons_32/Search_32.svg";
import { ReactComponent as CloseIcon } from "icons/icons_32/Close_32.svg";
import { ReactComponent as PreviewIcon } from 'icons/icons_32/Preview_32.svg';
// Mui v4
import { theme } from "../../MuiTheme";

const SwipeableDrawerWithBlur = styled(SwipeableDrawer)({
    "& .MuiBackdrop-root": {
        '--webkit-backdrop-filter': `blur(5px)`,
        background: 'rgba(16, 40, 101, 0.5) !important',
    },

})


const SwipeableDrawerToBeStyled = ({ className, ...props }) => (
    <SwipeableDrawerWithBlur {...props} classes={{ paper: className }} />
);

const StyledSwipeableDrawer = styled(SwipeableDrawerToBeStyled)`
        width: 520px;
        max-width: 80%;
        background: ${theme.palette.neutrals.white};
`

const StyledList = styled(List)`
    height: 100%;
    overflow-y: auto;
    background: ${theme.palette.neutrals.white};
`

const FooterGrid = styled(Grid)`
    background: ${theme.palette.neutrals.white};
    border-top: 1px solid ${theme.palette.neutrals.white};
    box-shadow: 0px -1px 3px ${theme.palette.neutrals.grey};
    z-index: 10;
    bottom: 0;
`
const StyledDivider = styled(Divider)(() => {
    return {
        background: 'transparent',
        borderColor: theme.palette.neutrals.fadeViolet,
        marginTop: '8px',
        marginBottom: '16px'
    }
})

// name - name displayed at the top of the drawer
// show - used to show/hide drawer
// setShow - used to show/hide drawer
// list - list of all available elements
// suggested - optional - elements which should be marked with `Suggested` tag
// selected - list of selected items
// setSelected - function to set selected items
// emptyItemText - optional - Empty item  is usefull when the field is required, but one of the option should allow not to pick any of proposed options eg. "Other", 
// multiple - optional - use for mulit-select
// suggestFunction - optional - custom function for search bar - by default it will not suggest
// searchFunction - optional - custom function for search bar - by default it will filter the current list
// dragFunction - optional - make dragable elements and display icon
// hoverFunction - optional - action to call when one of the elements is hovered
// previewFunction - optional - action to call when clickin preview icon 
// elementForPreview - optional - property to controll preview icon 
// filters - optional - filter to be used in EMenuWithFilters
// setFilters - optional - set filters to be used in EMenuWithFilters
export default function Drawer({ 
        name, show, setShow, list, 
        suggested, selected, setSelected, 
        emptyItemText, multiple, 
        searchFunction, suggestFunction, 
        dragFunction, hoverFunction=()=>{}, previewFunction, elementForPreview,
        filters, setFilters=()=>{},
        ...props
    }) {
    const [initSelected, setInitSelected] = useState(undefined)
    const [filteredData, setFilteredData] = useState([])
    const [searchingText, setSearchingText] = useState('')
    const [searchingTextInputValue, setSearchingTextInputValue] = useState('')
    const [searchingSuggestions, setSearchingSuggestions] = useState([])


    const [listOfItems, setListOfItems] = useState([])
    const { t } = useTranslation(['translation', 'validators']);

    const [showSearchBar, setShowSearchBar] = useState(false)

    // Element for opening filters #######################################
    const [searchFiltersElement, setSearchFiltersElement] = useState(null);
    const openSearchFilters = Boolean(searchFiltersElement);
    const [fitersChips, setFitersChips] = useState()
    //########################################################################


    const hoverRef = useRef()

    useEffect(() => { // Initialy set filtered data to full list of items
        if (list) setFilteredData(list)
    }, [list]);

    useEffect(() => { // Update the view
        setListOfItems(getListOfItems())
    }, [filteredData, selected, suggested, elementForPreview]);

    useEffect(() => { // Init value
        //if (initSelected === undefined) setInitSelected(selected)
        if (!multiple && show) setShow(false)
    }, [selected]);

    // Taken from TableSearch
    function escapeRegExp(value) {return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');}
    // Filter list by query
    const filterList = (query) => {
        const searchRegex = new RegExp(escapeRegExp(query), 'i');
        let filtered = list.filter((item) => {return searchRegex.test(item.name.toString())})
        return filtered
    }
    const close = () => {
        setFilteredData(list);
        setSearchingText('');
        setShow(false);
    }

    const isSelected = (item) => {
        if (selected === undefined) return false;
        if (multiple) {
            return selected.map(i => i?._id).includes(item?._id)
        } else {

            return item?._id === selected?._id;
        }
    }

    const select = (item) => {
        if (multiple) {
            if (!Array.isArray(selected)) setSelected([item])
            else setSelected([...selected, item])
        } else {
            setSelected(item)
        }
    }

    const unselect = (item) => {
        if (multiple) {
            let filtered = selected.filter(selected => selected !== item)
            if (!filtered.length && emptyItemText) setSelected(undefined)
            else setSelected(filtered)
        } else {
            setSelected(null)
        }
    }

    const getEmptyItem = () => {
        // Empty item  is usefull when the field is required, 
        // but one of the option should allow not to pick any of proposed options eg. "Other", 
        // Empty option set `selected` to `empty array` instead of `undefined`
        let Element = multiple ? ECheckbox : ERadioButton 
        return <>
            <ListSubheader disableSticky={true} key={'other'}>{'Other'}</ListSubheader>
            <ListItem key={"empty"}>
                <ListItemIcon>
                    <Element
                        checked={Array.isArray(selected) && !selected.length}
                        onChange={() => {
                            if (Array.isArray(selected) && !selected.length) setSelected(undefined)
                            else setSelected([])
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary={emptyItemText} />
            </ListItem>
        </>
    }
    const getItem = (item) => {// Get list of items
        if (!item.name) return null;
        if (suggested && suggested.length) {
            let suggestedIds = suggested.map(s => s._id)
            var isSuggested = suggestedIds.includes(item._id)
        }

        let Element = multiple ? ECheckbox : ERadioButton 
        return <ListItem key={item._id}
            sx={elementForPreview?._id == item._id ? {'&.MuiListItem-root': {background: theme.palette.neutrals.fadeViolet}} : {}} 
            onMouseEnter={()=>{
                if (hoverRef.current) clearTimeout(hoverRef.current);
                hoverRef.current = setTimeout(()=>{
                    hoverFunction(item) 
                }, 400)
            }}
            onMouseLeave={()=>{ if (hoverRef.current) clearTimeout(hoverRef.current)}}
            {...(dragFunction ? {draggable: true} : {})}
            {...(dragFunction ? {onDragStart: (event)=>{clearTimeout(hoverRef.current); dragFunction(event, item)}} : {})}
        >
            <ListItemIcon sx={{display: 'flex', alignItems: 'center'}}>
                {dragFunction && <ESvgIcon sx={{ cursor: "grab" }}  viewBox="2 2 28 28" component={MoveVerticallyIcon} />}

                <Element
                    checked={isSelected(item)}
                    tabIndex={item._id}
                    onChange={() => {
                        if (isSelected(item)) unselect(item)
                        else select(item)
                    }}
                />
            </ListItemIcon>
            <ListItemText 
                sx={dragFunction?{cursor:'grab'}:{}}
                primary={
                <Grid container>
                    {<Grid sx={{maxWidth: (isSuggested ? 'calc(100% - 150px)' : '100%'), overflow: 'hidden'}}><EVerticalProperty name={item.name} description={item.tooltip} iconbackgroundcolor={theme.palette.primary.creme} ></EVerticalProperty></Grid>}
                    {isSuggested && <Chip sx={{ml: '8px'}} size="small" label={"Suggested"} />}
                </Grid>}
                secondary={item.description ? item.description : ''}
            />
            {previewFunction && 
               <EIconButton onMouseEnter={(e)=>{if (hoverRef.current) clearTimeout(hoverRef.current); e.stopPropagation()}} style={{border: 'none'}} onClick={() => {previewFunction(item)}}  color="secondary">
                 <ESvgIcon viewBox="-4 -4 40 40" component={PreviewIcon} />
                </EIconButton>}
        </ListItem>

    }

    const getListOfItems = () => { // Get list of items
        // If any of the options are suggested

        var groups = filteredData.reduce((groups, item) => {// Group items if they have parent property
            const group = (groups[item.parent] || []);
            group.push(item);
            groups[item.parent] = group;
            return groups;
        }, {});
        var elements = [];

        if (Object.keys(groups).length === 0) {
            elements = filteredData.map(item => getItem(item));
        } else {
            for (const [groupName, items] of Object.entries(groups)) {
                if (groupName && groupName !== 'undefined')
                    elements.push((<ListSubheader disableSticky={true} key={groupName}>{groupName}</ListSubheader>))

                items.forEach(item => {
                    elements.push(getItem(item));
                })
            }
        }
        return elements;
    }



    return (
        <StyledSwipeableDrawer

            anchor="right"
            open={show}
            onOpen={() => { }}
            onClose={close}
        >
            <ListSubheader component="div">
                <Grid sx={{pt: '32px'}}>
                    <Grid container item xs={12} sx={{justifyContent: 'space-between'}}>
                        <Typography sx={{ ...theme.typography.h, fontSize: '28px', color: theme.palette.primary.darkViolet }}>{name}</Typography>
                        <Grid>
                            <EIconButton size="large" onClick={(e) => { setShowSearchBar(!showSearchBar) }} color="secondary">
                                <ESvgIcon viewBox="0 0 32 32" component={showSearchBar ? CloseIcon : SearchIcon} />
                            </EIconButton>
                            {filters && <EIconButton size="large" onClick={(e) => { setSearchFiltersElement(e.currentTarget) }} color="secondary"  sx={{ml:'8px'}}>
                                <ESvgIcon viewBox="0 0 32 32" component={FiltersIcon} />
                            </EIconButton>}

                        </Grid>
                        {filters && <EMenuWithFilters
                            filters={filters} setFilters={setFilters}
                            anchorEl={searchFiltersElement}
                            open={openSearchFilters}
                            onClose={() => { setSearchFiltersElement(null) }}
                            setFitersChips={setFitersChips}
                        />}
                    </Grid>
                    <StyledDivider></StyledDivider>
                    <Grid item>{fitersChips}</Grid>
                    <Grid item xs={12}>
                        {showSearchBar && <Autocomplete
                            sx={{width: '100%', maxWidth: 'unset',}}
                            freeSolo
                            //blurOnSelect={true}
                            value={searchingText}
                            inputValue={searchingTextInputValue}
                            onInputChange={(event,value) => {
                                setSearchingTextInputValue(value)}
                            }
                            onChange={(event,value) => {
                                setSearchingText(value??'')
                                if (searchFunction){// If provided use custom function
                                    searchFunction(value??'', list, setFilteredData)
                                } 
                                else {
                                    let filtered = filterList(value)
                                    setFilteredData(filtered)
                                }
                            }}
                            suggestions={suggestFunction ? [] : searchingSuggestions}
                            getSuggestions={(searchValue)=>{
                                if (suggestFunction) return suggestFunction(searchValue)
                                else{
                                    let suggestions = filterList(searchValue)
                                    suggestions = suggestions.map(s=>{return s.name})
                                    return suggestions
                                }}
                            }
                            placeholder={`${t("Search")}`}
                        >
                        </Autocomplete>
                        }
                    </Grid>
                </Grid>
            </ListSubheader>
            <StyledList subheader={<li />}>
                {listOfItems}
                {emptyItemText && getEmptyItem()}
            </StyledList>

            <FooterGrid container  >
                <Grid container justifyContent="center">
                </Grid>
            </FooterGrid>

        </StyledSwipeableDrawer>

    )
}
