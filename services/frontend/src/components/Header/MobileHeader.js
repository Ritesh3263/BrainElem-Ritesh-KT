import React from 'react';

import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";

import Admin from './ByRoles/Mobile/Admin';
import Architect from './ByRoles/Mobile/Architect';
import Cloudmanager from './ByRoles/Mobile/Cloudmanager';
import Ecomanager from './ByRoles/Mobile/Ecomanager';
import Inspector from './ByRoles/Mobile/Inspector';
import Librarian from './ByRoles/Mobile/Librarian';
import Networkmanager from './ByRoles/Mobile/Networkmanager';
import Others from './ByRoles/Mobile/Others';
import Parent from './ByRoles/Mobile/Parent';
import Partner from './ByRoles/Mobile/Partner';
import Trainee from './ByRoles/Mobile/Trainee';
import Trainer from './ByRoles/Mobile/Trainer';
import TrainingManager from './ByRoles/Mobile/TrainingManager';
import Coordinator from './ByRoles/Mobile/Coordinator';

const MobileHeader = ({ drawerOpen, handle }) => {
    const { F_getHelper } = useMainContext();
    const { user } = F_getHelper();
    const roleDependentHeader = (user) => {
        let role = user?.role

        switch (role) {
            case "ModuleManager": {// <------------------------------------------- SENTINEL(only module managers)
            // Component with Navigation for ModuleManager will be removed
            // So far it was just a duplicate of Others.js and we had to update both files
                if (!user.moduleId) return (null);    
                // # My Space + TC
                if (!user?.isInCognitiveCenter) return <Trainee drawerOpen={drawerOpen} handle={handle} />
                // # Sentinel
                else return (<Others drawerOpen={drawerOpen} handle={handle} />);
            }
            case "Root": return (<Admin drawerOpen={drawerOpen} handle={handle} />);
            case "EcoManager": return (<Ecomanager drawerOpen={drawerOpen} handle={handle} />);
            case "Partner": return (<Partner drawerOpen={drawerOpen} handle={handle} />)
            case "TrainingManager": return (<TrainingManager drawerOpen={drawerOpen} handle={handle} />)
            case "Inspector": return (<Inspector drawerOpen={drawerOpen} handle={handle} />)
            case "Networkmanager": return (<Networkmanager drawerOpen={drawerOpen} handle={handle} />)
            case "Assistant": return (<Others drawerOpen={drawerOpen} handle={handle} />);
            case "Coordinator": return (<Coordinator />);
            case "Architect": return (<Architect drawerOpen={drawerOpen} handle={handle} />)
            case "Librarian": return (<Librarian drawerOpen={drawerOpen} handle={handle} />)
            case "Trainee": {// <-------------------------------------------------------------------------- MY SPACE
                if (!user.moduleId) return (null);
                return (<Trainee drawerOpen={drawerOpen} handle={handle} />)
              }
            case "Parent": return (<Parent drawerOpen={drawerOpen} handle={handle} />)
            case "Trainer": return (<Trainer drawerOpen={drawerOpen} handle={handle} />)
            case "Cloudmanager": return (<Cloudmanager drawerOpen={drawerOpen} handle={handle} />)
            case "Other": return (<Others drawerOpen={drawerOpen} handle={handle} />)// <-------------------- SENTINEL
            default: return (null);
        }
    }
    return (<>
        {roleDependentHeader(user)}    </>)
};

export default MobileHeader;