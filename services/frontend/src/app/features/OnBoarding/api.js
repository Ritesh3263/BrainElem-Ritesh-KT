import {eliaAPI} from "services/axiosSettings/axiosSettings";

const API_ROUTE = 'on-boardings';

const getOnBoardings= async (userId)=>{

    return await new Promise((resolve, reject)=>{
        setTimeout(()=>{
        const boardings = window.localStorage.getItem('_boardings')
            if(boardings){
                resolve(JSON.parse(boardings))
            }else{
                window.localStorage.setItem('_boardings', JSON.stringify({
                    status: 200,
                    data: [
           
                        {
                            _id:'d708ftw8rf7te',
                            name: "Other 1",
                            route: 'other-1',
                            isCompleted: false,
                            postponedTo: null,
                        },
                        {
                            _id:'780h7ty7y7',
                            name: "Other 2",
                            route: 'other-2',
                            isCompleted: false,
                            postponedTo: null,
                        },
                        {
                            _id:'989py898998',
                            name: "Other 3",
                            route: 'other-3',
                            isCompleted: false,
                            postponedTo: null,
                        }
                    ]
                }));
                resolve({
                    status: 200,
                    data: [
                   
                        {
                            _id:'d708ftw8rf7te',
                            name: "Other 1",
                            route: 'other-1',
                            isCompleted: false,
                            postponedTo: null,
                        },
                        {
                            _id:'780h7ty7y7',
                            name: "Other 2",
                            route: 'other-2',
                            isCompleted: false,
                            postponedTo: null,
                        },
                        {
                            _id:'989py898998',
                            name: "Other 3",
                            route: 'other-3',
                            isCompleted: false,
                            postponedTo: null,
                        }
                    ]
                })
            }

        },300);
    });
};

const updateOnBoardings= async(data)=>{
    return await new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                status: 200,
                data: []
            })
        },300);
    })
}

const boardingService ={
    getOnBoardings,
    updateOnBoardings,
}

export default boardingService;