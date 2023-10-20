// List of elements with images
// Contents and Courses are supported
// Events are not supported


import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import ContentService from "services/content.service";

// MUI v5
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';

// Styled components
import EIconButton from "styled_components/EIconButton";
import ESvgIcon from "styled_components/SvgIcon";

// Icons
import { ReactComponent as ForwardIcon } from 'icons/icons_48/Arrow small R.svg';
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';

// Other components
import ElementImageListItem from 'components/Item/ImageListItem';


// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const StyledImageList = styled(ImageList)((props) => {
    return {
        justifyItems: 'center',
        scrollBehavior: 'smooth',
        '-ms-overflow-style': 'none',  // Internet Explorer 10
        'scrollbar-width': 'none',  // Firefox
        "&::-webkit-scrollbar": {
            display: 'none'  // Safari and Chrome */
        }
    }
})


const elementMinWidht = 325
const elementsGap = 24


// ########### ########### ########### ###########
// ########### ########### ########### ###########
// List of elements with images
// `elements` - list of elements to display
// `deleteElementCallback` - function to run after deleting element in the list - can be used to reload list or update the state
// `editElementCallback` - function to run after editing element in the list - can be used to reload list or update the state
// `carousel` - is one row carousel/slider
const ElementImageList = ({ elements, deleteElementCallback, editElementCallback, carousel = false }) => {
    const { t } = useTranslation();
    const [columns, setColumns] = useState();
    const [elementWidth, setElementWidth] = useState();

    const isSmUp = useIsWidthUp("sm");

    // Buttons for carousel
    const [showBackArrow, setShowBackArrow] = useState(false);
    const [showForwardArrow, setShowForwardArrow] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);

    const resizeTimeOutId = useRef()
    const containerRef = useRef()
    const listRef = useRef()


    // Get number of columns
    const getCols = () => {
        let width = containerRef?.current?.offsetWidth
        if (!width) return 2
        // calculate how many with minimal width
        let cols = Math.floor((width+elementsGap) /  (elementMinWidht+elementsGap))
        return cols ? cols : 1
    }

    // Get element width
    const getElementWidth = () => {
        let width = containerRef?.current?.offsetWidth
        let cols = getCols()
        let widthTaken = (cols*(elementMinWidht+elementsGap))-elementsGap
        let widthLeft  = width - widthTaken 
        let extendBy = widthLeft/cols
        return elementMinWidht+extendBy
    }
    function updateSize() {
        setColumns(getCols())
        setElementWidth(getElementWidth())

        // For carousel
        if (listRef?.current?.scrollWidth > containerRef?.current?.offsetWidth) setShowForwardArrow(true)
        else {
            setShowForwardArrow(false)
            setShowBackArrow(false)
        }
    }

    useEffect(() => {
        if (listRef?.current && containerRef?.current){
            const observer = new ResizeObserver(function() {

                // RUN ONCE PER 500 ms
                clearTimeout(resizeTimeOutId.current)
                resizeTimeOutId.current = setTimeout(async () => {
                    updateSize()
                }, 500);
            });
            observer.observe(listRef?.current);
            observer.observe(containerRef?.current);
        
            return () =>{
                observer.disconnect()
            }
        }
        

    }, [listRef?.current, containerRef?.current, elements]);


    // useEffect(() => {
    //     console.log('resizeCounter', resizeCounter?.current)
    //     // This timeout will prevent running this code on every resize
    //     const timeOutId = setTimeout(async () => {
    //         updateSize()
    //     }, 800);
    //     return () => clearTimeout(timeOutId);
    // }, [resizeCounter?.current]);


    if (!elements) return <></>
    return (
        <Grid container ref={containerRef} 
            onMouseEnter={()=>setIsMouseOver(true)} 
            onMouseLeave={()=>setIsMouseOver(false)}
            sx={{ position: 'relative', width: '100%', justifyContent: {xs: 'space-around', md: 'space-between'}, flexWrap: 'nowrap', alignItems: 'center' }}>


            {/* ARROW LEFT */}
            {carousel && isMouseOver  && isSmUp && showBackArrow &&
                <EIconButton sx={{ zIndex: 10, mr: { xs: '24px' }, position: 'absolute', left: 30, top: '30%' }} onClick={() => {
                    listRef.current.scrollLeft -= 399
                }} size="xlarge" variant="contained" color="secondary">
                    <ESvgIcon sx={{}} viewBox={"17 17 14 14"} component={BackIcon} />
                </EIconButton>
            }



            {<StyledImageList ref={listRef} cols={carousel ? elements?.length : columns} gap={elementsGap} rowHeight={'auto'}>
                {columns && elementWidth  && elements?.length>0  && elements.map(element =>
                    <ElementImageListItem key={element._id} sx={{ p: '16px' }} width={elementWidth} element={element} editElementCallback={editElementCallback} deleteElementCallback={deleteElementCallback}></ElementImageListItem>
                )}
            </ StyledImageList>}


            {/* ARROW RIGHT */}
            {carousel && isMouseOver && isSmUp && showForwardArrow &&
                <EIconButton sx={{ zIndex: 10, ml: {  xs: '24px' }, position: 'absolute', right: 30, top: '30%' }} onClick={() => {
                    setShowBackArrow(true)
                    listRef.current.scrollLeft += 399
                }} size="xlarge" variant="contained" color="secondary">
                    <ESvgIcon sx={{}} viewBox={"17 17 14 14"} component={ForwardIcon} />
                </EIconButton>
            }
        </Grid>
    )
}

export default ElementImageList;