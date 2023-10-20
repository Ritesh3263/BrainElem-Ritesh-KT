exports.architects = [{
    _id: "999999999999999999999995", username: 'architect', email: 'architect', name: 'Name of', surname: 'Architect',
    password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
    settings: {
        userNotifications: [
            { _id: '6127a98cfb1e2e0044053bfb', isRead: false, notification: '888811111111112345671111' },
            { _id: '6127a98cfb1e2e8314053bfb', isRead: true, notification: '888811111166612345611111' }
        ],
        language: 'en', isActive: true, role: "Architect", availableRoles: ['Architect', 'Librarian', 'Trainer', 'Trainee', 'Parent', 'Inspector'], defaultRole: 'Architect'
    },
    details: { displayName: "Albert", phone: "+48 123 456 789", street: "Zapolska", buildNr: "20/7", postcode: "32-100", city: "Moscow", country: "Russia", dateOfBirth: "2022-07-31T12:13:46.847Z" },
    scopes: [{ name: "users:all:999999999999999999999995" }, { name: "modules:read:111000000000000000000000" }, { name: 'content:create:all' }]
},
{
    _id: '6127a98cfb1e2e0044053bfb',
    settings: {
        isActive: true,
        emailConfirmed: false,
        selfRegistered: false,
        origin: 'fr_FR',
        language: 'en',
        role: 'Architect',
        availableRoles: ['Architect', 'Librarian', 'Trainer', 'Trainee', 'Parent', 'Inspector', 'TrainingManager'],
        defaultRole: 'Architect',
        _id: '6127a98cfb1e2e0044053bff',
        createdAt: '2022-07-26T14:47:40.168Z',
        updatedAt: '2022-07-26T14:47:40.168Z'
    },
    details: {
        notifications: {
            classes: true,
            newCourses: true,
            systemNotifications: true,
            newsletter: true,
            tricks: true
        },
        subinterests: [],
        children: [],
        profileCompletedIn: 5,
        _id: '6127a98cfb1e2e0044053c00',
        fullName: '',
        displayName: '',
        phone: '',
        street: '',
        buildNr: '',
        postcode: '',
        city: '',
        country: '',
        dateOfBirth: '',
        createdAt: '2022-07-26T14:47:40.168Z',
        updatedAt: '2022-07-26T14:47:40.168Z'
    },
    name: 'Training',
    surname: 'Architect',
    username: 'tarchitect',
    password: '$2a$08$ve983vnYy8JP5h2Jtn4CqOhn8SFpzr5IkShdm0hemZHONpzKhxES2',
    scopes: [
        {
            _id: '6127a98cfb1e2e0044053c01',
            name: 'users:all:6127a98cfb1e2e0044053bfb',
            createdAt: '2022-07-26T14:47:40.168Z',
            updatedAt: '2022-07-26T14:47:40.168Z'
        },
        {
            _id: '6127a98cfb1e2e0044053c02',
            name: 'content:create:all',
            createdAt: '2022-07-26T14:47:40.168Z',
            updatedAt: '2022-07-26T14:47:40.168Z'
        },
        {
            _id: '6127a98cfb1e2e0044053c03',
            name: 'modules:read:200004000080000000000000',
            createdAt: '2022-07-26T14:47:40.168Z',
            updatedAt: '2022-07-26T14:47:40.168Z'
        }
    ],
    certificates: [],
    contentRecommendations: [],
    chapterRecommendations: [],
    trainingModuleRecommendations: [],
    tips: [],
    createdAt: '2022-07-26T14:47:40.169Z',
    updatedAt: '2022-07-26T14:59:34.538Z',
    lastRecommendationsUpdate: '2022-07-26T14:59:34.527Z'
}
]