import {styled} from "@mui/system";
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {useCallback, useState} from "react";
import StyledTableToolbar from "./TableToolbar";
import StyledNoRowsOverlay from "./NoRowsOverlay";
import TableSearch from "../../components/common/Table/TableSearch";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const StyledDataGrid = styled(({cptRef,...otherProps }) => {

    const handlePageSizeChange=(toSize)=>{
      setPageSize(toSize);
    };

    const getRowSpacing = useCallback((params) => {
        return {
            top: params.isFirstVisible ? 0 : rowsMargin,
            bottom: params.isLastVisible ? 0 : rowsMargin,
        };
    }, []);

    const {
        rows = [],
        columns = [],
        autoHeight = true,
        disableSelectionOnClick = true,
        isVisibleToolbar = true,
        rowSpacingType = 'margin',
        originalData = rows,
        setRows = ()=>{},
        defaultRowsPerPage = 10,
        rowsPerPageOptions = [5, 10, 15, 25],
        rowsMargin = 5,
    } = otherProps;

    const [pageSize,setPageSize] = useState(defaultRowsPerPage);
    const [searchText, setSearchText] = useState('');

    const _props = {
      ...otherProps,
        rows,
        columns,
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
        },
        componentsProps:{
            toolbar: {
                value: searchText,
                    onChange: ({target:{value}}) => TableSearch(value,originalData,setSearchText, setRows),
                    clearSearch: () => TableSearch('',originalData,setSearchText, setRows),
            },
         }
    };

    return(<DataGrid {..._props} getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}  />)
})`
   border: none ; 
  
   & .MuiDataGrid-cell {
      border: none;
      font-weight: 500;

   };

  & .theme-selected-item {
   background: rgba(21, 163, 165, .1) !important;
  };
  
   & .MuiDataGrid-row {
      border: none;
      background: ${palette.glass.opaque};
      border-radius: 8px;
   };
        
   & .MuiDataGrid-row:hover {
      background-color: rgba(255,255,255,0.65);
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
   };
   
    & .MuiDataGrid-iconSeparator {
          display: none;
    };
  
    & .MuiTablePagination-selectLabel {
          margin-bottom: 0;
    };
    
    & .MuiTablePagination-displayedRows {
          margin-bottom: 0
    };
`;

export default StyledDataGrid;
