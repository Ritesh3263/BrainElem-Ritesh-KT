

var block1= {
    _id: '647cbdcf56514c12aaafce01',
    content: '646b67144025fc00083d1311',
    deadline: '2024-05-25T11:43:51.531Z',
    status: {"999979999999900000000001": "todo"}
}
var block2 = {
    _id: '647cbdcf56514c12aaafce02',
    content: '646b67144025fc00083d1312',
    deadline: '2024-05-25T11:43:51.531Z',
    status: {"999979999999900000000001": "in_progress"}
}
var block3 =  {
    _id: '647cbdcf56514c12aaafce03',
    content: '646b67144025fc00083d1313',
    deadline: '2024-05-25T11:43:51.531Z',
    status: {"999979999999900000000001": "done"}
}
var block4 = {
    _id: '647cbdcf56514c12aaafce04',
    content: '646b67144025fc00083d1314',
    deadline: '2024-05-25T11:43:51.531Z',
    status: {"999979999999900000000001": "done"}
}


var blockCollection1 = {
    _id: '647cbdcf56514c12aaafce11',
    users: ["999979999999900000000001"],
    opportunity: "1_1_2_1",
    deadline: '2024-05-25T11:43:51.531Z',
    feedback: {},
    cognitiveBlocks: [block1,block2,block3,block4]
}


var blockCollection2 = {
    _id: '647cbdcf56514c12aaafce12',
    users: ["999979999999900000000001"],
    opportunity: "2_2_1_1",
    deadline: '2024-05-25T11:43:51.531Z',
    feedback: {},
    cognitiveBlocks: [block2, block4]
}


var blockCollection3 = {
    _id: '647cbdcf56514c12aaafce12',
    users: ["999979999999900000000001"],
    opportunity: "3_2_1_1",
    deadline: '2024-05-25T11:43:51.531Z',
    feedback: {},
    cognitiveBlocks: [block1, block3]
}


var blockCollection4 = {
    _id: '647cbdcf56514c12aaafce12',
    users: ["999979999999900000000001"],
    opportunity: "4_1_1_1",
    deadline: '2024-05-25T11:43:51.531Z',
    feedback: {},
    cognitiveBlocks: [block1, block2]
}

var blockCollection5 = {
    _id: '647cbdcf56514c12aaafce12',
    users: ["999979999999900000000001"],
    opportunity: "5_1_1_1",
    deadline: '2024-05-25T11:43:51.531Z',
    feedback: {},
    cognitiveBlocks: [block1, block2,block3]
}

exports.projects = [
    {
        _id: '116b67144025fc00083d1311',
        name: "My first project",
        module: "333000000000000000000000", 
        creator: "63b27cc52d8fb5f910d142b5",
        deadline: '2024-05-25T11:43:51.531Z',
        cognitiveBlockCollection: [blockCollection1, blockCollection2, blockCollection3, blockCollection4, blockCollection5],
    },
    {
        _id: '116b67144025fc00083d1322',
        name: "My second project",
        module: "333000000000000000000000", 
        creator: "63b27cc52d8fb5f910d142b5",
        deadline: '2024-05-25T11:43:51.531Z',
        cognitiveBlockCollection: [blockCollection1, blockCollection4],
    }
]