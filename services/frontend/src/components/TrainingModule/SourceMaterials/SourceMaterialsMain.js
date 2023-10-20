import React, {useEffect, useRef, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import SourceMaterials from "./SourceMaterials";
import AuthorsList from "./Authors/AuthorsList";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETab, ETabBar} from "styled_components";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {boardingActions} from "app/features/OnBoarding/data";
import {now} from "moment/moment";
import Boarding from "styled_components/Boarding/Boarding";
import Visibility from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";


export default function SourceMaterialsMain(){
    const { t } = useTranslation();
    const {setMyCurrentRoute, myCurrentRoute, activeNavigationTab, setActiveNavigationTab, setNavigationTabs} = useMainContext();
    const [currentTab, setCurrentTab]= useState(0);

    useEffect(()=>{
        setMyCurrentRoute("Books");
    },[]);


    const tooltip1 = useRef(null);
    const tooltip2 = useRef(null);
    const tooltip3 = useRef(null);
    const tooltip4 = useRef(null);
    const tooltip5 = useRef(null);
    const tooltip6 = useRef(null);
    const tooltip7 = useRef(null);
    const tooltip8 = useRef(null);
    const tooltip9 = useRef(null);
    const tooltip10 = useRef(null);
    const tooltip11 = useRef(null);
    const tooltip12 = useRef(null);
    const tooltip13 = useRef(null);

    const [isOpenBoarding,setIsOpenBoarding] = useState(false);
    const {data: onBoardings=[], item} = useSelector(s=>s.boarding);
    const dispatch = useDispatch();


    useEffect(()=>{
        if(onBoardings.length>0 && onBoardings.some(i=> i.name === myCurrentRoute)){
            const item = onBoardings.find(i=> i.name === myCurrentRoute);
            dispatch(boardingActions.setCurrentItem(item));
        }
        return ()=>{
            dispatch(boardingActions.setCurrentItem({}));
        }
    },[onBoardings, myCurrentRoute]);

    useEffect(()=>{
        if(item && !item.isCompleted){
            if(item.postponedTo === null || item.postponedTo <= now()){
                setIsOpenBoarding(true);
            }
        }

    },[item]);


    useEffect(() => {
        setMyCurrentRoute("Books")
        setNavigationTabs([
            {name: "Books", cptRef: tooltip6 },
            {name: "Authors", cptRef: tooltip1 }
        ])
        return function cleanup() {
            setNavigationTabs([]);
            setActiveNavigationTab(0);
        };
    }, []);


    const story = [
        {
            component: 'modal',
            title: 'Hi there 👋',
            intro: true,
            children: (
                <>
                    {myCurrentRoute && (
                        <Typography variant="h6"
                                    component="h6" className="text-center"
                                    style={{color: `rgba(168, 92, 255, 1)`}}>
                            {`${myCurrentRoute?.toUpperCase()} - TOUR`}
                        </Typography>
                    )}
                    <Typography variant="body1"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        Welcome to BrainCore Academy on-boarding. This process help You understand how to using the application.
                        Would you like to have a tour to see how it works? (If you skip, you can always click the "help" button to get started again)
                    </Typography>
                </>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip1,
            disableNext: true,
            evt: {
                    type: 'BTN',
                    title: 'Authors',
                },
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    let's switch to the list of authors
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip2,
            evt: {
                type: 'BTN',
                title: 'Add author',
            },
            disableNext: true,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    let's create new author
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip3,
            evt: {
                type: 'BTN',
                title: 'Fill form with sample data',
            },
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Fill form with sample data
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip4,
            evt: {
                type: 'BTN',
                title: 'Save changes',
            },
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Fill form with sample data
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip5,
            children: (
                <div style={{display:'flex', flexDirection:'column'}}>
                    <Typography variant="body2"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        Edit form
                    </Typography>
                    <Typography variant="body2"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        <BsPencil className='mr-2'/>Edit
                    </Typography>
                </div>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip6,
            disableNext: true,
            evt: {
                type: 'BTN',
                title: 'Books',
            },
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    let's switch to the list of books
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip7,
            evt: {
                type: 'BTN',
                title: 'Add book',
            },
            disableNext: true,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    let's create new author
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip8,
            evt: {
                type: 'BTN',
                title: 'Fill form with sample data',
            },
            disableNext: true,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Fill form with sample data
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip9,
            evt: {
                type: 'BTN',
                title: 'Manage authors',
            },
            disableNext: true,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Assign author
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip10,
            evt: {
                type: 'BTN',
                title: 'Select author',
            },
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Select author
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip11,
            evt: {
                type: 'BTN',
                title: 'Manage publisher',
            },
            disableNext: true,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Assign publisher
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip10,
            evt: {
                type: 'BTN',
                title: 'Select publisher',
            },
            disableNext: true,
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Select publisher
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip12,
            evt: {
                type: 'BTN',
                title: 'Save changes',
            },
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Save changes
                </Typography>
            )
        },
        {
            component: 'tooltip2',
            ref: tooltip13,
            children: (
                <div style={{display:'flex', flexDirection:'column'}}>
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    If You want Edit or Preview data click
                </Typography>
                    <Typography variant="body2"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        <Visibility className='mr-2'/>Preview
                    </Typography>
                    <Typography variant="body2"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        <BsPencil className='mr-2'/>Edit
                    </Typography>
                </div>
            )
        },
        {
            component: 'speech-bubble',
            title: 'Tip for You 🚀',
            children: (
                <Typography variant="body2"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    Understanding the process of using the app will help you grow!
                </Typography>
            ),
            className: 'test_class',
        },
        {
            component: 'modal',
            end: true,
            children: (
                <Typography variant="body1"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    I hope everything is clear. You can now go back to the previous steps or finish the tour.
                    Remember, by clicking the 'help' button you can always go through the process again.
                </Typography>
            )
        }
    ];

    return(
        <Grid container>
            <Grid item xs={12}>
                {activeNavigationTab ===0 && (<SourceMaterials tooltip7={tooltip7} tooltip8={tooltip8} tooltip9={tooltip9} tooltip10={tooltip10} tooltip11={tooltip11} tooltip12={tooltip12} tooltip13={tooltip13}/>)}
                {activeNavigationTab ===1 && (<AuthorsList tooltip2={tooltip2} tooltip3={tooltip3} tooltip4={tooltip4} tooltip5={tooltip5} />)}
            </Grid>
            <Boarding story={story}
                      isOpenBoarding={isOpenBoarding}
                      setIsOpenBoarding={setIsOpenBoarding}
            />
        </Grid>
    )
}