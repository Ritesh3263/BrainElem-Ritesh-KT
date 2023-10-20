exports.librarians = [
    { _id: "999999999999999999999986", username: 'librarian', email: 'librarian', name:'Name of', surname:'Librarian',
                          settings:{
                          language: 'en',isActive: true, role: "Librarian", availableRoles: ['Librarian'],defaultRole: 'Librarian'},
                          password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei', 
                          scopes: [{name: "users:all:999999999999999999999986"}, {name: "modules:read:111000000000000000000000"},  {name: 'content:create:all'}]
    },
    { _id: "999999999996999999999986", username: 'tlibrarian', email: ' training librarian', name:'Name of', surname:'Librarian',
                          settings:{
                          language: 'en',isActive: true, role: "Librarian", availableRoles: ['Librarian'],defaultRole: 'Librarian'},
                          password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei', 
                          scopes: [{name: "users:all:999999999996999999999986"}, {name: "modules:read:200004000080000000000000"},  {name: 'content:create:all'}]
    }
]