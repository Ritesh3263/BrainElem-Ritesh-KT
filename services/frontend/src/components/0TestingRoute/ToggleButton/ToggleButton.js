import * as React from 'react';
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

export default function CustomizedMenus() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls="basic-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                color="secondary"
                // disableElevation
                onClick={(e)=>{setAnchorEl(e.currentTarget)}}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Options
            </Button>
            <Menu
                className="mt-5"
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={()=>{setAnchorEl(null)}}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={()=>{setAnchorEl(null)}}>Profile</MenuItem>
                <MenuItem onClick={()=>{setAnchorEl(null)}}>My account</MenuItem>
            </Menu>
        </div>
    );
}