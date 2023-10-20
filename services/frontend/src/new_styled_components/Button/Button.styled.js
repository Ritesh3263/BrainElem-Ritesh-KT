import { styled } from '@mui/system';
import { Button } from "@material-ui/core";
import { new_theme } from 'NewMuiTheme';

const palette = new_theme.palette

const returnButtonPadding = (value) => {
  switch (value) {
    case 'xsmall': return '2.5px 32.5px !important';
    case 'small': return '4px 16px !important';
    case 'medium': return '7.5px 32.5px !important';
    case 'large': return '6px 32px !important';
    case 'xlarge': return '14.5px 32.5px !important';
    default: return '7.5px 32.5px !important';
  }
};
const returnButtonFontSize = (value) => {
  switch (value) {
    case 'xsmall': return 'x-small';
    case 'small': return 'small';
    case 'medium': return 'medium';
    case 'large': return 'large';
    case 'xlarge': return 'x-large';
    default: return 'xlarge';
  }
};

const StyledButton = styled(({ cptRef, ...otherProps }) => (
  <Button {...otherProps} ref={cptRef} />
))`
min-width: ${({eSize = 'medium'}) => eSize=== "xsmall" ? '92px' : eSize === "medium" ? '150px' : eSize === "large" ? '150px' : '125px'};
border:  1px solid;
border-color: ${({ eVariant = 'primary' }) => eVariant === 'primary' ? new_theme.palette.secondary.Turquoise : new_theme.palette.secondary.DarkPurple};
border-radius: ${({eSize = 'medium'}) => eSize === "xsmall" ? '6px' : eSize === "small" ? '6px' : eSize === "medium" ? '6px' : eSize === "large" ? '10px' : '12px'};
padding: ${({eSize = 'medium'}) => eSize === "xsmall" ? '4px 16px !important' : eSize === "small" ? '4px 25px !important' : eSize === "medium" ? '4px 20px !important' : eSize === "large" ? '5px 25px !important' : '8px 35px !important'} ;
font-size: ${({eSize = 'medium'}) => eSize === "xsmall" ? '15px' : eSize === "small" ? '18px' : eSize === "medium" ? '18px' : eSize === "large" ? '24px' : '24px'};
@media (max-width: 1200px){
  padding: ${({eSize = 'medium'}) => eSize === "xsmall" ? '4px 16px !important' : eSize === "small" ? '4px 25px !important' : eSize === "medium" ? '4px 20px !important' : eSize === "large" ? '5px 22px !important' : '8px 35px !important'} ;
  // font-size: ${({eSize = 'medium'}) => eSize === "xsmall" ? '15px' : eSize === "small" ? '15px' : eSize === "medium" ? '17px' : eSize === "large" ? '19px' : '26px'};
  min-width: 100px;
  // border-radius: 5px;
}
@media (max-width: 600px){
  padding: ${({eSize = 'medium'}) => eSize === "xsmall" ? '4px 16px !important' : eSize === "small" ? '4px 25px !important' : eSize === "medium" ? '4px 20px !important' : eSize === "large" ? '5px 18px !important' : '8px 35px !important'} ;
  // font-size: ${({eSize = 'medium'}) => eSize === "xsmall" ? '12px' : eSize === "small" ? '12px' : eSize === "medium" ? '14px' : eSize === "large" ? '16px' : '26px'};
  min-width: 90px;
  // border-radius: 5px;
}
font-weight: bold;
box-shadow: none;
background-color: ${({ eVariant = 'primary' }) => eVariant === 'primary' ? new_theme.palette.secondary.Turquoise : new_theme.palette.primary.PWhite};
color: ${new_theme.palette.secondary.DarkPurple};
svg{
  font-size: 14px;
  margin-right: 7px;
}
&:hover{
    ${({ eVariant = 'primary' }) => eVariant === 'primary' ?
    `background-color:  ${new_theme.palette.primary.MedPurple};
     border-color:${new_theme.palette.primary.MedPurple};
     color: ${new_theme.palette.primary.PWhite};
    `
    : `background-color: ${new_theme.palette.primary.MedPurple}; 
        color: ${new_theme.palette.primary.PWhite};
        border-color:${new_theme.palette.primary.MedPurple}`
    }
}
&:disabled{
    ${`background-color: ${new_theme.palette.newSecondary.NSDisabled}; 
        color: ${new_theme.palette.primary.PWhite};
        border-color: ${new_theme.palette.newSecondary.NSDisabled};
       `
    }
}
`;

export default StyledButton;
