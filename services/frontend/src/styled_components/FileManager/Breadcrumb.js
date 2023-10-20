import { Fragment } from 'react';
import {theme} from "MuiTheme";
import { Box } from '@mui/material';
import ESvgIcon from 'styled_components/SvgIcon';
import {ReactComponent as BackwardIcon} from 'icons/icons_48/Arrow small L.svg';
import { useSearchParams } from 'react-router-dom';

function Breadcrumb({folders, setFolders, setActiveContent, simple=false}) {
  let [searchParams, setSearchParams] = useSearchParams();
  let breadcrumb = [];
  
  let current = folders;
  while (current?.hasOwnProperty('_parent')) {
    breadcrumb.unshift(current);
    current = current._parent;
  }

  return (<>
    {simple ? <nav>
      {breadcrumb.map((item, index) => (
        <Fragment key={item._id} >
          <span style={{ cursor: 'pointer', color: 'inherit' }}
                onClick={() => { 
                  if (item._id!==folders._id) {
                    setFolders(item); 
                    setActiveContent(null);
                    setSearchParams({folder: item._name});
                  } }} >
            {simple && item._name==='Main catalogue' ? 'Home' : item._name}
          </span>
            <span style={{color: 'inherit', padding: "0 3px", fontSize:"14px"}}>
              {index < breadcrumb.length - 1 && '>'}</span>
        </Fragment>
      ))}
    </nav>:<>
      {breadcrumb.length>0 && <Box component='nav' display={{xs:"block", sm: 'block', md: 'none' }} className={'breadcrumb'} sx={{borderRadius:"1rem", bgcolor: "#f2fdff", mb:0}}>
        {breadcrumb.length>1 && <Box component='span' onClick={() => { 
          if (breadcrumb.length>1) {
            setFolders(breadcrumb[breadcrumb.length-2]); 
            setActiveContent(null);
            setSearchParams({folder: breadcrumb[breadcrumb.length-2]._name});
          } }} sx={{px:2}}>
          <ESvgIcon viewBox={"16 16 16 16"} component={BackwardIcon} color={theme.palette.primary.darkViolet}/>
        </Box>}
        <span style={{ cursor: 'pointer', color: theme.palette.neutrals.almostBlack, fontSize:"14px"}} >
                {breadcrumb[breadcrumb.length-1]._name}</span>
      </Box>}
      {breadcrumb.length>0 && <Box component='nav' display={{xs:"none", sm: 'none', md: 'block' }} className={'breadcrumb'} sx={{borderRadius:"1rem", bgcolor: "#f2fdff", mb:0}}>
        {breadcrumb.map((item, index) => (
          <Fragment key={item._id} >
            <span style={{ cursor: 'pointer', color: (index === breadcrumb.length - 1)?theme.palette.neutrals.almostBlack:theme.palette.neutrals.grey50, fontSize:"14px"}}
                  onClick={() => { 
                    if (item._id!==folders._id) {
                      setFolders(item); 
                      setActiveContent(null);
                      setSearchParams({folder: item._name});
                    } }} >
                    {item._name}</span>
            <span style={{color: theme.palette.neutrals.grey50, padding: "0 8px", fontSize:"14px"}}>
              {index < breadcrumb.length - 1 && '>'}</span>
          </Fragment>
        ))}
      </Box>}
    </>}
  </>);
}

export default Breadcrumb;
