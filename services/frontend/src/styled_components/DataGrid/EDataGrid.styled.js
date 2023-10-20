import {styled} from "@mui/system";
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {useCallback, useState} from "react";
import StyledTableToolbar from "./TableToolbar";
import StyledNoRowsOverlay from "./NoRowsOverlay";
import TableSearch from "../../components/common/Table/TableSearch";
import  KeyboardArrowDownIcon from '../../icons/icons_48/arrow_down.svg';
import { new_theme } from "NewMuiTheme";
// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette
const palette2 = new_theme.palette

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
      overflow: auto;
      white-space: normal;
      max-height: 100% !important;
   };

  & .theme-selected-item {
   background: ${palette2.neutrals.lightblue} !important;
  };
  
   & .MuiDataGrid-row {
      border: none;
      background: ${palette.glass.opaque};
      border-radius: 8px;
      max-height: 100% !important;
   };
        
   & .MuiDataGrid-row:hover {
      background-color: ${palette2.shades.white60};
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
      justify-content :right;
      background-color: ${palette2.newSupplementary.SupCloudy};
   };

   & .MuiTablePagination-root{
        color: ${palette2.newSupplementary.NSupText};
   }
   
    & .MuiDataGrid-iconSeparator {
          display: none;
    };
  
    & .MuiTablePagination-selectLabel {
        margin-bottom: 0;
        color: ${palette2.newSupplementary.NSupText};
        font-weight: 400;
        font-size: 16px;
        font-family: 'Roboto';
  };
  & .MuiTablePagination-selectIcon{
    background-image: url('${KeyboardArrowDownIcon}');
    background-size: 14px;
    background-position: 10px center;
    background-repeat: no-repeat;
    &.MuiSelect-iconOpen{
        background-position: 0px center;
      }
    path{
      opacity: 0;
    }
  }
  
  & .MuiTablePagination-displayedRows {
        margin-bottom: 0;
        color: ${palette2.newSupplementary.NSupText};
        font-weight: 400;
        font-size: 16px;
        font-family: 'Roboto';
  };  
`;

export default StyledDataGrid;
