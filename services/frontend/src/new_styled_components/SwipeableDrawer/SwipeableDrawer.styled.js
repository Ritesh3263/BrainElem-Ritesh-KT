import {styled} from "@mui/system";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

const StyledSwipeableDrawer = styled(({cptRef,...otherProps }) => (
    <SwipeableDrawer {...otherProps} />
))`

`;

export default StyledSwipeableDrawer;
