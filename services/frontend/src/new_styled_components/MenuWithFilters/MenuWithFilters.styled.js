import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// MUIv5
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';

// Icons
import { ReactComponent as CloseIcon } from 'icons/icons_32/Close_32.svg';
import { ReactComponent as LayerIcon } from 'icons/icons_32/Bookmark_32.svg';

// Styled components
import ESvgIcon from 'styled_components/SvgIcon'
import { ECheckbox, EButton, EChip } from "styled_components";

// MUI v4
import { theme } from "MuiTheme";


// Component with filtering menu
// - filters - array of object with a name of a filter and possible values 
//    eg. [{key: "DATE",  name: "Date", values: [{key: "OLD", name: "Old", selected:1}], single: true}]
// - setFilters - function used to save selected filters
// - setFitersChips - optional - used for managing chips/tags based on filters
const MenuWithFilters = ({ filters, setFilters, setFitersChips, ...props }) => {
    const { t } = useTranslation();

    const [internalFilters, setInternalFilters] = useState([])


    useEffect(() => {// Create deep copy of filters
        if (props.open) setInternalFilters(JSON.parse(JSON.stringify(filters)))
    }, [props.open])

    useEffect(() => {// Based on filters create and set Chip/Tags

        if (setFitersChips){

            let chips = []
            filters.forEach((f, filterIndex)=>{
                f.values.forEach((v, valueIndex)=>{
                    if (v.selected) chips.push(<EChip 
                        showlabels={+true}
                        icon={<ESvgIcon viewBox="0 0 32 32" component={LayerIcon}/>} 
                        deleteIcon={<ESvgIcon viewBox="0 0 32 32" component={CloseIcon}/>}
                        sx={{ m: '2px', border: 'none' }} 
                        label={v.name} 
                        onDelete={()=>{unselect(filterIndex, valueIndex)}}></EChip>)
                })
            })
            let Component = <>{chips}</>
            setFitersChips(Component)
        }
    }, [filters])


    // Unselect fiter
    const unselect = (filterIndex, valueIndex) => {
        let updated = [...filters]
        updated[filterIndex].values[valueIndex].selected=0
        setFilters(updated)
    }


    // Checkbox with filter
    // filter - filter which is used 
    // value - value for a filter
    const getCheckbox = (filter, value) => {
        return <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ ...theme.typography.p, fontSize: 14, color: theme.palette.neutrals.darkestGrey }}>{value.name}</Typography>
            <ECheckbox checked={value.selected ? true : false}
                onChange={() => {

                    let copy = internalFilters.slice();
                    var filterIndex = copy.findIndex(f => f.key == filter.key);
                    var valueIndex = copy[filterIndex].values.findIndex(v => v.key == value.key);

                    if (filter.single) {// Deselect previous
                        var selectedValueIndex = copy[filterIndex].values.findIndex(v => v.selected);

                        if (selectedValueIndex > -1) copy[filterIndex].values[selectedValueIndex].selected = false
                        if (valueIndex != selectedValueIndex) copy[filterIndex].values[valueIndex].selected = true
                    } else {
                        copy[filterIndex].values[valueIndex].selected = copy[filterIndex].values[valueIndex].selected ? false : true
                    }

                    setInternalFilters(copy)

                }}
            ></ECheckbox>
        </Grid>
    }


    return (
        <Popover {...props} sx={{ '& .MuiPaper-root': {background: 'transparent !important'} }}>
            <Grid container sx={{ width: '300px', p: '8px', background: theme.palette.glass.opaque, backdropFilter: 'blur(10px)' }}>
                <Grid container sx={{ alignItems: 'flex-start', flexDirection: 'column', flexWrap: 'nowrap', maxHeight: '500px', overflowY: 'auto' }}>

                    {internalFilters.filter(f => f.sorter).length > 0 && <>
                        <Typography sx={{ ...theme.typography.h5, color: theme.palette.primary.darkViolet }}>{t("Sort by")}</Typography>
                        {internalFilters.filter(f => f.sorter).map((filter, index) =>
                            <Box key={index} sx={{ width: '100%' }}>
                                <Typography sx={{ ...theme.typography.p, fontSize: 14, py: '9px', color: theme.palette.primary.darkViolet }}>{filter.name}</Typography>
                                {filter.values.map((value, index) => { return <Box key={index}>{getCheckbox(filter, value)}</Box> })}
                            </Box>
                        )}
                    </>}

                    {internalFilters.filter(f => !f.sorter).length > 0 && <>
                        <Typography sx={{ ...theme.typography.h5, mt: '24px', color: theme.palette.primary.darkViolet }}>{t("Filter")}</Typography>
                        {internalFilters.filter(f => !f.sorter).map((filter, index) =>
                            <Box key={index} sx={{ width: '100%' }}>
                                {filter.name && <Typography sx={{ ...theme.typography.p, fontSize: 14, py: '9px', color: theme.palette.primary.darkViolet }}>{filter.name}</Typography>}
                                {filter.values.map((value, index) => { return <Box key={index}>{getCheckbox(filter, value)}</Box> })}
                            </Box>
                        )}</>}


                </Grid>

                <Grid container sx={{ py: '9px', justifyContent: 'space-between' }}>
                    <EButton eSize="small" eVariant="secondary" onClick={() => {
                        let copy = internalFilters.slice();
                        copy.forEach(f => {
                            f.values.forEach(v => {
                                v.selected = false
                            })
                        })
                        setFilters(copy)
                        props.onClose();

                    }}>
                        {t("Clear")}
                    </EButton>
                    <EButton eSize="small" eVariant="primary" onClick={() => { props.onClose(); setFilters(internalFilters) }}>
                        {t("Apply")}
                    </EButton>
                </Grid>
            </Grid>
        </Popover>
    )
}

export default MenuWithFilters;