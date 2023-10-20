
//mocked db: all users:

    const usrAll = [
        {
            _id: "78h93edf",
            username: "One",
            description: "description one"
        },
        {
            _id: "89sug8sgu",
            username: "Two",
            description: "description one"
        },
        {
            _id: "978refhvdf",
            username: "Three",
            description: "description one"
        },
        {
            _id: "78ervhc807",
            username: "Four",
            description: "description one"
        },
    ]

    const sub1users = [
        {
            _id: "78h93edf",
            username: "One",
            description: "description one"
        },
        {
            _id: "89sug8sgu",
            username: "Two",
            description: "description one"
        },
        {
            _id: "978refhvdf",
            username: "Three",
            description: "description one"
        },
    ]

    const sub2users = [
        {
            _id: "89sug8sgu",
            username: "Two",
            description: "description one"
        },
    ]


// Two request (can be one with if, like subscription-service
 async function  usersAssignToSubscription(subscriptionId){
    // backend should, each all, users check scopes, and return arr, of assigned to subscriptionId param
    if(subscriptionId == 1){
        return {data: sub1users};
    }else if(subscriptionId == 2){
        return {data: sub2users};
    }else {
        return [];
    }
}

 async function getUsers(){
    // return arr of all users
    return {data: usrAll};
}






const functions = {
    getUsers,
    usersAssignToSubscription,
}

export default functions;