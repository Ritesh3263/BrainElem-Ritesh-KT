exports.coordinators = [{
    _id: "999999999999999999999a00",
    username: 'coordinator1',
    name: 'Name of',
    surname: 'coordinator1',
    email: 'coordinator1.office@at',
    password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
    scopes: [{ name: "users:all:999999999999999999999a00" }, { name: 'content:create:all' }, { name: 'modules:read:200004000080000000000000' }],
    settings: {
        language: 'en',
        isActive: true,
        role: "Coordinator",
        availableRoles: [
            'Coordinator'
        ],
        defaultRole: 'Coordinator',
        userNotifications: [
            {
                notification: '888811111111112345671111',
                isRead: false,
            }
        ],
    },
    details: {
        displayName: "Coordinator Ch.",
        phone: "+48 123 456 789",
        street: "Street",
        buildNr: "20/7",
        postcode: "32-100",
        city: "Paris",
        country: "France",
        dateOfBirth: "2022-07-31T12:13:46.847Z",
        description: "some description",
        aboutMe: "Some information about user from db model",
        subinterests: [8, 10, 12, 14, 16],
        socialMedia: {
            facebook: "coordinatorb",
            instagram: "coordinatorg",
            youtube: "coordinatort",
            linkedin: "coordinatorn",
        },
        notifications: {
            classes: true,
            newCourses: true,
            systemNotifications: false,
            newsletter: false,
            tricks: true,
        },
        profileCompletedIn: 10,
    },
}]