exports.trainees = [
    // TRAINING CENTER TRAINEES
    {
        _id: '999979999999900000000001',
        settings: {
            isActive: true,
            emailConfirmed: true,
            selfRegistered: true,
            origin: 'fr_FR',
            language: 'en',
            role: "Other",
            availableRoles: [
                'Other'
            ],
            defaultRole: 'Other',
            availableRoleMasters: [
                '64058db74037cfa1d4085598',
            ],
            roleMaster: '64058db74037cfa1d4085598',
            defaultRoleMaster: '64058db74037cfa1d4085598',
            _id: '613a352b7124ba003c4bc02a',
            createdAt: '2022-07-09T16:24:11.896Z',
            updatedAt: '2022-07-09T16:24:11.896Z',
            userNotifications: [
                {
                    isRead: false,
                    _id: '64c30501705a890009131963',
                    notification: '64c30501705a890009131938',
                },
                {
                    isRead: false,
                    _id: '64cd91017f31af0009242f4a',
                    notification: '64cd91017f31af0009242f1b',
                }
            ]
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
            _id: '613a352b7124ba003c4bc02b',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2022-07-09T16:24:11.896Z',
            updatedAt: '2022-07-09T16:24:11.896Z',
        },
        name: 'First',
        surname: 'Trainee',
        username: 'ttrainee1',
        password: '$2a$08$S7rhOE9pyhquEq80/CbGe.I1bz0Sa6FYLrJmhAQBgNHP6LjdmskMS',
        rootFolder: 'F01DE2000000000000002000',
        brainCoreTest: {
            registerDate: '2023-03-28T06:52:59.008Z',
            completionDate: '2023-03-28T06:55:59.008Z',
            status: "Completed"
        },
        scopes: [
            {
                _id: '613a352b7124ba003c4bc02c',
                name: 'users:all:999979999999900000000001',
                createdAt: '2022-07-09T16:24:11.896Z',
                updatedAt: '2022-07-09T16:24:11.896Z',
            },
            {
                _id: '613a352b7124ba003c4bc02d',
                name: 'content:create:all',
                createdAt: '2022-07-09T16:24:11.896Z',
                updatedAt: '2022-07-09T16:24:11.896Z',
            },
            {
                _id: '613a352b7124ba003c4bc02e',
                name: 'modules:read:200004000080000000000000',
                createdAt: '2022-07-09T16:24:11.896Z',
                updatedAt: '2022-07-09T16:24:11.896Z',
            },
            {
                _id: '613a352b7124ba003c4bc03e',
                name: 'modules:read:333000000000000000000000',
                createdAt: '2022-07-09T16:24:11.896Z',
                updatedAt: '2022-07-09T16:24:11.896Z',
            }
        ],
        certificates: [
            {
                status: true,
                _id: '613a35c37124ba003c4bc148',
                blockchainStatus: true,
                blockchainContractAddress: '0xd4862070ab9f9E05dc793277E1B93705c878a501',
                blockchainNetworkId: '11155111',
                certificationSession: '4321000000500000000000aa',
                verificationDate: '2022-07-09T16:26:43.530Z',
                additionalComment: 'TRAINING MANAGER ACCEPTED THE CERTIFICAtION',
                internshipStatus: false,
                details: [
                    {
                        _id: '613a35c37124ba003c4bc149',
                        examiner: '889979999999900000000001',
                        verificationDate: '2022-07-09T16:26:43.530Z',
                        competenceBlocks: [
                            {
                                _id: '613a35c37124ba003c4bc14c',
                                block: 6,
                                competences: [
                                    {
                                        _id: '613a35c37124ba003c4bc14d',
                                        competence: 21,
                                        grade: "5",
                                    },
                                    {
                                        _id: '613a35c37124ba003c4bc14e',
                                        competence: 22,
                                        grade: "5",
                                    },
                                    {
                                        _id: '613a35c37124ba003c4bc14f',
                                        competence: 23,
                                        grade: "5",
                                    }
                                ]
                            },
                            {
                                _id: '613a35c37124ba003c4bc150',
                                block: 7,
                                competences: [
                                    {
                                        _id: '613a35c37124ba003c4bc151',
                                        competence: 24,
                                        grade: "5",
                                    },
                                    {
                                        _id: '613a35c37124ba003c4bc152',
                                        competence: 25,
                                        grade: "5",
                                    }
                                ]
                            }
                        ],
                        externalCompetences: [
                            {
                                competence: 26,
                                grade: "5",
                            },
                            {
                                competence: 27,
                                grade: "5",
                            }
                        ],
                        comment: 'Very good job! '
                    }
                ],
            }
        ],
        reports: [
            {
                creator: '999999999999999999999c00', // TrainingManager
                comment: 'student is ok (training)',
                group: '119911111119900000000000',
                date: "2022-07-15T12:13:46.847Z",
                softSkillsTemplate: '444444444455444444444444',
                softSkills: [
                    {
                        _id: '1',
                        rate: 5,
                    },
                    {
                        _id: '2',
                        rate: 5,
                    },
                    {
                        _id: '3',
                        rate: 5,
                    }
                ],
            }
        ],
        sessionProgress: [{
            certificationSessionId: '4321000000500000000000aa',
            latestChapterId: '2a232f22c2acf362191741e3', // TODO
            latestContentId: '613a34187124ba003c4bbe8f',// TODO
        }],
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        createdAt: '2022-07-09T16:24:11.896Z',
        updatedAt: '2022-07-09T16:36:39.206Z',
        __v: 0
    },
    {
        _id: '6216723560c8ef00fb9df4e3',
        settings: {
            isActive: true,
            emailConfirmed: true,
            selfRegistered: true,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            role: "Other",
            availableRoles: [
                'Other'
            ],
            defaultRole: 'Other',
            availableRoleMasters: [
                '64058db74037cfa1d4085598',
            ],
            roleMaster: '64058db74037cfa1d4085598',
            defaultRoleMaster: '64058db74037cfa1d4085598',
            _id: '6216723660c8ef00fb9df4e7',
            defaultRole: 'Trainee',
            createdAt: '2022-07-23T17:43:18.185Z',
            updatedAt: '2022-07-23T17:43:18.185Z',
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
            _id: '6216723660c8ef00fb9df4e8',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '2022-07-23T17:42:56.349Z',
            createdAt: '2022-07-23T17:43:18.185Z',
            updatedAt: '2022-07-23T17:43:18.185Z',
        },
        name: 'another',
        surname: 'trainee',
        username: 'anothertrainee',
        password: '$2a$08$VW2HbCNdVFdbCIR1Sqc/R.DzcD.GYiNQ645QflRrZb7LjSb8OnAqu',
        scopes: [
            {
                _id: '6216723660c8ef00fb9df4e9',
                name: 'users:all:6216723560c8ef00fb9df4e3',
                createdAt: '2022-07-23T17:43:18.186Z',
                updatedAt: '2022-07-23T17:43:18.186Z',
            },
            {
                _id: '6216723660c8ef00fb9df4ea',
                name: 'content:create:all',
                createdAt: '2022-07-23T17:43:18.188Z',
                updatedAt: '2022-07-23T17:43:18.188Z',
            },
            {
                _id: '6216723660c8ef00fb9df4eb',
                name: 'modules:read:200004000080000000000000',
                createdAt: '2022-07-23T17:43:18.188Z',
                updatedAt: '2022-07-23T17:43:18.188Z',
            }
        ],
        certificates: [
            {
                status: true,
                internshipStatus: false,
                _id: '62168d24ea22570189809ae9',
                certificationSession: '621672fb9610c70106526658',
                details: [
                    {
                        _id: '62168d24ea22570189809aea',
                        examiner: '6216724d60c8ef00fb9df505',
                        verificationDate: '2022-07-23T19:38:12.826Z',
                        comment: '',
                        competenceBlocks: [],
                        externalCompetences: []
                    }
                ],
                createdAt: '2022-07-23T19:38:12.870Z',
                updatedAt: '2022-07-23T19:38:12.870Z',
            }
        ],
        reports: [
            {
                _id: '6217b91d0516e10547fbc236',
                softSkillsTemplate: '444444444455444444444444',
                softSkills: [
                    {
                        _id: 1,
                        rate: 4
                    },
                    {
                        _id: 2,
                        rate: 6
                    },
                    {
                        _id: 3,
                        rate: 2
                    }
                ],
                comment: 'GOOD',
                creator: '999999999999999999999c00',
                updatedAt: '2022-07-24T16:58:05.261Z',
                createdAt: '2022-07-24T16:58:05.261Z',
            }
        ],
        sessionProgress: [],
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        tips: [],
        createdAt: '2022-07-23T17:43:18.189Z',
        updatedAt: '2022-07-23T19:38:12.870Z',
        __v: 0
    },
  
   
        // NEW TRAINEES 28.10.2022
    // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    {
        _id: '635bc5be21ab2c00ecd14c74',
        settings: {
            completed: {
                courses: [],
                chapters: [],
                contents: []
            },
            hide: {
                courses: []
            },
            prevLogin: {
                deviceType: 'desktop'
            },
            currentLogin: {
                deviceType: 'desktop',
                time: '2022-10-28T13:07:07.507Z',
            },
            isActive: true,
            emailConfirmed: false,
            selfRegistered: false,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            availableRoles: [
                'Other'
            ],
            defaultRole: 'Other',
            availableRoleMasters: [
                '64058db74037cfa1d4085598',
            ],
            roleMaster: '64058db74037cfa1d4085598',
            defaultRoleMaster: '64058db74037cfa1d4085598',
            connectedDevices: [],
            _id: '635bc5be21ab2c00ecd14c78',
            feedback: {
                tips: []
            },
            userNotifications: [
            ],
            defaultRole: 'Trainee',
            createdAt: '2022-10-28T13:07:13.768Z',
            updatedAt: '2022-10-28T13:07:13.768Z',
        },
        details: {
            notifications: {
                classes: true,
                newCourses: true,
                systemNotifications: true,
                newsletter: true,
                tricks: true
            },
            children: [],
            subinterests: [
                29,
                30,
                31,
                32,
                33,
                34,
                35
            ],
            profileCompletedIn: 5,
            _id: '635bc5be21ab2c00ecd14c79',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2022-10-28T13:07:13.768Z',
            updatedAt: '2022-10-28T13:07:13.768Z',
        },
        companies: [],
        name: 'Student 1',
        surname: 'of class 1',
        email: 'student1',
        username: 'student1',
        password: '$2a$08$Bzph.3YdE7JWaNq1xT6OWe3Vy0CW9zGzv/JwdyQdhRITPGf3aSGIK',
        scopes: [
            {
                _id: '635bc5be21ab2c00ecd14c7a',
                name: 'users:all:635bc5be21ab2c00ecd14c74',
                createdAt: '2022-10-28T12:06:22.501Z',
                updatedAt: '2022-10-28T12:06:22.501Z',
            },
            {
                _id: '635bc5be21ab2c00ecd14c7b',
                name: 'content:create:all',
                createdAt: '2022-10-28T12:06:22.501Z',
                updatedAt: '2022-10-28T12:06:22.501Z',
            },
            {
                _id: '635bc5be21ab2c00ecd14c7c',
                name: 'modules:read:111000000000000000000000',
                createdAt: '2022-10-28T12:06:22.501Z',
                updatedAt: '2022-10-28T12:06:22.501Z',
            }
        ],
        certificates: [],
        reports: [],
        sessionProgress: [],
        lastRecommendationsUpdate: '2022-10-28T13:07:07.675Z',
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        createdAt: '2022-10-28T12:06:22.501Z',
        updatedAt: '2022-10-28T13:24:57.901Z',
        __v: 1,
        tips: []
    },
    {
        _id: '635bc5e021ab2c00ecd14ccc',
        settings: {
            completed: {
                courses: [],
                chapters: [],
                contents: []
            },
            hide: {
                courses: []
            },
            prevLogin: {
                deviceType: 'desktop'
            },
            currentLogin: {
                deviceType: 'desktop'
            },
            isActive: true,
            emailConfirmed: false,
            selfRegistered: false,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            availableRoles: [
                'Other'
            ],
            defaultRole: 'Other',
            availableRoleMasters: [
                '64058db74037cfa1d4085598',
            ],
            roleMaster: '64058db74037cfa1d4085598',
            defaultRoleMaster: '64058db74037cfa1d4085598',
            connectedDevices: [],
            _id: '635bc5e021ab2c00ecd14cd0',
            feedback: {
                tips: []
            },
            userNotifications: [
            ],
            defaultRole: 'Trainee',
            createdAt: '2022-10-28T12:57:07.103Z',
            updatedAt: '2022-10-28T12:57:07.103Z',
        },
        details: {
            notifications: {
                classes: true,
                newCourses: true,
                systemNotifications: true,
                newsletter: true,
                tricks: true
            },
            children: [],
            subinterests: [],
            profileCompletedIn: 5,
            _id: '635bc5e021ab2c00ecd14cd1',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2022-10-28T12:57:07.103Z',
            updatedAt: '2022-10-28T12:57:07.103Z',
        },
        companies: [],
        name: 'Student 2',
        surname: 'of class 1',
        email: 'student2',
        username: 'student2',
        password: '$2a$08$qJEcU.HSEQkvdwGTlQxxyulLeR2PLEGixY0W4nBVC5RSYgUvpKsAm',
        scopes: [
            {
                _id: '635bc5e021ab2c00ecd14cd2',
                name: 'users:all:635bc5e021ab2c00ecd14ccc',
                createdAt: '2022-10-28T12:06:56.703Z',
                updatedAt: '2022-10-28T12:06:56.703Z',
            },
            {
                _id: '635bc5e021ab2c00ecd14cd3',
                name: 'content:create:all',
                createdAt: '2022-10-28T12:06:56.703Z',
                updatedAt: '2022-10-28T12:06:56.703Z',
            },
            {
                _id: '635bc5e021ab2c00ecd14cd4',
                name: 'modules:read:111000000000000000000000',
                createdAt: '2022-10-28T12:06:56.703Z',
                updatedAt: '2022-10-28T12:06:56.703Z',
            }
        ],
        certificates: [],
        reports: [],
        sessionProgress: [],
        lastRecommendationsUpdate: '2022-10-28T12:06:56.694Z',
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        createdAt: '2022-10-28T12:06:56.703Z',
        updatedAt: '2022-10-28T13:24:57.901Z',
        __v: 0
    },
    {
        _id: '635bc60021ab2c00ecd14d2f',
        settings: {
            completed: {
                courses: [],
                chapters: [],
                contents: []
            },
            hide: {
                courses: []
            },
            prevLogin: {
                deviceType: 'desktop'
            },
            currentLogin: {
                deviceType: 'desktop'
            },
            isActive: true,
            emailConfirmed: false,
            selfRegistered: false,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            availableRoles: [
                'Other'
            ],
            defaultRole: 'Other',
            availableRoleMasters: [
                '64058db74037cfa1d4085598',
            ],
            roleMaster: '64058db74037cfa1d4085598',
            defaultRoleMaster: '64058db74037cfa1d4085598',
            connectedDevices: [],
            _id: '635bc60021ab2c00ecd14d33',
            feedback: {
                tips: []
            },
            userNotifications: [
            ],
            defaultRole: 'Trainee',
            createdAt: '2022-10-28T12:57:16.635Z',
            updatedAt: '2022-10-28T12:57:16.635Z',
        },
        details: {
            notifications: {
                classes: true,
                newCourses: true,
                systemNotifications: true,
                newsletter: true,
                tricks: true
            },
            children: [],
            subinterests: [],
            profileCompletedIn: 5,
            _id: '635bc60021ab2c00ecd14d34',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2022-10-28T12:57:16.635Z',
            updatedAt: '2022-10-28T12:57:16.635Z',
        },
        companies: [],
        name: 'Student 3',
        surname: 'of class 2',
        username: 'student3',
        password: '$2a$08$N.yzURe05N53HKvcBuhISe.ib9Dfo7y2YyDaXf2oEmTOrSzCHLnP.',
        scopes: [
            {
                _id: '635bc60021ab2c00ecd14d35',
                name: 'users:all:635bc60021ab2c00ecd14d2f',
                createdAt: '2022-10-28T12:07:28.152Z',
                updatedAt: '2022-10-28T12:07:28.152Z',
            },
            {
                _id: '635bc60021ab2c00ecd14d36',
                name: 'content:create:all',
                createdAt: '2022-10-28T12:07:28.152Z',
                updatedAt: '2022-10-28T12:07:28.152Z',
            },
            {
                _id: '635bc60021ab2c00ecd14d37',
                name: 'modules:read:111000000000000000000000',
                createdAt: '2022-10-28T12:07:28.153Z',
                updatedAt: '2022-10-28T12:07:28.153Z',
            }
        ],
        certificates: [],
        reports: [],
        sessionProgress: [],
        lastRecommendationsUpdate: '2022-10-28T12:07:28.146Z',
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        createdAt: '2022-10-28T12:07:28.153Z',
        updatedAt: '2022-10-28T13:06:55.224Z',
        __v: 0,
        email: 'student3'
    },
    {
        _id: '635bc69c21ab2c00ecd14da9',
        settings: {
            completed: {
                courses: [],
                chapters: [],
                contents: []
            },
            hide: {
                courses: []
            },
            prevLogin: {
                deviceType: 'desktop'
            },
            currentLogin: {
                deviceType: 'desktop'
            },
            isActive: true,
            emailConfirmed: false,
            selfRegistered: false,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            availableRoles: [
                'Other'
            ],
            defaultRole: 'Other',
            availableRoleMasters: [
                '64058db74037cfa1d4085598',
            ],
            roleMaster: '64058db74037cfa1d4085598',
            defaultRoleMaster: '64058db74037cfa1d4085598',
            connectedDevices: [],
            _id: '635bc69c21ab2c00ecd14dad',
            feedback: {
                tips: []
            },
            userNotifications: [
            ],
            defaultRole: 'Trainee',
            createdAt: '2022-10-28T12:57:22.964Z',
            updatedAt: '2022-10-28T12:57:22.964Z',
        },
        details: {
            notifications: {
                classes: true,
                newCourses: true,
                systemNotifications: true,
                newsletter: true,
                tricks: true
            },
            children: [],
            subinterests: [],
            profileCompletedIn: 5,
            _id: '635bc69c21ab2c00ecd14dae',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2022-10-28T12:57:22.964Z',
            updatedAt: '2022-10-28T12:57:22.964Z',
        },
        companies: [],
        name: 'Student 4',
        surname: 'of class 2',
        email: 'student4',
        username: 'student4',
        password: '$2a$08$PkqZX.DRnkvTZ9yAfF9EkOl0G8uSSSJJuhxm6gwNksG8xQTxN8zfW',
        scopes: [
            {
                _id: '635bc69c21ab2c00ecd14daf',
                name: 'users:all:635bc69c21ab2c00ecd14da9',
                createdAt: '2022-10-28T12:10:04.908Z',
                updatedAt: '2022-10-28T12:10:04.908Z',
            },
            {
                _id: '635bc69c21ab2c00ecd14db0',
                name: 'content:create:all',
                createdAt: '2022-10-28T12:10:04.909Z',
                updatedAt: '2022-10-28T12:10:04.909Z',
            },
            {
                _id: '635bc69c21ab2c00ecd14db1',
                name: 'modules:read:111000000000000000000000',
                createdAt: '2022-10-28T12:10:04.909Z',
                updatedAt: '2022-10-28T12:10:04.909Z',
            }
        ],
        certificates: [],
        reports: [],
        sessionProgress: [],
        lastRecommendationsUpdate: '2022-10-28T12:10:04.897Z',
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        createdAt: '2022-10-28T12:10:04.909Z',
        updatedAt: '2022-10-28T13:06:55.224Z',
        __v: 0
    }, 
    {
        _id: '64b1081b32865c07f90fbbab',
        rootFolder: 'F01DE200000000000000F000',
        settings: {
            completed: {
                courses: [],
                chapters: [],
                contents: []
            },
            hide: {
                courses: []
            },
            permissions: {
                assistant: []
            },
            feedback: {
                tips: []
            },
            prevLogin: {
                deviceType: 'desktop'
            },
            currentLogin: {
                deviceType: 'desktop'
            },
            isActive: true,
            emailConfirmed: false,
            hideTutorial: false,
            selfRegistered: false,
            agreedForMarketing: false,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            role: 'Other',
            availableRoles: [],
            connectedDevices: [],
            availableRoleMasters: [
                '64b106e2bc79d907c1bf9282',
            ],
            timezone: 'Europe/Paris',
            _id: '64b1081b32865c07f90fbbb2',
            defaultRole: 'Other',
            roleMaster: '64b106e2bc79d907c1bf9282',
            defaultRoleMaster: '64b106e2bc79d907c1bf9282',
            userNotifications: [],
            createdAt: '2023-07-14T08:32:27.535Z',
            updatedAt: '2023-07-14T08:32:27.535Z',
        },
        details: {
            notifications: {
                classes: true,
                newCourses: true,
                systemNotifications: true,
                newsletter: true,
                tricks: true
            },
            children: [],
            subinterests: [],
            profileCompletedIn: 5,
            _id: '64b1081b32865c07f90fbbb3',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2023-07-14T08:32:27.535Z',
            updatedAt: '2023-07-14T08:32:27.535Z',
        },
        companies: [],
        isDeleted: false,
        name: 'bccoach',
        surname: 'init',
        email: 'bccoach',
        username: 'bccoach',
        password: '$2a$08$siCh88yNNsD5h33w6xBlsOA1OZpZWyqpUcyxU7s/.DGd5PmTSt312',
        scopes: [
            {
                _id: '64b1081b32865c07f90fbbb4',
                name: 'users:all:64b1081b32865c07f90fbbab',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            },
            {
                _id: '64b1081b32865c07f90fbbb5',
                name: 'content:create:all',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            },
            {
                _id: '64b1081b32865c07f90fbbb6',
                name: 'modules:read:333000000000000000000000',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            },
            {
                _id: '64b1081b32865c07f90fbbb7',
                name: 'modules:read:200004000080000000000000',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            }
        ],
        certificates: [],
        reports: [],
        sessionProgress: [],
        lastRecommendationsUpdate: '2023-07-14T08:32:27.533Z',
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        createdAt: '2023-07-14T08:32:27.535Z',
        updatedAt: '2023-07-14T08:58:12.587Z',
        __v: 0,
        teams: ['64b104b9bc79d907c1bf915d'],
        sessionContentProgress: [
            {
                certificationSessionId: '64b11050f472b7083848a314',
                status: 'DONE',
                contentId: '64a68fed7013d1001efdcc4c',
            }
        ]
    },
    {
        _id: '64a1081b32865c07f90fbbab',
        settings: {
            completed: {
                courses: [],
                chapters: [],
                contents: []
            },
            hide: {
                courses: []
            },
            permissions: {
                assistant: []
            },
            feedback: {
                tips: []
            },
            prevLogin: {
                deviceType: 'desktop'
            },
            currentLogin: {
                deviceType: 'desktop'
            },
            isActive: true,
            emailConfirmed: false,
            hideTutorial: false,
            selfRegistered: false,
            agreedForMarketing: false,
            level: '1',
            language: 'en',
            origin: 'fr_FR',
            role: 'Other',
            availableRoles: [],
            connectedDevices: [],
            availableRoleMasters: [
                '64b106e2bc79d907c1bf9283',
            ],
            timezone: 'Europe/Paris',
            _id: '64b1081b32865c07f90fbbb2',
            defaultRole: 'Other',
            roleMaster: '64b106e2bc79d907c1bf9283',
            defaultRoleMaster: '64b106e2bc79d907c1bf9283',
            userNotifications: [],
            createdAt: '2023-07-14T08:32:27.535Z',
            updatedAt: '2023-07-14T08:32:27.535Z',
        },
        details: {
            notifications: {
                classes: true,
                newCourses: true,
                systemNotifications: true,
                newsletter: true,
                tricks: true
            },
            children: [],
            subinterests: [],
            profileCompletedIn: 5,
            _id: '64b1081b32865c07f90fbbb3',
            fullName: '',
            displayName: '',
            phone: '',
            street: '',
            buildNr: '',
            postcode: '',
            city: '',
            country: '',
            dateOfBirth: '',
            createdAt: '2023-07-14T08:32:27.535Z',
            updatedAt: '2023-07-14T08:32:27.535Z',
        },
        companies: [],
        isDeleted: false,
        name: 'Certified',
        surname: 'Coach',
        email: 'certifiedcoach',
        username: 'certifiedcoach',
        password: '$2a$08$siCh88yNNsD5h33w6xBlsOA1OZpZWyqpUcyxU7s/.DGd5PmTSt312',
        scopes: [
            {
                _id: '64b1081b32865c07f90fbbb4',
                name: 'users:all:64b1081b32865c07f90fbbab',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            },
            {
                _id: '64b1081b32865c07f90fbbb5',
                name: 'content:create:all',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            },
            {
                _id: '64b1081b32865c07f90fbbb6',
                name: 'modules:read:333000000000000000000000',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            },
            {
                _id: '64b1081b32865c07f90fbbb7',
                name: 'modules:read:200004000080000000000000',
                createdAt: '2023-07-14T08:32:27.535Z',
                updatedAt: '2023-07-14T08:32:27.535Z',
            }
        ],
        certificates: [
            {
                status: true,
                moduleManagerAproval: false,
                internshipStatus: false,
                blockchainStatus: false,
                blockchainNetworkId: '',
                blockchainContractAddress: '',
                _id: '64df5bfd61fa7c006889c476',
                certificationSession: '64b11050f472b7083848a314',
                additionalComment: 'init certification',
                details: [],
                createdAt: '2023-08-18T11:54:37.583Z',
                updatedAt: '2023-08-18T11:54:40.017Z',
                verificationDate: '2023-08-18T11:54:40.012Z',
            }
        ],
        reports: [],
        sessionProgress: [],
        lastRecommendationsUpdate: '2023-07-14T08:32:27.533Z',
        contentRecommendations: [],
        chapterRecommendations: [],
        trainingModuleRecommendations: [],
        internships: [],
        createdAt: '2023-07-14T08:32:27.535Z',
        updatedAt: '2023-07-14T08:58:12.587Z',
        __v: 0,
        teams: ['64b104b9bc79d907c1bf915d'],
        sessionContentProgress: [
            {
                certificationSessionId: '64b11050f472b7083848a314',
                status: 'DONE',
                contentId: '64a68fed7013d1001efdcc4c',
            }
        ]
    }
]