import {useCallback, useState} from "react";
import { theme } from 'MuiTheme'
import StyledTableToolbar from "./TableToolbar";
import StyledNoRowsOverlay from "./NoRowsOverlay";
import TableSearch from "../../components/common/Table/TableSearch";
import {ReactComponent as PlayIcon} from "icons/icons_48/Play.svg";
import {ReactComponent as UnsortedIcon} from "icons/icons_48/Sort.svg";
import {ReactComponent as SortAIcon} from "icons/icons_48/sort U.svg";
import {ReactComponent as SortDIcon} from "icons/icons_48/sort D.svg";
import { useMediaQuery, Grid, MenuItem, Paper, Typography, Menu, MenuList, IconButton, Box, Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";

import {
    DataGrid,
    gridClasses,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
  } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import SvgIcon from "styled_components/SvgIcon";
import { ECard } from "styled_components";
import ESvgIcon from "styled_components/SvgIcon/SvgIcon.styled";
import { new_theme } from "NewMuiTheme";

function EliaPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const sx = {border: 'none', fontFamily: "Nunito", fontWeight: '600', background: 'none', color: palette.neutrals.almostBlack}
  
    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="circular"
        page={page + 1}
        count={pageCount}
        pageSize={apiRef.current.state.pagination.pageSize}
        renderItem={(props2) => <PaginationItem {...props2} disableRipple components={{ 
            previous: ()=><SvgIcon viewBox="18 9 20 30" transform="scale(-1 1)" height="100%" component={PlayIcon}/>,
            next: ()=><SvgIcon viewBox="18 9 20 30" component={PlayIcon}/>,
        }} />}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        rowsPerPageOptions={[5, 10, 15, 25]}
        sx={{ 
            '& .MuiPaginationItem-root': {...sx, background: palette.shades.white50 },
            '& .MuiPaginationItem-root:hover': {...sx, background: palette.shades.white50 },
            '& .MuiPaginationItem-root:focus': {...sx, background: palette.shades.white50 },
            '& .MuiPaginationItem-root.Mui-selected': {...sx, background: palette.gradients.pink, color: palette.neutrals.white },
            '& .MuiPaginationItem-root.Mui-selected:hover': {...sx, background: palette.gradients.pink, color: palette.neutrals.white },
            '& .MuiPaginationItem-root.Mui-selected:focus': {...sx, background: palette.gradients.pink, color: palette.neutrals.white },
            '& .MuiPaginationItem-root.Mui-disabled': {...sx },
            '& .MuiPaginationItem-root.Mui-disabled:hover': {...sx },
            '& .MuiPaginationItem-root.Mui-disabled:focus': {...sx },
            '& .MuiPaginationItem-previousNext': {...sx },
            '& .MuiPaginationItem-previousNext:hover': {...sx },
            '& .MuiPaginationItem-previousNext:focus': {...sx },
        }}
      />
    );
}

