import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Collapse from '@mui/material/Collapse';
import { useNavigate } from "react-router-dom";
import { new_theme } from 'NewMuiTheme';
import "./mobnav.scss";

const NestedList = (props) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleClick = () => {
    setOpen(!open);
  };
  const navigateRouteLink = (item) => {
    navigate(item.to);
    props.handle(false);
  }
  return (
    <div>
      <ListItemButton onClick={handleClick} className="list_item_button" sx={{fontWeight: 'bold', borderBottom: `1px solid ${new_theme.palette.newSupplementary.SupCloudy}`}}>

        <ListItemText primary={t(props.name)} sx={{fontWeight: 'bold'}} className="list_item_text" />
        {open ? <RemoveIcon /> : <AddIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {
            props.menu.filter(x=>x.visible).map((item) => item.submenu ? <NestedList name={t(item.name)} menu={item.menu} /> : <ListItemButton sx={{ pl: 4 }} onClick={() => {
              navigateRouteLink(item)
            }}>
              <img src={`/img/sidenav/${item.icon}.svg`} style={{height: '25px', marginRight: '12px'}} /> 
              {console.log(item)}
              <ListItemText primary={t(item.name)} />
            </ListItemButton>)
          }

        </List>
      </Collapse>
    </div>
  );
};

export default NestedList;