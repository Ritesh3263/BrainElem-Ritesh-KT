exports.ecosystems = [{
    _id: "100000000000000000000000",
    name: "Ecosystem 1",
    description: "Description of Ecosystem 1",
    isActive: true,
    subscriptions: [
        {
            _id: "110000000000000000000000", name: "BrainElem Network - Dev",
            modules: [
                {// Just for development - can be removed on production 
                    _id: "111000000000000000000000",
                    name: "Module init",
                    moduleType: 'SCHOOL',
                    core: "111111111000000000000000",
                    expires: '2022-07-05T09:37:59.208Z',
                    isActive: true,
                    language: "fr",
                    usersLimit: 8000
                },
                {   // This module should also exists in production database
                    // This is the default module for all users
                    _id: '200004000080000000000000',
                    isActive: true,
                    name: 'Universal BrainElem Training Center - Dev',
                    moduleType: 'TRAINING',
                    description: '',
                    expires: '2022-07-26T13:17:51.824Z',
                    usersLimit: 9999999,//This is max value
                    core: '61279491249a68002b2f12c0',
                    createdAt: '2022-07-26T13:18:10.165Z',
                    updatedAt: '2022-07-26T13:18:10.165Z'
                },
                // Cognitive Center Module
                {// Just for development - can be removed on production 
                    _id: '333000000000000000000000', // module id
                    isActive: true,
                    name: 'Cognitive(+Training)',
                    core: '63b260e0bb50e6fc2867cdfc',
                    moduleType: 'COGNITIVE',
                    associatedModule: "444000000000000000000000",
                    description: '',
                    expires: '',
                    usersLimit: 2023,
                    langauge: '',
                    archived: false,
                    createdAt: '2023-01-02T04:50:00.000Z',
                    updatedAt: '2023-01-02T04:50:00.000Z'
                },
                {// Associated Training Center
                    _id: '444000000000000000000000',
                    isActive: true,
                    name: "Cognitive(+Training)",
                    core: '643e46618a3fada6de0edfb0',
                    moduleType: 'TRAINING',
                    associatedModule: "333000000000000000000000",
                    description: '',
                    expires: '',
                    usersLimit: 2023,
                    langauge: '',
                    archived: false,
                    createdAt: '2023-01-02T04:50:00.000Z',
                    updatedAt: '2023-01-02T04:50:00.000Z'
                }
            ]
        },
    ]
}]