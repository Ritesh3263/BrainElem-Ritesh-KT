import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

// Services
import ResultService from "services/result.service";

//Context
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

// Components
import PricingBlock from "./PricingBlock";

import reportImage from "../../../img/cognitive_space/payment-report.jpg";

export default function Pricing() {
    const { t } = useTranslation(['translation', 'payment']);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    const [resultPrice, setResultPrice] = useState()

    const resultId = searchParams.get("resultId")


    useEffect(() => {
        ResultService.getPrice(resultId, getCurrencyCode()).then(res => {
            setResultPrice(res.data.price)
        })
    }, [resultId])

    const {
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
        getCurrencyCode,
        getCurrency
    } = useShoppingCartContext();

    return (<>
        {resultPrice && <PricingBlock
            title={searchParams.get("productName")}
            image={reportImage}
            descriptions={[
                t("payment:REPORT_DESCRIPTION_1"),
                t("payment:REPORT_DESCRIPTION_2"),
                t("payment:REPORT_DESCRIPTION_3")
            ]}
            price={`${resultPrice} ${getCurrency()}`}
            onButtonClick={() => {

                shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE_ALL })
                shoppingCartDispatch({
                    type: shoppingCartReducerActionsType.ADD,
                    payload: {
                        '_id': searchParams.get("resultId"),
                        'productType': 'result',
                        'name': searchParams.get("productName"),
                        'price': resultPrice,
                        'image': reportImage
                    }
                })
                navigate(`/cognitive-confirmation?productName=${searchParams.get("productName")}`)

            }}
        ></PricingBlock>}
    </>
    )
}