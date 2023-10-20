exports.rolePermissionsMappings = [
    {
        _id: "63c8f59088bbc68cce0eb6e0",
        roleMaster: "63c8f1cb88bbc68cce0eb2ea", // Administrator Role
        permissions: [
            "6433bd8d56ad0bfabd021d79", // Home
            "63c8f4a288bbc68cce0eb6d6", // Admin - Authorization
            "64e43ab2c9eb251f6709969c", // Admin - Teams Access
            "64e23ab2c9eb251f6209969c", // Admin - Credits
            "63c8f4e588bbc68cce0eb6db", // My Teams - Teams
            "63c8f4f888bbc68cce0eb6dc", // My Teams - BC Test Registrations
            "6459ee09325b3100230274f2", // My Teams - Results
            "64dc8c290c1a91f23701d7ba", // My Teams - Statistics
            // "63c8f4f888bbc68cce0eb6dd", // My Teams - BC Results for Group
            // "63ce47ff1bb07309970053c6",
            // "63ce47ff1bb07309970053c7",
            // "63ce47ff1bb07309970053c8",
            // "63ce47ff1bb07309970053c9",
            // "63ce47ff1bb07309970053ca",
            "63c8f3f588bbc68cce0eb6d5", // My Users - Users
            "6433be4856ad0bfabd021d7a", // My Users - BC Test Registrations
            "6433be8356ad0bfabd021d7b", // My Projects
            "6433beb256ad0bfabd021d7c", // My Diary
            "6433beb256ad0bfabd021d7d", // My Trainings - Braincore Coach
            "6433beb256ad0bfabd021d7e", // My Trainings - Braincore Trainer
            // "63c8f4f888bbc68cce0eb6de", // Interactive CS
            // "63ce48791bb07309970053cb",
            // "63ce48791bb07309970053cc",
            // "63ce48791bb07309970053cd",
            // "63ce48791bb07309970053ce",
            // "63ce48791bb07309970053cf",
            // "63ce48791bb07309970053d0",
            // "63c8f4f888bbc68cce0eb6df", // Neuro
            // "63ce48e51bb07309970053d1",
            // "63ce48e51bb07309970053d2",
            // "63ce48e51bb07309970053d3",
            // "63ce48e51bb07309970053d4",
            // "63ce48e51bb07309970053d5",
            // "63ce48e51bb07309970053d6",
            "64ec1680a2a540e2c904e90c", // My Space - My Results
            "64ec16f6a2a540e2c904e90d", // My Space - Virtual Coach
            "64ec173aa2a540e2c904e90e", // My Space - My Resources
        ],
        createdAt: "2023-01-19T07:16:22.586Z",
        updatedAt: "2023-01-19T07:16:22.586Z"
    },
    {
        _id: "64058ece4037cfa1d408559b",
        roleMaster: "64058db74037cfa1d4085598", // Trainee role
        permissions: [
            "64ec1680a2a540e2c904e90c", // My Space - My Results
            "64ec16f6a2a540e2c904e90d", // My Space - Virtual Coach
            "64ec173aa2a540e2c904e90e", // My Space - My Resources
            "6433beb256ad0bfabd021d7d", // My Trainings - Braincore Coach
            // "6433beb256ad0bfabd021d7e", // My Trainings - Braincore Trainer
        ],
        createdAt: "2023-01-19T07:16:22.586Z",
        updatedAt: "2023-01-19T07:16:22.586Z"
    },
    {
        _id: '64058f354037cfa1d408559c',
        permissions: [
            "64ec1680a2a540e2c904e90c", // My Space - My Results
            "64ec16f6a2a540e2c904e90d", // My Space - Virtual Coach
            "64ec173aa2a540e2c904e90e", // My Space - My Resources
            "6433beb256ad0bfabd021d7d", // My Trainings - Braincore Coach
            // "6433beb256ad0bfabd021d7e", // My Trainings - Braincore Trainer
            '6459ee09325b3100230274f2', // My Teams - Results
            '64dc8c290c1a91f23701d7ba', // My Teams - Statistics
            '63c8f4e588bbc68cce0eb6db' // My Teams - Teams
        ],
        roleMaster: '64058e394037cfa1d4085599', // Trainer role
        createdAt: '2023-01-19T07:16:22.586Z',
        updatedAt: '2023-01-19T07:16:22.586Z',
        __v: 0
    },
    {
        _id: "64058f4a4037cfa1d408559e",
        roleMaster: "64058e6a4037cfa1d408559a", // TrainingManager role
        permissions: [
            "64ec1680a2a540e2c904e90c", // My Space - My Results
            "64ec16f6a2a540e2c904e90d", // My Space - Virtual Coach
            "64ec173aa2a540e2c904e90e", // My Space - My Resources
            "6433beb256ad0bfabd021d7d", // My Trainings - Braincore Coach
            // "6433beb256ad0bfabd021d7e", // My Trainings - Braincore Trainer
            '6459ee09325b3100230274f2', // My Teams - Results
            '64dc8c290c1a91f23701d7ba', // My Teams - Statistics
            '63c8f4e588bbc68cce0eb6db' // My Teams - Teams
        ],
        createdAt: "2023-01-19T07:16:22.586Z",
        updatedAt: "2023-01-19T07:16:22.586Z"
    }, 
    {
        _id: '64b106e2bc79d907c1bf9285', // BC COACH Candidate
        permissions: [
            '6433beb256ad0bfabd021d7d', // BC COACH
        ],
        roleMaster: '64b106e2bc79d907c1bf9282',
        createdAt: '2023-07-14T08:27:14.242Z',
        updatedAt: '2023-07-14T08:27:14.242Z',
        __v: 0
    }, 
    {
        _id: '64b106e2bc79d907c1bf9286', // BC COACH , not candidate
        permissions: [
            '6433beb256ad0bfabd021d7d', // BC COACH
            '6433be4856ad0bfabd021d7a' // My Users - BC Test Registrations
        ],
        roleMaster: '64b106e2bc79d907c1bf9283',
        createdAt: '2023-07-14T08:27:14.242Z',
        updatedAt: '2023-07-14T08:27:14.242Z',
        __v: 0
    },
    {
        _id: '64b106e2bc79d907c1bf9287', // BC Trainer
        permissions: [
            '6433beb256ad0bfabd021d7e', // BC Trainer
        ],
        roleMaster: '64b106e2bc79d907c1bf9284',
        createdAt: '2023-07-14T08:27:14.242Z',
        updatedAt: '2023-07-14T08:27:14.242Z',
        __v: 0
    }
]