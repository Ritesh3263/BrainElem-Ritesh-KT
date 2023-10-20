import React, { useContext, createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// Services
import CommonService from "services/common.service";
import AuthService from "../../../services/auth.service";
import ModuleService from "../../../services/module.service";
import UserService from "../../../services/user.service";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

// For removing items in shopping cart on logout 
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

import qs from "qs";

const MainContext = createContext(undefined);
const userPermissionInit = {
    isAdmin: false,
    isEcoManager: false,
    isCloudManager: false,
    isSubscriptionOwner: false,
    isModuleManager: false,
    isAssistant: false,
    isArchitect: false,
    isTrainer: false,
    isParent: false,
    isLibrarian: false,
    isClassManager: false,
    isTrainee: false,
    isSelfRegistered: false,
    isInspector: false,
    isCoordinator: false,
    isTrainingManager: false,
    isPartner: false,
    id: "",
    // newly designed permissions segment
    home: { access: false, edit: false },
    admin_auth: { access: false, edit: false },
    admin_teams: { access: false, edit: false },
    mt_teams: { access: false, edit: false },
    mt_bcTestReg: { access: false, edit: false },
    mt_results: { access: false, edit: false },
    mt_statistics: { access: false, edit: false },
    mu_users: { access: false, edit: false },
    mu_bcTestReg: { access: false, edit: false },
    myProjects: { access: false, edit: false },
    myDiary: { access: false, edit: false },
    bcCoach: { access: false, edit: false },
    bcTrainer: { access: false, edit: false },
    ms_myResults: { access: false, edit: false }, // My Space - My Results
    ms_virtualCoach: { access: false, edit: false }, // My Space - Virtual Coach
    ms_myResources: { access: false, edit: false }, // My Space - My Resources
};

export function MainProvider({ children }) {
    const navigate = useNavigate();
    const { addToast, removeAllToasts } = useToasts();
    const { t, i18n } = useTranslation(['translation', 'validators']);

    const [mainData, setMainData] = useState({ test: "OK" });
    const [currentLocalization, setCurrentLocalization] = useState([]);
    const [deviceType, setDeviceType] = useState("");
    const [isEdu, setIsEdu] = useState();
    /////////////////////////////////////////////////////////////////////
    const [sidebarState, setSidebarState] = useState({ toggled: false, collapsed: false });
    const [collapseSidebarMobile, setCollapseSidebarMobile] = useState(false);
    const [myCurrentRoute, setMyCurrentRoute] = useState("BrainCore");
    const [navigationTabs, setNavigationTabs] = useState([]);
    const [activeNavigationTab, setActiveNavigationTab] = useState(0);
    const [isCognitiveCenter, setCognitiveCenter] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [confirm, setConfirm] = useState({
        prompt: "",
        isOpen: false,
        proceed: null,
        cancel: null,
        option: {},
    });
    const [fullUser, setFullUser] = useState(null);
    const [currentScreenSize, setCurrentScreenSize] = useState('lg');
    const [toastState, setToastState] = useState({
        show: false,
        message: "Empty",
        variant: "info",
        hideTime: 6000,
    })
    const [manageScopeIds, setManageScopeIds] = useState({
        center: null,
        ecosystemId: "100000000000000000000000",
        subscriptionId: "110000000000000000000000",
        moduleId: "111000000000000000000000",
        isTrainingCenter: false, // true means school center, other training center
        module:''
        
    })
    const [userPermissions, setUserPermissions] = useState(userPermissionInit);
    const [userNotifications, setUserNotifications] = useState([]);
    // If shoppingCartContext is not provided(eg. in /results view) use empty values
    const shoppingCartContext = useShoppingCartContext();
    const {
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
    } = shoppingCartContext ? shoppingCartContext : { shoppingCartDispatch: () => { }, shoppingCartReducerActionsType: [] };



    // Set initial state for isEdu
    // This can be called even before login 
    useEffect(() => {
        // When component is loaded set state
        return  setIsEdu(CommonService.isEdu(currentUser))
    }, [])


    // Keep isEdu in localstorage
    // This can be called even before login 
    useEffect(() => {
        localStorage.setItem('isEdu', isEdu?true:false)
    }, [isEdu])


    useEffect(() => {
        let hasTouchScreen = false;
        if ("maxTouchPoints" in navigator) {
            hasTouchScreen = navigator.maxTouchPoints > 0;
        } else if ("msMaxTouchPoints" in navigator) {
            hasTouchScreen = navigator.msMaxTouchPoints > 0;
        } else {
            const mQ = window.matchMedia && matchMedia("(pointer:coarse)");
            if (mQ && mQ.media === "(pointer:coarse)") {
                hasTouchScreen = !!mQ.matches;
            } else if ("orientation" in window) {
                hasTouchScreen = true; // deprecated, but good fallback
            } else {
                // Only as a last resort, fall back to user agent sniffing
                var UA = navigator.userAgent;
                hasTouchScreen =
                    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
            }
        }

        if (hasTouchScreen) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
                if (window.innerWidth <= 1200 && !/iPad/i.test(navigator.userAgent)) {
                    setDeviceType("mobile");
                } else {
                    setDeviceType("tablet");
                }
            } else {
                setDeviceType("ultrabook");
            }
        } else {
            setDeviceType("desktop");
        }

    }, [])

    const setCurrentLocation = (data) => {
        setCurrentLocalization(p => {
            let val = Object.assign([], p);
            val = [data];
            // if(currentLocalization && currentLocalization.length<=0){
            //     val.push(data);
            // }
            return val;
        })
    }
    const asyncLocalStorage = {
        setItem: (key, value) => Promise.resolve().then(() => localStorage.setItem(key, value)),
        getItem: key => Promise.resolve().then(() => localStorage.getItem(key)),
    };

    /////////////////////////////////////////////////////////////////////
    const F_setCurrentUser = async (data) => {
        setCurrentUser(data);
        if (data) {
            let fullUser = await UserService.read(data.id)
            setFullUser(fullUser.data)
            // UserService.read(data.id).then(response=>{
            //     delete response.data.password;
            //     delete response.data.details;
            //     setFullUser(response.data);
            // })
            if (data.moduleId && data.modules.length > 0) {
                let module = data.modules.find(m => m._id === data.moduleId);
                if (module) {
                    setManageScopeIds(p => {
                        let val = Object.assign({}, p);
                        val.moduleId = data.moduleId;
                        val.isTrainingCenter = module.moduleType === "TRAINING"
                        val.moduleType = module.moduleType
                        return val;
                    })
                }
            }
            if (data.role) {
                //console.log("USER", data)
                console.log("role", data.role)
                switch (data.role) {
                    case "Root": {
                        // console.log("Root (role) - Admin")
                        // set all permissions to true
                        setUserPermissions(p => Object.keys(p).reduce((acc, key) => { acc[key] = true; return acc }, {}));
                        break;
                    }
                    case "EcoManager": {
                        //console.log("EcoManager")
                        setUserPermissions(() => ({ ...userPermissionInit, isEcoManager: true }));
                        // set curren scope id
                        if (data.scopes) {
                            //console.log("scopes>>",data.scopes);
                            let ecosystemId = data.scopes.find(e => e.match('ecosystems:all')).split(":").pop();
                            setManageScopeIds({ ecosystemId: ecosystemId, subscriptionId: undefined, moduleId: undefined, isTrainingCenter: undefined })
                        }
                        break;
                    }
                    case "CloudManager": {
                        setUserPermissions(() => ({ ...userPermissionInit, isCloudManager: true }))
                        // set curren scope id
                        if (data.scopes) {
                            let ecosystemId = data.scopes.find(e => e.match('ecosystems:read')).split(":").pop();
                            setManageScopeIds({ ecosystemId: ecosystemId, subscriptionId: undefined, moduleId: undefined, isTrainingCenter: undefined,module:'COGNITIVE' })
                        }
                        break;
                    }
                    case "NetworkManager": {
                        setUserPermissions(() => ({ ...userPermissionInit, isSubscriptionOwner: true }))
                        // set curren scope id
                        if (data.scopes) {
                            let scope = data.scopes.find(e => e.match('subscriptions:all'));
                            if (scope) {
                                let subscriptionId = scope.split(":").pop();
                                setManageScopeIds(p => ({ ...p, subscriptionId: subscriptionId, moduleId: undefined, isTrainingCenter: undefined }))
                            } else {
                                await F_logout("You are not assigned to any network. So, you are logged out!");
                            }
                        }
                        break;
                    }
                    case "ModuleManager": {
                        setUserPermissions(() => ({ ...userPermissionInit, isModuleManager: true }));
                        // set current module id
                        if (data.scopes) {
                            let scope = data.scopes.find(e => e.match('modules:all'));
                            if (scope) {
                                let moduleId = scope.split(":").pop();
                                setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter,module:'TRAINING' }))
                            } else {
                                await F_logout("You are not assigned to any module. So, you are logged out!");
                            }
                        }
                        break;
                    }
                    case "Assistant": {
                        setUserPermissions(() => ({ ...userPermissionInit, isModuleManager: true }));
                        // set current module id
                        if (data.scopes) {
                            let scope = data.scopes.find(e => e.match('modules:all'));
                            if (scope) {
                                let moduleId = scope.split(":").pop();
                                setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                            } else {
                                await F_logout("You are not assigned to any module. So, you are logged out!");
                            }
                        }
                        break;
                    }
                    case "Architect": {
                        setUserPermissions(() => ({ ...userPermissionInit, isArchitect: true }));
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "Trainer": {
                        setUserPermissions(() => ({ ...userPermissionInit, isTrainer: true }))
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read'));
                            moduleId?.split(":").pop()
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter,module:'TRAINING'}))
                        }
                        await ModuleService.getClassManagersGroups().then(res => {
                            if (res?.data && res.data.length > 0) {
                                setUserPermissions(() => ({ ...userPermissionInit, isClassManager: true, isTrainer: true }))
                            }
                        }).catch(error => console.log(error))
                        break;
                    }
                    case "Parent": {
                        setUserPermissions(() => ({ ...userPermissionInit, isParent: true }))
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "Librarian": {
                        setUserPermissions(() => ({ ...userPermissionInit, isLibrarian: true }))
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "Trainee": {
                        setUserPermissions(() => ({ ...userPermissionInit, isTrainee: true }))
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read'));
                            moduleId?.split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter,module:'' }))
                        }
                        break;
                    }
                    case "Inspector": {
                        setUserPermissions(() => ({ ...userPermissionInit, isInspector: true }));
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "Coordinator": {
                        setUserPermissions(() => ({ ...userPermissionInit, isCoordinator: true }));
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "TrainingManager": {
                        setUserPermissions(() => ({ ...userPermissionInit, isTrainingManager: true }));
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "Partner": {
                        setUserPermissions(() => ({ ...userPermissionInit, isPartner: true }))
                        if (data.scopes) {
                            let moduleId = data.scopes.find(e => e.match('modules:read')).split(":").pop();
                            setManageScopeIds(p => ({ ...p, moduleId: data.moduleId || moduleId, isTrainingCenter: data.isInTrainingCenter }))
                        }
                        break;
                    }
                    case "Other":{
                        setManageScopeIds(p => ({ ...p, module:'COGNITIVE' }))

                    }
                    default: break;
                }
            }

            // rolemaster adjustment
            let newPermissionSegment = {
                home: { access: false, edit: false },
                admin_auth: { access: false, edit: false },
                admin_teams: { access: false, edit: false },
                admin_credits: { access: false, edit: false },
                mt_teams: { access: false, edit: false },
                mt_bcTestReg: { access: false, edit: false },
                mt_results: { access: false, edit: false },
                mt_statistics: { access: false, edit: false },
                mu_users: { access: false, edit: false },
                mu_bcTestReg: { access: false, edit: false },
                myProjects: { access: false, edit: false },
                myDiary: { access: false, edit: false },
                bcCoach: { access: false, edit: false },
                bcTrainer: { access: false, edit: false },
                ms_myResults: { access: false, edit: false }, // My Space - My Results
                ms_virtualCoach: { access: false, edit: false }, // My Space - Virtual Coach
                ms_myResources: { access: false, edit: false }, // My Space - My Resources
            }
            data.permissions.forEach(permission => {
                // setUserPermissions(p => ({ ...p, [permission.moduleName]: { access: permission.access, edit: permission.edit } })) // top p gbt +g as the 'names' ps gbt simple
                switch (permission.moduleName) {
                    case "Home": {
                        newPermissionSegment.home.access = permission.access
                        newPermissionSegment.home.edit = permission.edit
                    }
                    break;
                    case "Admin - Authorization": {
                        newPermissionSegment.admin_auth.access = permission.access
                        newPermissionSegment.admin_auth.edit = permission.edit
                    }
                    break;
                    case "Admin - Teams Access": {
                        newPermissionSegment.admin_teams.access = permission.access
                        newPermissionSegment.admin_teams.edit = permission.edit
                    }
                    break;
                    case "Admin - Credits": {
                        newPermissionSegment.admin_credits.access = permission.access
                        newPermissionSegment.admin_credits.edit = permission.edit
                    }
                    break;
                    case "My Teams - Teams": {
                        newPermissionSegment.mt_teams.access = permission.access
                        newPermissionSegment.mt_teams.edit = permission.edit
                    }
                    break;
                    case "My Teams - BC Test Registrations": {
                        newPermissionSegment.mt_bcTestReg.access = permission.access
                        newPermissionSegment.mt_bcTestReg.edit = permission.edit
                    }
                    break;
                    case "My Teams - Results": {
                        newPermissionSegment.mt_results.access = permission.access
                        newPermissionSegment.mt_results.edit = permission.edit
                    }
                    break;
                    case "My Teams - Statistics": {
                        newPermissionSegment.mt_statistics.access = permission.access
                        newPermissionSegment.mt_statistics.edit = permission.edit
                    }
                    break;
                    case "My Users - Users": {
                        newPermissionSegment.mu_users.access = permission.access
                        newPermissionSegment.mu_users.edit = permission.edit
                    }
                    break;
                    case "My Users - BC Test Registrations": {
                        newPermissionSegment.mu_bcTestReg.access = permission.access
                        newPermissionSegment.mu_bcTestReg.edit = permission.edit
                    }
                    break;
                    case "My Projects": {
                        newPermissionSegment.myProjects.access = permission.access
                        newPermissionSegment.myProjects.edit = permission.edit
                    }
                    break;
                    case "My Diary": {
                        newPermissionSegment.myDiary.access = permission.access
                        newPermissionSegment.myDiary.edit = permission.edit
                    }
                    break;
                    case "My Trainings - BrainCore Coach": {
                        newPermissionSegment.bcCoach.access = permission.access
                        newPermissionSegment.bcCoach.edit = permission.edit
                    }
                    break;
                    case "My Trainings - BrainCore Trainer": {
                        newPermissionSegment.bcTrainer.access = permission.access
                        newPermissionSegment.bcTrainer.edit = permission.edit
                    }
                    break;
                    case "My Space - My Results": {
                        newPermissionSegment.ms_myResults.access = permission.access
                        newPermissionSegment.ms_myResults.edit = permission.edit
                    }
                    break;
                    case "My Space - Virtual Coach": {
                        newPermissionSegment.ms_virtualCoach.access = permission.access
                        newPermissionSegment.ms_virtualCoach.edit = permission.edit
                    }
                    break;
                    case "My Space - My Resources": {
                        newPermissionSegment.ms_myResources.access = permission.access
                        newPermissionSegment.ms_myResources.edit = permission.edit
                    }
                    break;
                    default: 
                        // skip
                    break;
                }
            })
            // update user permissions
            setUserPermissions(p => ({ ...p, ...newPermissionSegment, id: data?.id }))
            // if user is selfRegistered
            if (data.selfRegistered) {
                //console.log("selfRegistered")
                setUserPermissions(p => ({ ...p, isSelfRegistered: true }))
            }
            // set user language
            if (data.language) {
                await i18n.changeLanguage(data.language)
            } else {
                await i18n.changeLanguage('en')
            }

        } else {
            // set all permissions to false
            //console.log("restart - userPermissions>>>",userPermissions)
            setUserPermissions(p => Object.keys(p).reduce((acc, key) => { acc[key] = false; return acc }, {}));
            setCurrentUser(undefined);
        }
    }

    

    // Custom translate function which is adding EDU prefix when using EDU version of the platform
    const F_t = (string) => {
        if (isEdu){
            if (string.includes(':')) return t(string.replace(":",":EDU_"))
            else return t("EDU_"+string)
        }
        else return t(string)
    }

    const F_getHelper = () => {
        return {
            user: currentUser,
            isEdu: isEdu,
            setIsEdu: setIsEdu,//Function only for development - easy switch between EDU and HR version 
            fullUser,
            userPermissions,
            manageScopeIds,
        }
    }
    const F_logout = async (reasonMessage) => {
        await AuthService.logout();
        await F_reloadUser().then(() => {
            // Remove all elements in shopping cart
            shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE_ALL })
            // Unset current route
            setMyCurrentRoute(undefined)
            // Redirect to login page
            if (isCognitiveCenter) navigate("/login/cognitive");
            else if (F_getHelper().manageScopeIds?.isTrainingCenter) navigate("/login/training");
            else navigate("/login/school");
        })
    }

    const F_refreshToken = async () => {
        // Load current user
        let currentUser = await AuthService.getCurrentUser();
        if (currentUser) { // User has logged-in in the past and token exists
            // We try to refresh this token
            // If token is still valid, refreshToken will extend the exparation date of this token
            // If token is outdated, refreshToken will return 401 and user/token will be removed
            try {
                await AuthService.refreshToken(null, currentUser.moduleId, null, currentUser.selectedPeriod);
            } catch (error) {
                // Resolve error promise from AuthService.refreshToken
                F_showToastMessage(`Session expired, please login again.`);
                navigate("/", { replace: true });
            }
            // Reload the current user after refresing token
            let currUser = await AuthService.getCurrentUser();
            await F_setCurrentUser(currUser);
            F_handleSetShowLoader(false)

        } else {
            await F_setCurrentUser(undefined);
            F_handleSetShowLoader(false)
        }
    }

    const F_hasPermissionTo = (permission = null) => {
        if (permission === null) return true;
        let user = F_getHelper().user;
        let role = user?.role || fullUser?.settings.role;
        if (!role) return true;
        let permissions = fullUser?.settings.permissions?.[role.toLowerCase() || "assistant"];
        let disallowedActions = permissions?.find(e => e.module === user.moduleId)?.disallowed || [];
        return !disallowedActions.includes(permission);
    }

    const F_refreshRole = async (role) => {
        let user = JSON.parse(localStorage.getItem("user")) ?? { modules: [] }
        if (user?.role !== role) {
            let access_token = qs.parse(window.location.search, { ignoreQueryPrefix: true }).token
            // This AuthService.refreshToken will set a new user in local storage 
            await AuthService.refreshToken(access_token, user.moduleId, role);
            F_gotoDefaultView(role);
            // Remove all elements in shopping cart
            shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE_ALL })
            F_reloadUser(); // true in the argument means that the sidebar should be reloaded 
        }
    }

    const F_selectRole = (selectedRole, fav = '') => {
        let user = JSON.parse(localStorage.getItem("user")) ?? { modules: [] }
        UserService.setRole(selectedRole, fav).then(res => {
            if (res.status === 200) {
                if (user?.role !== selectedRole) F_showToastMessage(`"${selectedRole}" is now your active role!`, "success");
                else F_showToastMessage(`"${selectedRole}" was your active role!`);
                F_refreshRole(selectedRole)
            }
        })
    }

    const F_gotoDefaultView = (role, isTrainingCenter = undefined) => {
        // If not provided use manageScopeIds.isTrainingCenter
        if (isTrainingCenter == undefined) isTrainingCenter = F_getHelper().manageScopeIds?.isTrainingCenter

        // This must be run with setTimeout !!!!!!!!!!!!!!!!!
        // Otherwise routing in App.js will use <Redirect to="/" />
        // It happens as  F_getHelper().user is still undefined when navigate is called
        // so it makes redirection to / before user is event loaded
        setTimeout(() => {
            switch (role) {
                case "Root": {
                    navigate("/ecosystems");
                    break;
                }
                case "Librarian": {
                    navigate("/module-library");
                    break;
                }
                case 'Trainer': {
                    navigate("/myspace");
                    break;
                }
                case 'EcoManager': {
                    navigate("/networks");
                    break;
                }
                case 'CloudManager': {
                    navigate("/module-cloud");
                    break;
                }
                case 'NetworkManager': {
                    navigate("/modules");
                    break;
                }
                case 'Inspector': {
                    navigate("/program-trainer-preview");
                    break;
                }
                case 'Other': {
                    let user = JSON.parse(localStorage.getItem("user"));
                        if(user.permissions.find(o => (o.moduleName == 'Home' ))?.access){
                            navigate("/sentinel/home");
                        }else if(user.permissions.find(o => (o.moduleName == 'Admin - Authorization' ))?.access){
                            navigate("/sentinel/admin/authorizations");
                        }else if(user.permissions.find(o => (o.moduleName == 'My Teams - Teams'))?.access){
                            navigate("/sentinel/myteams/teams");
                        }
                        else if(user.permissions.find(o => (o.moduleName == 'My Teams - Statistics'))?.access){
                            navigate("/sentinel/myteams/Statistics");
                        }
                        else if(user.permissions.find(o => (o.moduleName == 'My Teams - BC Test Registrations'))?.access){
                            navigate("/sentinel/myteams/BC-test-registrations/users");
                        }else if(user.permissions.find(o => (o.moduleName == 'My Users - BC Test Registrations'))?.access){
                            navigate("/sentinel/myusers/Braincoretestregistrations/users");
                        }else  if(userPermissions.mu_users.access){
                            navigate("/sentinel/myusers/users");

                        }else if(userPermissions.mu_bcTestReg.access){
                        navigate('/sentinel/myusers/Braincoretestregistrations/users');
                        }else if(user.permissions.find(o => (o.moduleName == 'My Teams - BC Results for Team - NAD/QNAD' || o.moduleName == 'My Teams - BC Results for Team - interpersonal dimensions' || o.moduleName == 'My Teams - BC Results for Team - emotional intelligence' || o.moduleName == 'My Teams - BC Results for Team - cost/time report'))?.access){
                            navigate('/sentinel/myteams/Results');
                            }
                        else{
                        navigate("/sentinel/home");
                    }

                    // navigate(isTrainingCenter ? "/myspace" : "/dashboard");
                    break;
                }
                case 'ModuleManager': {
                    navigate(JSON.parse(localStorage.getItem("user")).isInTrainingCenter ? "/myspace" : "/sentinel/home");
                    break;
                }
                case 'Assistant':
                case 'Partner':
                case 'Architect':
                case 'TrainingManager':
                case 'Trainee': {
                    let user = JSON.parse(localStorage.getItem("user"));
                    if(user.permissions.find(o => (o.moduleName == "My Space - My Results" ))?.access){
                        navigate("/myspace");
                    }else if(user.permissions.find(o => (o.moduleName == "My Space - Virtual Coach" ))?.access){
                        navigate("/virtualcoach");
                    }else if(user.permissions.find(o => (o.moduleName == "My Space - My Resources"))?.access){
                        navigate("/myresources");
                    }
                    else if(user.permissions.find(o => (o.moduleName == "My Trainings - BrainCore Coach"))?.access){
                        navigate("/coaches");
                    }
                    else{
                    navigate(isTrainingCenter ? "/myspace" : "/myspace");
                    }
                    break;
                }
                case 'Parent':
                case 'Coordinator':
                default: {
                    navigate(isTrainingCenter ? "/myspace" : "/myspace");
                    break;
                }
            }
        }, 50)
        return;
    }

    const F_reloadUser = async (reloadSidebar) => {
        const user = await AuthService.getCurrentUser();
        F_setCurrentUser(user).then(() => {
            if (reloadSidebar) {
                window.location.reload();
            }
            return true;
        })
    }

    const F_showToastMessageMui = (show, message, variant, hideTime) => {
        setToastState({
            show: show,
            message: message || "Empty",
            variant: variant || "info",
            hideTime: hideTime || 6000,
        })
    }

    const F_showToastMessage = (_message, _appearance) => {
        const data = {
            message: _message || "Empty...",
            appearance: _appearance || "info",
            autoDismiss: true,
        }
        addToast(data.message, {
            appearance: data.appearance,
            autoDismiss: data.autoDismiss,
        })
    }

    const F_removeAllToasts = (_message, _appearance) => {
        removeAllToasts();
    }

    const F_getErrorMessage = (error) => {
        let errorMessage = t("Error occured");
        if (error.response) {
            // Display message from monggose validator:
            if (error.response.data?.message?.message) errorMessage = error.response.data.message.message
            else if (error.response.data?.message) errorMessage = error.response.data.message
            else if (Number(error.response.status) === 404) errorMessage = t("Not found")
            else if (Number(error.response.status) === 401) errorMessage = t("Unauthorized")
            else if (Number(error.response.status) === 403) errorMessage = t("Forbidden")

            else if (Number(error.response.status) === 200) errorMessage = t("Fetch data - OK")
            else if (Number(error.response.status) === 201) errorMessage = t("Save data - OK")
        }
        return errorMessage
    };

    // Get time in local timezone using UTC time from database 
    const F_getLocalTime = (time, onlyDate = false) => {
        let localTime = new Date(time)
        const offset = localTime.getTimezoneOffset()
        localTime = new Date(localTime.getTime() - (offset * 60 * 1000))
        localTime = localTime.toISOString()
        let dateArray = localTime.split('T')[0].split('-')
        let timeArray = localTime.split('T')[1].split(":")
        if (onlyDate) return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0]
        else return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0] + " " + timeArray[0] + ":" + timeArray[1]
    }

    // Process time in second and return formated string
    // time - time in seconds
    // seconds  - when set to false it will not show seconds in the output
    function F_formatSeconds(time, seconds=true) {
        if (time == 0) return "0" + t('s')
        if (time < 1) return "1" + t('s')

        let d = Math.floor(time / (3600 * 24));
        let h = Math.floor(time % (3600 * 24) / 3600);
        let m = Math.floor(time % 3600 / 60);
        let s = Math.floor(time % 60);

        var dDisplay = d > 0 ? d + (d == 1 ? t("d") + " " : t("d") + " ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? t("h") + " " : t("h") + " ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? t("m") + " " : t("m") + " ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? t("s") + " " : t("s") + " ") : "";

        return dDisplay + hDisplay + mDisplay + (seconds ? sDisplay : '');;
    }

    const F_handleSetShowLoader = (value) => {
        setShowLoader(Boolean(value));
    }

    const F_handleSidebarChange = (type) => {
        if (type === 'COLLAPSE') {
            setSidebarState(p => ({ ...p, collapsed: !p.collapsed }))
        } else {
            setSidebarState(p => ({ ...p, toggled: !p.toggled }))
        }
    }

    const F_updateScreenSize = (value) => {
        setCurrentScreenSize(value);
    }

    const F_collapseSidebarMobile = (flag) => {
        if(flag!=undefined){
            setCollapseSidebarMobile(flag);
        }
    }

    const F_isCognitiveCenter = (value) => {
        setCognitiveCenter(value);
    }
    return (
        <MainContext.Provider value={{
            mainData,
            currentLocalization,
            deviceType,
            myCurrentRoute,
            setMyCurrentRoute,
            navigationTabs,
            setNavigationTabs,
            activeNavigationTab,
            setActiveNavigationTab,

            setCurrentLocation,
            asyncLocalStorage,

            F_setCurrentUser,
            F_t,
            F_getHelper,
            F_logout,
            F_reloadUser,
            F_gotoDefaultView,

            F_showToastMessage,
            F_removeAllToasts,
            F_showToastMessageMui,
            toastState,
            F_getErrorMessage,

            showLoader,
            F_handleSetShowLoader,

            F_refreshRole,
            F_selectRole,
            F_hasPermissionTo,

            F_refreshToken,

            sidebarState,
            F_handleSidebarChange,

            currentScreenSize,
            F_updateScreenSize,

            collapseSidebarMobile,
            F_collapseSidebarMobile,

            userNotifications,
            setUserNotifications,
            confirm,
            setConfirm,

            F_getLocalTime,
            F_formatSeconds,

            isCognitiveCenter,
            F_isCognitiveCenter
        }}>
            {children}
        </MainContext.Provider>
    )
}

export const useMainContext = () => useContext(MainContext);