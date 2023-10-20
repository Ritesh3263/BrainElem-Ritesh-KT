import React, {useEffect, useState} from 'react';

import Modal from "./types/Modal";
import Tooltip from "./types/Tooltip";
import Tooltip2 from "./types/Tooltip2";
import SpeechBubble from "./types/SpeechBubble";
import {useDispatch, useSelector} from "react-redux";
import {boardingActions as boardingActionsStore} from "app/features/OnBoarding/data"
import {now} from "moment";

const Boarding=(props)=> {
    const{
        story=[],
        isOpenBoarding=false,
        setIsOpenBoarding=()=>{},
    }=props;
    const [currentStep, setCurrentStep] = useState(0);
    const {item} = useSelector(s=>s.boarding);
    const dispatch = useDispatch();

    const actionsHandler=(type)=>{
        if(item){
            if(type === 'END'){
                dispatch(boardingActionsStore.boardingHelper({type,item:{...item,isCompleted: true}}));
            }
            if(type === 'POSTPONE'){
                // => 10min
                dispatch(boardingActionsStore.boardingHelper({type,item:{...item,postponedTo: now()+1800000}}));
                // => 1 min
                //dispatch(boardingActionsStore.boardingHelper({type,item:{...item,postponedTo: now()+60000}}));
            }
        }
    }


    const boardingActions=({type,payload})=>{
        switch (type) {
            case "NEXT": {
                if(currentStep < story.length){
                    setCurrentStep(p=> ++p);
                }
                break;
            }
            case "PREV": {
                if(currentStep > 0){
                    setCurrentStep(p=> --p);
                }
                break;
            }
            case "END":{
                setIsOpenBoarding(false);
                setCurrentStep(0);
                actionsHandler('END');
                break;
            }
            case "POSTPONE":{
                setIsOpenBoarding(false);
                setCurrentStep(0);
                actionsHandler('POSTPONE');
                break;
            }
            case "CLOSE":{
                setIsOpenBoarding(false);
                setCurrentStep(0);
                actionsHandler('END');
                break;
            }
            default:{
                setIsOpenBoarding(false);
                //setCurrentStep(0);
                break;
            }
        }
    }

    const currentBoarding =()=>{
        if(story.length >0 && story.length > currentStep){
            switch (story[currentStep]?.component){
                case 'modal':{
                    return (
                        <Modal
                            isOpenBoarding={isOpenBoarding}
                            item={story[currentStep]}
                            boardingActions={boardingActions}
                        />
                    )
                }
                case 'tooltip':{
                    return (
                        <Tooltip
                            isOpenBoarding={isOpenBoarding}
                            item={story[currentStep]}
                            boardingActions={boardingActions}
                        />
                    )
                }
                case 'tooltip2':{
                    return (
                        <Tooltip2
                            isOpenBoarding={isOpenBoarding}
                            item={story[currentStep]}
                            boardingActions={boardingActions}
                        />
                    )
                }
                case 'speech-bubble':{
                    return (
                        <SpeechBubble
                            isOpenBoarding={isOpenBoarding}
                            item={story[currentStep]}
                            ref={story?.ref}
                            boardingActions={boardingActions}
                        />
                    )
                }
                default: return null;
            }
        }
    }

     return (
         <>
         {currentBoarding()}
         </>
     )
 }

export default Boarding;