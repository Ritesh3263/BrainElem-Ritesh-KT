import React from "react";
import StyledButton from "./Button";
import PropTypes from "prop-types";
import CircularProgress from '@mui/material/CircularProgress';
import StyledTabBar from "./TabBar";
import StyledTab from "./Tab";
import {ESwipeableDrawerDef} from "./SwipeableDrawer/ESwipeableDrawerDef";
import StyledChip from "./atoms/Chip";
import UserRoleChipStyled from "./atoms/UserRoleChip";
import StyledHorizontalProperty from "./HorizontalProperty";
import StyledCoursePriceLabel from "./atoms/CoursePriceLabel";
import StyledDataGrid from "./DataGrid";
import NewStyledDataGrid from "./NewDataGrid";
import StyledDataGrid2 from "./DataGrid2";
import StyledAccordion from "./Accordion";
import StyledEIconButton from "./EIconButton";
import StyledCard from "./Card";
import StyledCardWithImage from "./CardWithImage";
import StyledSelect from "./Select";
import StyledTextField from "./TextField";
import StyledCheckbox from "./Checkbox";
import StyledRadioButton from "./RadioButton";


import StyledTakeCourseButton from "./TakeCourseButton";
import StyledTextWithLabel from "./TextWithLabel";

import NewStyledTab from "../new_styled_components/Tab"
import NewStyledTabBar from "../new_styled_components/TabBar"

/**--------------------------------------------------------------------**/
export const EButton=(props)=>{
return(
    <StyledButton {...props}>
        <>
        {props.children}
            {props?.isLoading && (
                <CircularProgress
                    className='ml-2'
                    size={20}
                    sx={{color: `${props.eVariant === 'secondary' ? 'rgba(197, 125, 222, 1)' : 'rgba(253, 253, 253, 1)'}`}}
                />
            )}
        </>
    </StyledButton>)
};

EButton.propTypes = {
    eVariant: PropTypes.oneOf(['primary', 'secondary']),
    eSize: PropTypes.oneOf(['xsmall', 'small','medium','large','xlarge']),
    isLoading: PropTypes.bool,
};


/**--------------------------------------------------------------------**/

export const ETakeCourseButton=(props)=>{
return(
    <StyledTakeCourseButton {...props}> </StyledTakeCourseButton>)
};
    
ETakeCourseButton.propTypes = {
    // Course
    course: PropTypes.object.isRequired,
    // Function to take a course
    takeCourse: PropTypes.func.isRequired,
    // If user is logged in
    isLoggedIn: PropTypes.bool.isRequired
};
    
/**--------------------------------------------------------------------**/
export const ETabBar=(props)=> {
    return(
        <StyledTabBar {...props}
                      textColor='primary'
                      variant='fullWidth'
        >
            {props.children}
        </StyledTabBar>
    )
};

export const NewETabBar=(props)=> {
    return(
        <NewStyledTabBar {...props}
                      textColor='primary'
                      variant='fullWidth'
        >
            {props.children}
        </NewStyledTabBar>
    )
};

ETabBar.propTypes = {
    //eVariant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    eSize: PropTypes.oneOf(['xsmall', 'small','medium','large','xlarge']),
};

NewETabBar.propTypes = {
    //eVariant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    eSize: PropTypes.oneOf(['xsmall', 'small','medium','large','xlarge']),
};

/**--------------------------------------------------------------------**/

export const ETab=(props)=> {
    return(
        <StyledTab {...props}>
            {props.children}
        </StyledTab>
    )
};

export const NewETab=(props)=> {
    return(
        <NewStyledTab {...props}>
            {props.children}
        </NewStyledTab>
    )
};

ETab.propTypes = {
    //eVariant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    eSize: PropTypes.oneOf(['xsmall', 'small','medium','large','xlarge']),
    isUppercase: PropTypes.bool,
};

NewETab.propTypes = {
    //eVariant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    eSize: PropTypes.oneOf(['xsmall', 'small','medium','large','xlarge']),
    isUppercase: PropTypes.bool,
};

/**--------------------------------------------------------------------**/

export const ESwipeableDrawer=(props)=> {
    return(
        <ESwipeableDrawerDef {...props}>
            {props.children}
        </ESwipeableDrawerDef>
    )
};


ESwipeableDrawer.propTypes = {
    /** Enter header name here. ex .:
     header = {t ("Header name")} */
    header: PropTypes.string.isRequired,
    /** Pass swipeableDrawerHelper, require isOpen. ex.:
     * const [swipeableDrawerHelper,setSwipeableDrawerHelper] = useState({isOpen: false});*/
    swipeableDrawerHelper: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
    }).isRequired,
    /** Pass setSwipeableDrawerHelper, require to setState. ex.:
     * const [swipeableDrawerHelper,setSwipeableDrawerHelper] = useState({isOpen: false});*/
    setSwipeableDrawerHelper: PropTypes.func.isRequired,
    /** Pass original data arr []*/
    originalData: PropTypes.array.isRequired,
    /** Pass filteredData setState function ex.: {in code}*/
    setFilteredData: PropTypes.func.isRequired,
};

/**--------------------------------------------------------------------**/

export const ECard=(props)=>{
    return(
        <StyledCard {...props}>
            {props.children}
        </StyledCard>
    )
};

/**--------------------------------------------------------------------**/

export const ECardWithImage=(props)=>{
    return(
        <StyledCardWithImage {...props}>
            {props.children}
        </StyledCardWithImage>
    )
};

ECardWithImage.propTypes = {
    imageUrl: PropTypes.string.isRequired, // URL of the image
    imageHeight: PropTypes.number, // Height of the image
    imageWidth: PropTypes.number, // Width of the image
};

