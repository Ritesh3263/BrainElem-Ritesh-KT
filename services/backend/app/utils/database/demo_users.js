

var demo_user_ids = [
    '111179999999900000000001',
    '111179999999900000000002',
    '111179999999900000000003',
    '111179999999900000000004',
    '111179999999900000000005'
]

var demo_user_schema = {
    _id: '??????????????????????????',
    settings: {
        isActive: true,
        emailConfirmed: true,
        selfRegistered: false,
        origin: 'en_GB',
        language: 'en',
        role: "Trainee",
        availableRoles: [
            'Trainee'
        ],
        defaultRole: 'Trainee',
    },
    name: 'Demo',
    surname: '???????????????????????????????????',
    username: '??????????????????????????????????',
    password: '$2a$08$S7rhOE9pyhquEq80/CbGe.I1bz0Sa6FYLrJmhAQBgNHP6LjdmskMS',
    scopes: [
        {
            _id: '613a352b7124ba003c4bc02c',
            name: 'users:all:???????????????????????????'
        },
        {
            _id: '613a352b7124ba003c4bc02d',
            name: 'content:create:all'
        },
        {
            _id: '613a352b7124ba003c4bc02e',
            name: 'modules:read:200004000080000000000000'
        }
    ],
   
    __v: 0
}


var demo_users = [];
for (let [index, _id] of demo_user_ids.entries()){
    let demo_user = JSON.parse(JSON.stringify(demo_user_schema));
    demo_user = {
        ...demo_user,
        _id: _id, 
        username: 'demo_trainee_'+(index+1),
        surname: "User"
    }
    demo_user.scopes[0].name='users:all:'+_id
    demo_users.push(demo_user)
}
module.exports = { demo_users }