function Footer ({pageSize, setPageSize, rowsPerPageOptions}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const { t } = useTranslation();
    const menuItems = rowsPerPageOptions.map(i=>(
        <MenuItem key={i}
            onClick={()=>{
                setPageSize(i);
                setAnchorEl(null);
            }}
        >
            <Typography variant="body2" component='div' style={{color: new_theme.palette.secondary.DarkPurple, fontSize:12, padding:0}}>
                {i}
            </Typography>
        </MenuItem>
    ));

    const viewItemsMenu = (
        <Menu anchorEl={anchorEl}
            open={menuOpen}
            onClose={()=>setAnchorEl(null)}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        >
            <MenuList dense disablePadding>{menuItems}</MenuList>
        </Menu>);
    return (
        <Grid container justifyContent={{xs:"end",sm:"end",md:'center'}} alignItems="center" sx={{height: '100%', width: '100%', marginTop: '1rem'}}>
            <Box sx={{position: 'absolute', left: '0'}}>
                <Grid xs={8} sx={{display:'content'}}>
                     <Paper elevation={0} style={{borderRadius:'50px', paddingLeft:10, paddingRight:0, paddingTop:0, paddingBottom:0, width: 'max-content'}}>
                         <Grid container>
                             <Grid item sx={{display:'flex', alignItems: 'center', pr:'26px'}}>
                                 <Typography variant="body2" component='div'
                                             style={{color: new_theme.palette.secondary.DarkPurple, fontSize:13, paddingRight:8, fontFamily:"'Nunito'", width: 'max-content'}}
                                 >
                                     {t("No. per page")}: {pageSize}
                                 </Typography>
                             </Grid>
                             <Grid item sx={{display:'flex', ml:'-26px'}}>
                                 <IconButton size="small" color="primary"
                                             onClick={({currentTarget})=>setAnchorEl(currentTarget)}
                                             style={{ backgroundColor: palette.primary.violet, height:'26px', width:'26px'}}
                                 >
                                    <SvgIcon viewBox="-4 -3 54 54" color={palette.neutrals.white} component={PlayIcon} style={{ transform: 'rotate(90deg)', borderRadius: '50%', height: '26px', width: '26px'}} />
                                    {/* <PlayArrowOutlinedIcon style={{fill:'white', rotate:'90deg', padding:'4px'}}/> */}
                                 </IconButton>
                                 {viewItemsMenu}
                             </Grid>
                         </Grid>
                     </Paper>
                 </Grid>
            </Box>
            <Grid item>
                <EliaPagination />
            </Grid>
        </Grid>
    )
}

const palette = theme.palette
const palette2 = new_theme.palette

