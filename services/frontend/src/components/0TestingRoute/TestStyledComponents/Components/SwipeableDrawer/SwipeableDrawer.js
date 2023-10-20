import React, {useEffect, useState} from "react";
import {EButton, ESwipeableDrawer} from "styled_components";
import {useTranslation} from "react-i18next";

const ex_Data =[
    {
        id: 1,
        name: 'Name 1',
        surname: 'Surname 1'
    },
    {
        id: 2,
        name: 'Name 2',
        surname: 'Surname 2'
    },
    {
        id: 3,
        name: 'Name 3',
        surname: 'Surname 3'
    }
]

export default function SwipeableDrawer(){
    const { t } = useTranslation();

    /** swipeableDrawerHelper - example **/
    const [swipeableDrawerHelper,setSwipeableDrawerHelper] = useState({isOpen: false});
    /** data - example **/
    const [data,setData] = useState(ex_Data);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(()=>{
        if(swipeableDrawerHelper.isOpen){
            setData(ex_Data);
            setFilteredData(ex_Data);
        }
    },[swipeableDrawerHelper.isOpen]);

    const itemsList = filteredData.length>0 ? filteredData.map(({id,name, surname})=>
        <li key={id}>{`${name} _ ${surname}`}</li>) : <p>No data</p>;

    return(
        <>
            <EButton eVariant="primary"
                     eSize='small'
                     onClick={()=>setSwipeableDrawerHelper(p=>({...p, isOpen: true}))}
            >Open drawer</EButton>

            <ESwipeableDrawer
                swipeableDrawerHelper={swipeableDrawerHelper}
                setSwipeableDrawerHelper={setSwipeableDrawerHelper}
                header={t("Test header name")}
                originalData={data}
                setFilteredData={setFilteredData}
            >
                <ul>
                    {itemsList}
                </ul>
            </ESwipeableDrawer>
        </>
    )
}