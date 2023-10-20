import { styled } from '@mui/system';
import {Button} from "@material-ui/core";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const returnButtonHeight=(value)=>{
    switch(value){
        case 'xsmall': return '18px';
        case 'small': return '32px';
        case 'medium': return '42px';
        case 'large': return '56px';
        case 'xlarge': return '60px';
        default: return '32px';
    }
};

const returnButtonFontSize=(value)=>{
    switch(value){
        case 'xsmall': return 'x-small';
        case 'small': return 'small';
        case 'medium': return 'medium';
        case 'large': return 'large';
        case 'xlarge': return 'x-large';
        default: return 'medium';
    }
};

const returnButtonPadding=(value)=>{
  switch(value){
      case 'xsmall': return '2.5px 32.5px !important';
      case 'small': return '2.5px 32.5px !important';
      case 'medium': return '7.5px 32.5px !important';
      case 'large': return '14.5px 32.5px !important';
      case 'xlarge': return '14.5px 32.5px !important';
      default: return '7.5px 32.5px !important';
  }
};


const StyledButton = styled(({cptRef,...otherProps }) => (
    <div style={{transform: `translateZ(-1px)`}}><Button {...otherProps} ref={cptRef}/></div>
))`
  ${({eVariant='primary'})=> eVariant === 'primary' ? '' : 'position: relative;'}
  border:  ${({eVariant='primary'})=> eVariant === 'primary' ? 'none' : `2px solid transparent;`}
  border-radius: 16px;
  height: ${({eSize='small'})=>returnButtonHeight(eSize)};
  padding: ${({eSize='small'})=>returnButtonPadding(eSize)};
  min-width: fit-content;
  font-size: ${({eSize='small'})=>returnButtonFontSize(eSize)};
  cursor: ${({isLoading})=> isLoading ? 'default' : 'pointer'};
  pointer-events: ${({isLoading})=> isLoading ? 'none' : 'all'};
  max-width: 400px;
  box-shadow: none;

  background: ${({eVariant='primary'})=> eVariant === 'primary' ? palette.gradients.pink : palette.neutrals.white};
  color: ${({eVariant='primary'})=> eVariant === 'primary' ? palette.primary.creme : palette.primary.violet};
  background-clip: padding-box;

  span{
    white-space: nowrap;
    //overflow: inherit;
    //text-overflow: ellipsis;
  };
  svg{
    font-size: ${({eSize='medium'})=>returnButtonFontSize(eSize)};
    };
  &:disabled{
    ${({eVariant='primary'})=> eVariant === 'primary' ? `
      background: ${palette.neutrals.fadeViolet} !important;  
      color:  ${palette.neutrals.grey};
    ` : `
      background-color: ${palette.primary.creme} !important;
      color:  ${palette.neutrals.lightGrey};
      &:after{
        background: transparent !important;
      }`
    }
  }
  &:hover{
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    ${({eVariant='primary'})=> eVariant === 'primary' ? 
      `background: ${palette.gradients.lila} !important;` 
     : `background-color: ${palette.neutrals.white} !important;`
    }
  }
  &:active{
    ${({eVariant='primary'})=> eVariant === 'primary' ? 
      `background: ${palette.primary.yellow} !important;` 
     : `background-color: ${palette.primary.violet} !important;`
    }
    color: ${({eVariant='primary'})=> eVariant === 'primary' ? palette.primary.darkViolet : `${palette.primary.creme} !important`};
    ${({eVariant='primary'})=> eVariant === 'primary' ? `` : `
      &:after{
        background: ${palette.primary.creme} !important;
      }`
    }
  }
  &:disabled{
    ${({eVariant='primary'})=> eVariant === 'primary' ? 
      `background: ${palette.neutrals.fadeViolet} !important;
       color: ${palette.neutrals.grey}
      ` 
     : `background-color: ${palette.primary.creme} !important; 
        color: ${palette.neutrals.lightGrey};
        &:after{
          background: ${palette.neutrals.lightGrey}
        }
       `
    }
  }
  ${({eVariant='primary'})=> eVariant === 'primary' ? `` : `
    &:after{
      position: absolute;
      top: -2px;
      bottom: -2px;
      left: -2px;
      right: -2px;
      content: "";
      z-index: -1;
      border-radius: 16px;
      background: linear-gradient(132.79deg, #C972FF 0%, ${palette.primary.green} 104.17%);
    }`
  }
`;
export default StyledButton;