const StyledDataGrid = styled(({cptRef,...otherProps }) => {
    const smAndDown = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();
    const handlePageSizeChange=(toSize)=>{ setPageSize(toSize) };

    const getRowSpacing = useCallback((params) => {
        return {
            top: params.isFirstVisible ? 0 : rowsMargin,
            bottom: params.isLastVisible ? 0 : rowsMargin,
        };
    }, []);

    const {
        PreviewTile = null,
        // NavComponent = null,
        navOptions = {},
        Breadcrumb = null,
        rows = [],
        columns = [],
        columnsM = [],
        autoHeight = true,
        disableSelectionOnClick = false,
        isVisibleToolbar = false,
        rowSpacingType = 'margin',
        originalData = [],
        setRows = ()=>{},
        defaultRowsPerPage = 5,
        rowsPerPageOptions = [5, 10, 15, 25],
        rowsMargin = 5,
        folders,
        setFolders,
        activeContent,
        setActiveContent,
    } = otherProps;

    const [pageSize,setPageSize] = useState(defaultRowsPerPage);
    const [searchText, setSearchText] = useState('');

    const _props = {
      ...otherProps,
        rows,
        columns,
        columnsM,
        originalData,
        autoHeight,
        disableSelectionOnClick,
        rowSpacingType,
        pageSize,
        rowsPerPageOptions,
        getRowSpacing: getRowSpacing,
        rowsMargin,
        setRows,
        onPageSizeChange: handlePageSizeChange,
        components:{
            NoRowsOverlay: StyledNoRowsOverlay,
            Toolbar: isVisibleToolbar ? StyledTableToolbar : null,
            // Pagination: EliaPagination,
            Footer: ()=>Footer({pageSize, setPageSize, rowsPerPageOptions}),
            ColumnSortedAscendingIcon: ()=><ESvgIcon viewBox="-3 -3 54 54" component={SortAIcon} sx={{height:'28px',width:'auto'}} />,
            ColumnSortedDescendingIcon: ()=><ESvgIcon viewBox="-3 -3 54 54" component={SortDIcon} sx={{height:'28px',width:'auto'}} />,
            ColumnUnsortedIcon: ()=><ESvgIcon viewBox="-3 -3 54 54" component={UnsortedIcon} sx={{height:'28px',width:'auto'}} />,
        },
        componentsProps:{
            toolbar: {
                navOptions,
                value: searchText,
                onChange: ({target:{value}}) => TableSearch(value,originalData,setSearchText, setRows),
                clearSearch: () => TableSearch('',originalData,setSearchText, setRows),
            },
        },
    };

    return(<>
        <Paper elevation={8} className='w-100' style={{background: theme.palette.glass.opaque, padding: "20px"}}>
            <Grid container spacing={3}>
                <Grid container className='ml-4 mt-4'>
                    {StyledTableToolbar(_props.componentsProps.toolbar)}
                </Grid>
                <Grid item xs={12} container spacing={3} style={{paddingRight:0}}>
                    <Grid item xs={12} style={{paddingTop:'0px !important'}} {...(activeContent && {md: 8})} >
                        {Breadcrumb && <Grid item xs={12} style={{paddingRight:0, zIndex:2}} sx={{display:'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                            {Breadcrumb}
                        </Grid>}
                        <Grid item xs={12} sx={{pt:0, display: { xs: "none", sm: "none", md: "block" }}}>
                            <DataGrid {..._props} 
                                getRowHeight={()=>48} 
                                getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{mt:4, display: { xs: "block", sm: "block", md: "none" }}}>
                            <DataGrid {...{..._props, columns:columnsM}} 
                                headerHeight={0} 
                                getRowHeight={_=>_.model.inside?52:112}
                                getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
                            />
                        </Grid>
                    </Grid>
                    {activeContent && PreviewTile && <Grid md={4} display={{ xs: "none", sm: "none", md: "block" }}>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
                            <ECard sx={{mb:2, mt:2, display:"block"}} >
                                {PreviewTile}
                            </ECard>
                        </Grid>
                    </Grid>}
                    <Dialog open={!!activeContent} 
                        onClose={()=>setActiveContent(null)} 
                        sx={{display: { xs: 'block', sm: 'block', md: 'none' }}}
                        PaperProps={{
                            style: { borderRadius: 8 },
                            // display: { xs: 'block', sm: 'block', md: 'none' }
                        }}>
                        {activeContent && PreviewTile}
                    </Dialog>
                </Grid>
            </Grid>
        </Paper>
    </>)
})`
    border: none ; 
    font-weight: 500;
    & .MuiDataGrid-virtualScroller {
        overflow: hidden;
    };
    & .MuiDataGrid-cell {
        border: none;
        font-weight: 500;
    };
    & .theme-selected-item {
        background: ${new_theme.palette.secondary.DarkPurple} !important;
    };
    & .MuiDataGrid-row {
        border: 1px solid ${palette.shades.white90};
        width: -webkit-calc(100% - 2px);
        width: calc(100% - 2px);
        background: ${palette.shades.white30};
        border-radius: 8px;
    };
    & .MuiDataGrid-row:hover {
        background-color: ${palette.shades.white70};
    };
    & .MuiDataGrid-row.Mui-selected {
        background-color: ${palette.shades.white90};
    };
    & .MuiDataGrid-row.Mui-selected:hover {
        background-color: ${palette.neutrals.white};
        border: 1px solid ${palette.neutrals.white};
    };
    & .MuiDataGrid-columnHeaders {
        border: none;
    };
    & .MuiDataGrid-columnHeaderTitle {
        font-size: 16px;
        color: ${palette.primary.darkViolet};
        font-family: 'Roboto';
    };
    & .MuiDataGrid-footerContainer {
        border: none;
        justify-content: center;
        margin-top: 8px;
    };
    & .MuiDataGrid-selectedRowCount {
        display: none;
    };
    & .MuiDataGrid-iconSeparator {
          display: none;
    };
    & .MuiTablePagination-selectLabel {
          margin-bottom: 0;
          color: ${palette2.newSupplementary.NSupText};
    };
    & .MuiTablePagination-displayedRows {
          margin-bottom: 0;
          color: ${palette2.newSupplementary.NSupText};
    };
    & .MuiSelect-select {
        padding-right: 8px !important;
        padding-left: 8px;
    };
`;

export default StyledDataGrid;
