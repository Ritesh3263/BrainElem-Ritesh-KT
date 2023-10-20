import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";

//Context
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

//Components
import { EButton } from "styled_components";
import Confirm from "components/common/Hooks/Confirm";
import CreateAccountModal from "components/Login/CreateAccountModal/CreateAccountModal";

// MUI v4
import { theme } from "../../MuiTheme";
const palette = theme.palette;


export default function StyledTakeCourseButton({ course, takeCourse, isLoggedIn, allUserSessions, ...props }) {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const navigate = useNavigate();
    const {F_getHelper, F_selectRole} = useMainContext();
    const { userPermissions } = F_getHelper();
    const [createAccountModal, setCreateAccountModal] = useState({ isOpen: false });

    const {
        isInCart,
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
    } = useShoppingCartContext();

    // Check if user is already enrolled on the session
    const isEnrolled = () => {
        return allUserSessions?.find(session => (session._id === course?._id || session.origin === course?._id))
    }

    return (<>
        {(isLoggedIn) ? (
            <>
            {/* MODULE MANGER shall be just module manager , so disallowing modulemanger on taking courses 
            as otherwise he is becoming trainee and it becomes problematic with managing few modules */}
            {!(userPermissions.isModuleManager||userPermissions.isAssistant) && (
            course?.paymentRequired ?
                (
                    <EButton eVariant='primary'
                        {...props}
                        disabled={(!isEnrolled() && (isInCart(course?._id) || (!isEnrolled() && course?.traineesCount >= course?.traineesLimit)))}
                        onClick={async () => {
                            if (!userPermissions.isTrainee && await isConfirmed(t("Currently only Trainees can take the courses. Do you want to switch role in order to take the course?"))) F_selectRole("Trainee")
                            else{
                                shoppingCartDispatch({ type: shoppingCartReducerActionsType.ADD, payload: {...course, productType: 'session'} })
                                if (isEnrolled()) navigate("/shopping-cart");
                            }
                        }}>
                        {isEnrolled() ? t("Finish payment") : t("Add to cart")}
                    </EButton>
                ) :
                (<EButton eVariant='primary'
                    {...props}
                    disabled={(!isEnrolled() && (course?.traineesCount >= course?.traineesLimit))}
                    
                    onClick={async () => { 
                        if (!userPermissions.isTrainee && await isConfirmed(t("Currently only Trainees can take the courses. Do you want to switch role in order to take the course?"))) F_selectRole("Trainee")
                        else takeCourse(course?._id, isEnrolled())
                    }}>
                    {isEnrolled() ? t("Go to course") : t("Take course")}
                </EButton>
                )
                )}
            </>
        ) : (<>
            <EButton variant="contained" size="small" color="primary"
                {...props}
                onClick={() => { setCreateAccountModal({ isOpen: true }) }}
            >
                {course?.paymentEnabled ? t("Take course") : t("Add to cart")}
            </EButton>
            <CreateAccountModal createAccountModal={createAccountModal} setCreateAccountModal={setCreateAccountModal} />
            </>
        )}
    </>)
}