/**--------------------------------------------------------------------**/

export const EChip=(props)=>{
    return(
        <StyledChip  {...props}>
            {props.children}
        </StyledChip >
    )
};

EChip.propTypes = {
    label: PropTypes.string.isRequired,
    labelcolor: PropTypes.string,
    bordercolor: PropTypes.string,
    background: PropTypes.string
};


/**--------------------------------------------------------------------**/

export const EUserRoleChip=(props)=>{
    return(
        <UserRoleChipStyled {...props}>
            {props.children}
        </UserRoleChipStyled>
    )
};

EUserRoleChip.propTypes = {
    label: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
};


/**--------------------------------------------------------------------**/

export const ECoursePriceLabel=(props)=>{
    return(
        <StyledCoursePriceLabel {...props}>
            {`${props.price} ${props.currency}`}
        </StyledCoursePriceLabel>
    )
};

ECoursePriceLabel.propTypes = {
    price: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
};

/**--------------------------------------------------------------------**/

export const EHorizontalProperty=(props)=>{
    return(
        <StyledHorizontalProperty {...props}></StyledHorizontalProperty>
    )
};

EHorizontalProperty.propTypes = {
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    property: PropTypes.string,
    value: PropTypes.string.isRequired
};

/**--------------------------------------------------------------------**/

export const ETextField=(props)=>{
    return(
        <StyledTextField  {...props}></StyledTextField >
    )
};

/**--------------------------------------------------------------------**/

export const ESelect=(props)=>{
    return(
        <StyledSelect  {...props}>{props.children}</StyledSelect >
    )
};

ESelect.propTypes = {
    type: PropTypes.oneOf(['normal', 'round']),
};



/**--------------------------------------------------------------------**/
/** How to use! : ==> {@link https://gitlab.elia.academy/root/elia/-/issues/448}*/
export const EDataGrid=(props)=><StyledDataGrid {...props}/>;
export const NewEDataGrid=(props)=><NewStyledDataGrid {...props}/>;
EDataGrid.propTypes = {
    /** Pass column data arr []*/
    columns: PropTypes.array.isRequired,
    /** Pass local component data arr [], this array has variable length depending on searches*/
    rows: PropTypes.array.isRequired,
    /** Pass setState for rows arr [], has build based on filtered data*/
    setRows: PropTypes.func.isRequired,
    /** Pass main data arr [], is an array of all external data*/
    originalData: PropTypes.array.isRequired,
    /** Optional, default = true*/
    isVisibleToolbar: PropTypes.bool,
    /** Optional, default = false*/
    hideFooterPagination: PropTypes.bool,
    /** Optional ['compact','standard','comfortable'], default = 'standard'*/
    density: PropTypes.oneOf(['compact','standard','comfortable']),
    /** Optional, default = 10, have to match one of value rowsPerPageOptions*/
    defaultRowsPerPage: PropTypes.number,
    /** Optional, default = [5, 10, 15, 25]*/
    rowsPerPageOptions: PropTypes.shape({number: PropTypes.number}),
    /** Rows margin, default= 5, */
    rowsMargin: PropTypes.number,
};
// v2
export const EDataGrid2=(props)=><StyledDataGrid2 {...props}/>;

EDataGrid.propTypes = {
    /** Pass column data arr []*/
    columns: PropTypes.array.isRequired,
    /** Pass local component data arr [], this array has variable length depending on searches*/
    rows: PropTypes.array.isRequired,
    /** Pass setState for rows arr [], has build based on filtered data*/
    setRows: PropTypes.func.isRequired,
    /** Pass main data arr [], is an array of all external data*/
    originalData: PropTypes.array.isRequired,
    /** Optional, default = true*/
    isVisibleToolbar: PropTypes.bool,
    /** Optional, default = false*/
    hideFooterPagination: PropTypes.bool,
    /** Optional ['compact','standard','comfortable'], default = 'standard'*/
    density: PropTypes.oneOf(['compact','standard','comfortable']),
    /** Optional, default = 10, have to match one of value rowsPerPageOptions*/
    defaultRowsPerPage: PropTypes.number,
    /** Optional, default = [5, 10, 15, 25]*/
    rowsPerPageOptions: PropTypes.shape({number: PropTypes.number}),
    /** Rows margin, default= 5, */
    rowsMargin: PropTypes.number,
};

/**--------------------------------------------------------------------**/
/** EAccordion styled component by CharlieSz
 * Props: headerName, disabled, defaultExpanded
 * AccordionDetails: send as child-component*/
export const EAccordion=(props)=><StyledAccordion {...props}/>

EAccordion.propTypes ={
    /** When is empty, divider visible */
    headerName: PropTypes.string,
    /** Disabled */
    disabled: PropTypes.bool,
    /** isVisible header background */
    headerBackground: PropTypes.bool,
    /** DefaultExpanded */
    defaultExpanded: PropTypes.bool,
    /** Variant: 'h2,h5,body1,body2, default: h5 {from typography} */
    typoVariant: PropTypes.string,
}

/**--------------------------------------------------------------------**/

export const EIconButton=(props)=><StyledEIconButton {...props}/>

/**--------------------------------------------------------------------**/

export const ECheckbox=(props)=><StyledCheckbox {...props}/>

/**--------------------------------------------------------------------**/

export const ERadioButton=(props)=><StyledRadioButton {...props}/>

/**--------------------------------------------------------------------**/

export const ETextWithLabel=(props)=>{
    return(
        <StyledTextWithLabel  {...props}></StyledTextWithLabel>
    )
};

ETextWithLabel.propTypes = {
    // Label
    label: PropTypes.string.isRequired,
    // Value to be displaied
    value: PropTypes.object,
};