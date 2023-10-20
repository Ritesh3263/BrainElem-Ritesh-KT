exports.certificationSessions = [
    {
        _id: '432100000050000000000000',
        certificate: "613a32197124ba003c4bb8f2",
        certificationDate: "2022-07-16T00:00:00.000Z",
        allowMultipleAttempts: 1,
        architect: '6127947b249a68002b2f128a',
        trainingManager: '999999999999999999999c00',
        name: 'Séance informatique',
        // enquiry: '400000000080000000000000', always empty, if it's'original' session
        status: 1,
        module: "200004000080000000000000",
        coursePath: "200000000080000080000000",
        // groups: ['119911111119900000000000'], 
        // examiners: ['889979999999900000000001'], // ttrainer1
        unassignedTrainees: ['613a352b7124ba003c4bc0aa'], // 
        traineesCount: 2, // unassignedTrainees.length + groups.group.trainees.length, increase only when trainees are added to groups
        traineesLimit: 5, // maximum number of students who can attend 'session'/enquiry, set by ModuleManger
        startDate: "2022-07-01T00:00:00.000Z", // of session
        endDate: "2032-04-26T00:00:00.000Z", // of session
        enrollmentStartDate: "2022-07-16T00:00:00.000Z", // of enrollment
        enrollmentEndDate: "2032-03-30T00:00:00.000Z", // of enrollment
        level: "BEGINNER",
        isPublic: true,
        category: '6127cf8845c6190020bda048',
    },
    {
        // duplicate
        _id: '4321000000500000000000aa',
        certificate: "613a32197124ba003c4bb8f2",
        certificationDate: "2022-07-16T00:00:00.000Z",
        allowMultipleAttempts: 1,
        architect: '6127947b249a68002b2f128a',
        trainingManager: '999999999999999999999c00',
        name: 'Séance informatique',
        enquiry: '400000000080000000000000',
        status: 1,
        module: "200004000080000000000000",
        coursePath: "200000000080000080000000",
        //    duplicatedCoursePath: "2000000000800000800000aa", MOVED TO GROUP: "TRAINING CENTER first Group"
        internships: "400000000050000000000000",
        coordinator: "999999999999999999999a00",
        groups: ['119911111119900000000000'],
        examiners: ['889979999999900000000001'], // ttrainer1
        //    unassignedTrainees: ['613a352b7124ba003c4bc0aa'], // 
        traineesCount: 2, // unassignedTrainees.length + groups.group.trainees.length, increase only when trainees are added to groups
        traineesLimit: 5, // maximum number of students who can attend 'session'/enquiry, set by ModuleManger
        startDate: "2022-07-01T00:00:00.000Z", // of session
        endDate: "2032-04-26T00:00:00.000Z", // of session
        enrollmentStartDate: "2022-07-16T00:00:00.000Z", // of enrollment
        enrollmentEndDate: "2032-03-30T00:00:00.000Z", // of enrollment
        level: "BEGINNER",
        origin: "432100000050000000000000",
        isPublic: true,
        category: '6127cf8845c6190020bda048',
    },
    {
        _id: '432100000050000000000001',
        certificate: "613a32197124ba003c4aaaaa",
        certificationDate: "2022-07-16T00:00:00.000Z",
        allowMultipleAttempts: 1,
        architect: '6127947b249a68002b2f128a', //actually ModuleManager
        trainingManager: '999999999999999999999c00',
        name: 'SECOND Séance informatique',
        paymentEnabled: true,
        price: 19,
        status: 1,
        module: "200004000080000000000000",
        examiners: ['889979999999900000000001'], // ttrainer1
        coursePath: "299000000080000000000000",
        traineesLimit: 50, // maximum number of students who can attend 'session'/enquiry, set by ModuleManger
        startDate: "2022-07-01T00:00:00.000Z", // of session
        endDate: "2023-04-26T00:00:00.000Z", // of session
        enrollmentStartDate: "2022-07-16T00:00:00.000Z", // of enrollment
        enrollmentEndDate: "2023-03-30T00:00:00.000Z", // of enrollment
        level: "BEGINNER",
        isPublic: true,
        category: '6127cf8845c6190020bda048',
    },
    {
        _id: '62449d802529420250076723',
        groups: [],
        unassignedTrainees: [],
        pastTrainees: [],
        traineesCount: 0,
        traineesLimit: 18,
        status: true,
        archived: false,
        isSendToCloud: true,
        isPublic: true,
        allowMultipleAttempts: false,
        examiners: [],
        internships: [],
        name: 'Final session',
        enrollmentStartDate: '2022-07-30T18:10:06.122Z',
        enrollmentEndDate: '2023-03-30T18:10:06.122Z',
        startDate: '2022-07-30T18:10:06.122Z',
        endDate: '2023-03-30T18:10:06.122Z',
        digitalCode: '777',
        coordinator: null,
        format: '888811111111112345a11111',
        trainingManager: '62449d4b252942025007663f',
        category: '624490b6338c1601f1522160',
        event: null,
        certificate: '624496cf39d0190229a7ddf9',
        module: '200004000080000000000000',
        createdAt: '2022-07-30T18:12:16.969Z',
        updatedAt: '2022-07-30T18:34:29.607Z',
        __v: 0,
        coursePath: '62449cdc2529420250076505',
    },
    {
        _id: '62166cbd60c8ef00fb9df202',
        allowMultipleAttempts: false,
        status: true,
        isSendToCloud: true,
        isPublic: true,
        examiners: [],
        groups: [],
        image: '',
        unassignedTrainees: [],
        traineesCount: 0,
        traineesLimit: 100,
        name: 'Another session for testing',
        startDate: "2022-07-01T00:00:00.000Z", // of session
        endDate: "2026-04-26T00:00:00.000Z", // of session
        enrollmentStartDate: "2022-07-16T00:00:00.000Z", // of enrollment
        enrollmentEndDate: "2026-03-30T00:00:00.000Z", // of enrollment
        digitalCode: '44444',
        format: '888811111111112345a11111',
        trainingManager: '999999999999999999999c00',
        coursePath: '62166b8660c8ef00fb9df190',
        module: '200004000080000000000000',
        createdAt: '2022-07-23T17:19:57.146Z',
        updatedAt: '2022-07-23T17:19:57.146Z',
        __v: 0,
        internships: [
            '62191506ece3ec003ab18412'
        ],
        category: '6127cf8845c6190020bda048',
    },
    {
        _id: '621672fb9610c70106526658',
        allowMultipleAttempts: false,
        status: true,
        isSendToCloud: true,
        isPublic: true,
        examiners: [
            '6216724d60c8ef00fb9df505',
        ],
        groups: [
            '62168d24ea22570189809ada',
        ],
        traineesCount: 0,
        traineesLimit: 100,
        origin: '62166cbd60c8ef00fb9df202',
        enquiry: '62166ff360c8ef00fb9df3fa',
        architect: '6127947b249a68002b2f128a',
        trainingManager: '999999999999999999999c00',
        name: 'Another session/enquiry for testing',
        module: '200004000080000000000000',
        coursePath: '62166b8660c8ef00fb9df190',
        startDate: "2022-07-01T00:00:00.000Z", // of session
        endDate: "2022-07-26T00:00:00.000Z", // of session
        enrollmentStartDate: "2022-07-16T00:00:00.000Z", // of enrollment
        enrollmentEndDate: "2027-03-30T00:00:00.000Z", // of enrollment
        createdAt: '2022-07-23T17:46:36.056Z',
        updatedAt: '2022-07-23T19:38:12.698Z',
        __v: 0,
        digitalCode: '',
        endDate: '2027-02-23T18:12:29.494Z',
        format: '888811111111112345a11111',
        certificate: '613a32197124ba003c4aaaaa',
        internships: [
            '62191506ece3ec003ab18412'
        ],
        coordinator: '999999999999999999999a00',
        category: '6127cf8845c6190020bda048',
    },
    {
        _id: '623a027dcc05ab00ffc57d84',
        groups: [],
        unassignedTrainees: [],
        pastTrainees: [],
        traineesCount: 0,
        traineesLimit: 1,
        status: true,
        archived: false,
        isSendToCloud: true,
        isPublic: true,
        allowMultipleAttempts: false,
        examiners: [],
        internships: [],
        name: 'Demo session',
        enrollmentStartDate: '2022-07-22T17:07:32.050Z',
        enrollmentEndDate: '2028-04-13T16:07:00.000Z',
        startDate: '2022-07-22T17:07:32.050Z',
        endDate: '2028-05-22T17:07:32.050Z',
        digitalCode: '123',
        coordinator: null,
        format: '888811111111112345a11111',
        trainingManager: '999999999999999999999c00',
        category: '6127cf8845c6190020bda048',
        module: '200004000080000000000000',
        createdAt: '2022-07-22T17:08:13.424Z',
        updatedAt: '2022-07-22T17:08:13.424Z',
        __v: 0
    },
    {
        _id: '6244a56e9201bd0266293b0a',
        groups: [
            '6244ae1b865fb702af279ec6'
        ],
        unassignedTrainees: [],
        pastTrainees: [],
        traineesCount: 0,
        traineesLimit: 100,
        status: true,
        archived: false,
        isSendToCloud: true,
        isPublic: true,
        allowMultipleAttempts: false,
        examiners: [
            '6244908d338c1601f1522110',
        ],
        internships: [],
        origin: '62449d802529420250076723',
        enquiry: '6244a5289201bd0266293a4d',
        certificate: '624496cf39d0190229a7ddf9',
        architect: '6127947b249a68002b2f128a',
        trainingManager: '62449d4b252942025007663f',
        name: 'Final session',
        module: '200004000080000000000000',
        coursePath: '62449cdc2529420250076505',
        startDate: '2022-07-30T18:42:47.892Z',
        enrollmentStartDate: '2022-07-30T18:10:06.122Z',
        enrollmentEndDate: '2023-03-30T18:10:06.122Z',
        createdAt: '2022-07-30T18:46:06.372Z',
        updatedAt: '2022-07-30T19:31:22.773Z',
        __v: 0,
        category: '624490b6338c1601f1522160',
        coordinator: null,
        digitalCode: '',
        endDate: '2023-03-30T18:53:06.970Z',
        event: null,
        format: '888811111111112345a11111',
    }, 
        // BRAINCORE INIT CERTIFICATE
        {
            _id: '64b11050f472b7083848a314',
            groups: [
                '64b11050f472b7083848a310',
            ],
            unassignedTrainees: [],
            pastTrainees: [],
            traineesCount: 0,
            traineesLimit: 1000,
            status: true,
            archived: false,
            isSendToCloud: true,
            isPublic: true,
            examiners: [
                '63b27cc52d8fb5f910d142b5'
            ],
            internships: [],
            price: 0,
            paymentEnabled: false,
            name: 'INIT BC SESSION',
            enrollmentStartDate: '2023-07-14T09:06:53.745Z',
            enrollmentEndDate: '2023-07-14T09:06:53.745Z',
            startDate: '2023-07-14T09:06:53.745Z',
            endDate: '2023-07-14T09:06:53.745Z',
            digitalCode: 'sample data',
            coursePath: '64b11050f472b7083848a32b',
            coordinator: null,
            format: '64a68f4c7013d1001efdcaa1',
            category: '64a68c9b7013d1001efdc7e9',
            event: null,
            certificate: '64a68ed87013d1001efdca7a',
            module: '333000000000000000000000',
            trainingManager: '63b27cc52d8fb5f910d142b5',
            createdAt: '2023-07-14T09:07:28.499Z',
            updatedAt: '2023-07-14T09:07:28.499Z',
            __v: 0
        }

]
