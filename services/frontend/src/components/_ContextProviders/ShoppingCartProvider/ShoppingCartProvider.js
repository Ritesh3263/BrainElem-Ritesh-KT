import React, { useContext, createContext, useReducer, useEffect, useState } from "react";
import CoursePathService from "services/course_path.service";
import i18next from "i18next";

const ShoppingCartContext = createContext(undefined);

const shoppingCartReducerActionsType = {
    'ADD': 'ADD',
    'REMOVE': 'REMOVE',
};

const clientReducerActionsType = {
    'UPDATE': 'UPDATE'
};

const invoiceReducerActionsType = {
    'UPDATE': 'UPDATE'
};

const shoppingCartObjectName = 'shopping_cart';
const initialShoppingCartState = JSON.parse(localStorage.getItem(shoppingCartObjectName)) || [];

const clientObjectName = 'client';
const initialClientState = JSON.parse(localStorage.getItem(clientObjectName)) || {
    email: '',
    firstName: '',
    lastName: '',
    addressStreet: '',
    addressCity: '',
    addressPostcode: '',
    acceptTerms: false,
    acceptPolicy: false

};

const invoiceObjectName = 'invoice';
const initialInvoiceState = JSON.parse(localStorage.getItem(invoiceObjectName)) || {
    requested: false,
    email: '',
    companyId: '',
    companyName: '',
};

const ShoppingCartReducer = (state, action) => {
    switch (action.type) {
        case shoppingCartReducerActionsType.ADD: {
            // Add only if not already in shopping cart
            if (state.filter(e => e._id === action.payload._id).length === 0) {
                return [...state, {
                    _id: action.payload._id,
                    name: action.payload.name,
                    price: action.payload.price,
                    productType: action.payload.productType,
                    category: action.payload?.category?.name,
                    imageUrl: action.payload.productType=='session' ? CoursePathService.getImageUrl(action.payload?.coursePath?.image) : action.payload?.image
                }];
            }
            return state;

        }
        case shoppingCartReducerActionsType.REMOVE: {
            // Remove from shopping cart if exists
            return state.filter(e => e._id !== action.payload._id)
        }

        case shoppingCartReducerActionsType.REMOVE_ALL: {
            // Remove all elements from shopping cart
            return [];
        }

        default:
            return state;
    }
};


const ClientReducer = (state, action) => {
    switch (action.type) {
        case clientReducerActionsType.UPDATE: {
            //if (action.payload.key in state){
            let updated = { ...state }
            updated[action.payload.key] = action.payload.value
            return updated;
            //}
            return state;
        }
        default:
            return state;
    }
};

const InvoiceReducer = (state, action) => {
    switch (action.type) {
        case invoiceReducerActionsType.UPDATE: {
            let updated = { ...state }
            updated[action.payload.key] = action.payload.value
            return updated;
        }
        default:
            return state;
    }
};

export function ShoppingCartProvider({ children }) {
    const [currentShoppingCart, shoppingCartDispatch] = useReducer(ShoppingCartReducer, initialShoppingCartState);
    const [currentClient, clientDispatch] = useReducer(ClientReducer, initialClientState);
    const [currentInvoice, invoiceDispatch] = useReducer(InvoiceReducer, initialInvoiceState);
    const [stageIndex, setStageIndex] = useState(0);

    useEffect(() => { // Update localstorage when shopping-cart state is changed
        localStorage.setItem(shoppingCartObjectName, JSON.stringify(currentShoppingCart))
        // Return to starting page if there are no elements
        if (!currentShoppingCart.length && stageIndex>0 && stageIndex<3  ) setStageIndex(0)
    }, [currentShoppingCart]);

    useEffect(() => { // Update localstorage when client state is changed
        localStorage.setItem(clientObjectName, JSON.stringify(currentClient))
    }, [currentClient]);

    useEffect(() => { // Update localstorage when invoice state is changed
        localStorage.setItem(invoiceObjectName, JSON.stringify(currentInvoice))
    }, [currentInvoice]);

    // Check if shopping cart is empty
    const isEmpty = () => {
        return currentShoppingCart?.length == 0
    }

    // Check if element is already in shopping cart
    const isInCart = (id) => {
        return currentShoppingCart.filter(e => e._id === id).length > 0
    }

    // Get currency
    const getCurrency = () => {
        let code = getCurrencyCode()
        let currencies = {'USD': '$', 'EUR': '€', 'CHF': 'CHF', 'PLN': 'zł'}
        return currencies[code]
    }

    // Get currency code (ISO 4217)
    const getCurrencyCode = () => {
        if (i18next.language.toLowerCase()=='fr') return 'CHF';
        if (i18next.language.toLowerCase()=='pl') return 'PLN';
        else return 'EUR';
    }


    // Get total price of all elements in shopping cart
    const getTotalPrice = () => {
        return currentShoppingCart.reduce((sum, a) => sum + a.price, 0);
    }

    return (
        <ShoppingCartContext.Provider
            value={{
                initialShoppingCartState,
                shoppingCartReducerActionsType,
                currentShoppingCart,
                shoppingCartDispatch,
                currentClient,
                clientDispatch,
                currentInvoice,
                invoiceDispatch,
                // Stage of shopping cart
                stageIndex,
                setStageIndex,
                // Other functions
                isEmpty,
                isInCart,
                getTotalPrice,
                getCurrency,
                getCurrencyCode
            }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}
export const useShoppingCartContext = () => useContext(ShoppingCartContext);