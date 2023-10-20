import {styled} from "@mui/system";
import Chip from '@mui/material/Chip';


const returnColor =(type)=>{
    switch(type){
        case 'Trainee': return 'linear-gradient(94.87deg, #C57DDE 8.06%, #B73060 113.25%)';
        case 'Trainer': return 'linear-gradient(94.93deg, #50586A 6.9%, #B1B9C9 110.93%)';
        case 'Parent': return 'linear-gradient(94.99deg, #7196F7 10.35%, #9FB8F9 113.22%)';
        case 'ClassManager': return 'linear-gradient(94.93deg, #6D30B7 9.21%, #9B71CD 113.23%)';
        case 'ModuleManager': return 'linear-gradient(95.24deg, #3076B7 12.59%, #6A9DCB 110.88%)';
        case 'Assistant': return 'linear-gradient(95.24deg, #3076B7 12.59%, #6A9DCB 110.88%)';
        case 'Librarian': return 'linear-gradient(94.44deg, #15A3A5 6.96%, #5BBFC0 109.69%)';
        case 'Architect': return 'linear-gradient(94.8deg, #A08832 -5.77%, #E6CC25 123.46%)';
        case 'NetworkManager': return 'linear-gradient(95.38deg, #B73060 14.85%, #CD7091 110.85%)';
        case 'Inspector': return 'linear-gradient(94.86deg, #EFCC1A -5.76%, #9B71CD 100%)';
        case 'Role': return '#E1E1E4';
        case 'TrainingManager': return 'linear-gradient(94.8deg, #DB7E24 -5.77%, #EFCC1A 123.46%)';
        case 'Examiner': return 'linear-gradient(94.8deg, #DB7E24 -5.77%, #EFCC1A 123.46%)';
        case 'Ecomanager': return 'linear-gradient(94.8deg, #B06C12 -5.77%, #EDC593 123.46%)';
        case 'Partner': return 'linear-gradient(94.44deg, #15A3A5 6.96%, #5BBFC0 109.69%)';
        case 'Coordinator': return 'linear-gradient(94.44deg, #15A3A5 6.96%, #5BBFC0 109.69%)';
        default: return 'linear-gradient(94.87deg, #C57DDE 8.06%, #B73060 113.25%)';
    }
}
const StyledUserRoleChip = styled(({cptRef,...otherProps }) => (
    <Chip {...otherProps} />
))`
    -webkit-clip-path: polygon(0 10%, 85% 10%, 100% 45%, 100% 50%, 100% 55%, 85% 90%, 0 90%);
    clip-path: polygon(0 10%, 85% 10%, 100% 45%, 100% 50%, 100% 55%, 85% 90%, 0 90%);
    border-bottom-left-radius: 8px;
    font-size: 14px;
    font-family: Roboto;
    color: #fff;
    border-top-left-radius: 8px;
    background: ${({role='Trainee'})=>returnColor(role)};
    // border-bottom-right-radius: 30px;
    //border-bottom-right-radius: 25px;
    // border-top-right-radius: 30px;
    //border-top-right-radius: 25px;
    //min-width: 100px;
    //&:after{
    //  border-top-left-radius: 6px;
    //  border-bottom-left-radius: 6px;
    //  border-top: 12px solid transparent;
    //  border-left: 28px solid #0065F2;
    //  border-bottom: 12px solid transparent;
    //  position: relative;
    //  right: -28px;
    //  height: 100%;
    //  width: 30px;
        width: 80%;
    //  content: '';
    //}
`;

export default StyledUserRoleChip;