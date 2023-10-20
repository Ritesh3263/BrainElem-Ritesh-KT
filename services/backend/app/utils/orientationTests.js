// generated with /scripts/generateTest.py, then inserted in to mongo and copied
const db = require("../models");

exports.createOrientationTests = async () => { // Action for geting result for content
    const tests = [
        {
            _id: '0000abcdabcdabcdabcdabcd',
            showTitle: true,
            durationTime: 2700,
            approvedByLibrarian: true,
            cocreators: [],
            contentType: 'TEST',
            description: 'Test był przygotowywany przez specjalistów i został sprawdzony w polskich warunkach na ponad 1500 młodych osób. Jego ciekawe i szczegółowe wyniki nieustannie aktualizujemy. Twoje dane są poufne i są dobrze chronione. Wypełniając test staraj się być w neutralnym nastroju. Udzielaj odpowiedzi zgodnych z Twoim myśleniem o sobie, swoich kwalifikacjach, możliwościach i przyszłym zawodzie. Pamiętaj, że wyniki testu nie są jedynym źródłem informacji potrzebnym w podjęciu decyzji o Twojej przyszłości. W wyborze ścieżki edukacyjnej możesz na przykład skorzystać z pomocy doradcy zawodowego. Dziękujemy, Zespół BrainCore',
            groups: [],
            pages: [
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '4576',
                            title: '<b>Metryczka</b><br><br> Zanim przystąpisz do odpowiedzi na poszczególne pytania testu, prosimy o udzielenie podstawowych informacji o sobie. Poniższa ankieta jest w pełni anonimowa - potrzebujemy jedynie ogólnych danych socjodemograficznych, które umożliwią pełniejszą analizę uzyskanych wyników. <br><br> <b> Zaznacz lub wybierz stosowną odpowiedź. </b>'
                        },
                        {
                            type: 'radiogroup',
                            name: '4577',
                            title: 'Płeć',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Mężczyzna',
                                    value: '1'
                                },
                                {
                                    text: 'Kobieta',
                                    value: '2'
                                }
                            ]
                        },
                        {
                            type: 'dropdown',
                            name: '4578',
                            title: ' Wiek',
                            isRequired: 1,
                            choices: [
                                {
                                    text: '8',
                                    value: '8'
                                },
                                {
                                    text: '9',
                                    value: '9'
                                },
                                {
                                    text: '10',
                                    value: '10'
                                },
                                {
                                    text: '11',
                                    value: '11'
                                },
                                {
                                    text: '12',
                                    value: '12'
                                },
                                {
                                    text: '13',
                                    value: '13'
                                },
                                {
                                    text: '14',
                                    value: '14'
                                },
                                {
                                    text: '15',
                                    value: '15'
                                },
                                {
                                    text: '16',
                                    value: '16'
                                },
                                {
                                    text: '17',
                                    value: '17'
                                },
                                {
                                    text: '18',
                                    value: '18'
                                },
                                {
                                    text: '19',
                                    value: '19'
                                },
                                {
                                    text: '20',
                                    value: '20'
                                },
                                {
                                    text: '> 20',
                                    value: '21'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '4579',
                            title: 'Typ szkoły',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Technikum',
                                    value: '1'
                                },
                                {
                                    text: 'Liceum',
                                    value: '2'
                                },
                                {
                                    text: 'Branżowa II stopnia',
                                    value: '3'
                                },
                                {
                                    text: 'Branżowa I stopnia',
                                    value: '4'
                                },
                                {
                                    text: 'Szkoła podstawowa',
                                    value: '5'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '4580',
                            title: 'Miejsce zamieszkania',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Miasto',
                                    value: '1'
                                },
                                {
                                    text: 'Wieś',
                                    value: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '5084',
                            title: 'Na kolejnych stronach znajdują się opisy różnych sytuacji z czterema możliwymi odpowiedziami. Przeczytaj każdą z nich i oceń, na ile pasują do Ciebie poszczególne odpowiedzi – możliwe reakcje/zachowania/cechy. Skorzystaj z następującej skali:<br><br>1 – całkowicie do mnie nie pasuje<br>2 – raczej do mnie nie pasuje<br>3 – raczej do mnie pasuje<br>4 – całkowicie do mnie pasuje<br><br>Nie ma tu dobrych ani złych odpowiedzi. Ważne są tylko te, które wyrażają Twoją opinię.'
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5030',
                            title: '[Często zdarza mi się] Analizować jak inaczej można byłoby rozwiązać jakiś problem/sytuację',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5031',
                            title: '[Często zdarza mi się] Dyskutować z innymi i dzielić się swoimi poglądami',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5032',
                            title: '[Często zdarza mi się] Rozmyślać nad nowymi rzeczami i pomysłami, które mógłbym wdrażać',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5033',
                            title: '[Często zdarza mi się] Działać z innymi osiągając wspólne cele',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5036',
                            title: '[Gdy jestem odpowiedzialny za organizację jakiegoś wydarzenia, to z łatwością] Przewodzę i nadzoruję realizację zadania przez innych',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5037',
                            title: '[Gdy jestem odpowiedzialny za organizację jakiegoś wydarzenia, to z łatwością] Wymyślam plan i zakres podejmowanych działań',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5038',
                            title: '[Gdy jestem odpowiedzialny za organizację jakiegoś wydarzenia, to z łatwością] Znajduję rozwiązania pojawiających się trudności',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5039',
                            title: '[Gdy jestem odpowiedzialny za organizację jakiegoś wydarzenia, to z łatwością] Kontaktuję się z innymi i omawiam działania związane z tym wydarzeniem',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5042',
                            title: '[Inni mówią o mnie, że] Mam tysiąc pomysłów w głowie',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5043',
                            title: '[Inni mówią o mnie, że] Potrafię zobaczyć problemy z różnych perspektyw',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5044',
                            title: '[Inni mówią o mnie, że] Wypowiadam się jasno i zrozumiale',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5045',
                            title: '[Inni mówią o mnie, że] Potrafię współpracować z innymi',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5048',
                            title: '[Świetnie radzę sobie z] Wspólnym działaniem w grupie',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5049',
                            title: '[Świetnie radzę sobie z] Porozumiewaniem się z innymi',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5050',
                            title: '[Świetnie radzę sobie z] Analizowaniem sytuacji',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5051',
                            title: '[Świetnie radzę sobie z] Wymyślaniem nowych pomysłów',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5054',
                            title: '[Najchętniej] Oceniam sytuacje i zbieram ważne informacje',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5055',
                            title: '[Najchętniej] Słucham innych i dbam o dobre porozumienie między członkami grupy',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5056',
                            title: '[Najchętniej] Tworzę nowe koncepcje i sposoby działania',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5057',
                            title: '[Najchętniej] Wspieram innych',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5060',
                            title: '[Ważne jest w życiu] Rozmyślanie, refleksje',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5061',
                            title: '[Ważne jest w życiu] Udoskonalanie tego, co już jest',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5062',
                            title: '[Ważne jest w życiu] Wymiana poglądów z innymi ludźmi',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5063',
                            title: '[Ważne jest w życiu] Budowanie relacji z innymi',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5066',
                            title: '[W przyszłości mógłbym wykonywać pracę] Współpracując z innymi w zespole i współdziałając nad realizacją zadań zawodowych',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5067',
                            title: '[W przyszłości mógłbym wykonywać pracę] Wykorzystując swoje zdolności językowe i/lub łatwość nawiązywania kontaktu z innymi, np. filolog, tłumacz, psycholog',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5068',
                            title: '[W przyszłości mógłbym wykonywać pracę] Analizując dane, np. makler giełdowy, ekonomista',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5069',
                            title: '[W przyszłości mógłbym wykonywać pracę] Projektując nowe rozwiązania i wymyślając nowe idee, np. konstruktor, naukowiec',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5072',
                            title: '[Świetnie potrafię] Wymyślać nowe rozwiązania i poprawiać stare, przyjęte sposoby działania',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5073',
                            title: '[Świetnie potrafię] Rozwiązywać problemy',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5074',
                            title: '[Świetnie potrafię] Nawiązywać kontakt z innymi',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5075',
                            title: '[Świetnie potrafię] Pracować w zespole',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5078',
                            title: '[Jestem mistrzem w] Szerokim spojrzeniu na trudności dnia codziennego',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5079',
                            title: '[Jestem mistrzem w] Odczytywaniu mowy ciała moich rozmówców',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5080',
                            title: '[Jestem mistrzem w] Budowaniu klimatu współpracy z moimi kolegami',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '5081',
                            title: '[Jestem mistrzem w] Innowacyjnym podejściu do realizowanych zadań',
                            choices: [
                                {
                                    text: 'Całkowicie do mnie nie pasuje',
                                    value: '1'
                                },
                                {
                                    text: 'Raczej do mnie nie pasuje',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej do mnie pasuje',
                                    value: '3'
                                },
                                {
                                    text: 'Całkowicie do mnie pasuje',
                                    value: '4'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '4678',
                            title: 'Na kolejnych stronach znajdują się zdjęcia przedstawiające różne sytuacje zawodowe, czynności wykonywane przez osoby pracujące w danych zawodach, a także miejsca związane z konkretnymi profesjami. Przyjrzyj się każdemu z nich i oceń, czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu? Skorzystaj z następującej skali:<br><br>1 – zdecydowanie nie<br>2 – nie <br>3 – raczej nie<br>4 – raczej tak<br>5 – tak<br>6 – zdecydowanie tak<br><br>Nie kieruj się estetyką danego zdjęcia, a jedynie kontekstem/sytuacją zawodową na nim przedstawioną. Nie ma tu dobrych ani złych odpowiedzi. Ważne są tylko te, które wyrażają Twoją opinię. '
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4681',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/9aaa1000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4683',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/13aa1000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4685',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/14aa1000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4687',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/5aaa2000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4689',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/11aa6000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4691',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/13aa3000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4693',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/16aa2000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4695',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/3aaa3000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4697',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/4aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4699',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/12aa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4701',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/15aa3000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4703',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/16aa3000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4705',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/2aaa4000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4707',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/3aaa4000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4709',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/6aaa4000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4711',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/10aa2000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4713',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/12aa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4715',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/14aa4000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4717',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/15aa4000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4719',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/1aaa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4721',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/5aaa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4723',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/7aaa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4725',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/9aaa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4870',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/13aa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4727',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/12aa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4729',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/14aa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4731',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/15aa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4733',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/1aaa6000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4735',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/6aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4737',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/7aaa6000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4739',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/8aaa3000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4741',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/10aa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4743',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/13aa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4745',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/12aa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4747',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/16aa6000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4749',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/1aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4751',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/2aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4753',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/3aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4755',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/4aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4757',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/5aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4759',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/6aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4761',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/7aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4763',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/8aaa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4765',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/9aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4767',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/16aa7000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4769',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/1aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4771',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/2aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4773',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/3aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4775',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/4aaa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4777',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/5aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4779',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/7aaa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4781',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/8aaa5000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4783',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/9aa10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4785',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/11aa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4787',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/14aa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4789',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/15aa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4791',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/2aaa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4795',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/5aa10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4797',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/6aaa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4799',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/8aaa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4801',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/10aa8000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4803',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/11aa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4805',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/13a10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4807',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/14aa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4809',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/16aa9000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4811',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/1aa10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4815',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/6aa10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4817',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/7aa10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4819',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/8aa10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4872',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/10a10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4823',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/11a10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4825',
                            title: '<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt="" src="/api/v1/orientationTests/images/12a10000abcdabcdabcdabcd/download" style="display: block; margin-left: auto; margin-right: auto; height: 320px;" /></p>\n',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie',
                                    value: '1'
                                },
                                {
                                    text: 'Nie',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej tak',
                                    value: '4'
                                },
                                {
                                    text: 'Tak',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie tak',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '4829',
                            title: 'Zapraszamy teraz do trzeciej części badania. Na kolejnych stronach znajduje się szereg twierdzeń odnoszących się do różnych cech i umiejętności. Przy każdym z nich zaznacz na skali od 1 (zdecydowanie nie zgadzam się) do 6 (zdecydowanie zgadzam się) odpowiedź, która najlepiej wyraża Twoje przekonania. <br><br>1 – zdecydowanie nie zgadzam się<br>2 – nie zgadzam się<br>3 – raczej nie zgadzam się<br>4 – raczej zgadzam się<br>5 – zgadzam się<br>6 – zdecydowanie zgadzam się<br><br>Nie ma tu dobrych ani złych odpowiedzi. Ważne są tylko te, które wyrażają Twoją opinię. '
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4830',
                            title: 'Podnoszenie swoich kwalifikacji jest jednym z moich głównych celów',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4832',
                            title: 'W nowych miejscach szybko orientuję się, jak należy się zachować',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4834',
                            title: 'Szukam okazji do zdobywania nowej wiedzy',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4836',
                            title: 'Potrafię szybko odnaleźć się w nowych sytuacjach',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4838',
                            title: 'Potrafię wytrwale dążyć do swoich celów',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4840',
                            title: 'Doświadczając niespodziewanych trudności, działam efektywnie',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4842',
                            title: 'Ważna jest dla mnie nauka i rozwój osobisty',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4844',
                            title: 'Jeśli realizuję jakieś zadanie, zawsze je kończę',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4846',
                            title: 'Chętnie poznaję nowe kultury',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4848',
                            title: 'Inni mówią o mnie, że odnalazłbym się w każdym miejscu i sytuacji',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4850',
                            title: 'Jak sobie coś postanowię, to to osiągnę',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4852',
                            title: 'Pasjonują mnie różnice międzykulturowe',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4854',
                            title: 'Samodzielnie poszukuję nowych informacji',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4856',
                            title: 'Ciekawi mnie życie osób z innych krajów',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4858',
                            title: 'Z uporem dążę do realizacji obranych celów',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4860',
                            title: 'Potrafię komunikować się z ludźmi o innej narodowości',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4862',
                            title: 'Powiedziałbym o sobie, że łatwo się przystosowuję do zmian',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4864',
                            title: 'Pasjonują mnie zwyczaje innych narodów',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4866',
                            title: 'Ciągle poszukuję nowych informacji',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '4868',
                            title: 'Potrafię żmudnie pracować, żeby zrealizować swój cel',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                }
            ],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            status: 'AWAITING',
            title: 'Orientation test',
            goNextPageAutomatic: true,
            showQuestionNumbers: 'off'
        }
    

    ]

    let images = [
        {_id: "00000000abcdabcdabcdabcd", fileName: 'welcome_test_pl.png', fileOriginalName: 'welcome_test_pl.png', mimeType: 'image/png'},
        {_id: "9aaa1000abcdabcdabcdabcd", fileName: '9_1.jpg', fileOriginalName: '9_1.jpg', mimeType: 'image/jpg'},
        {_id: "13aa1000abcdabcdabcdabcd", fileName: '13_1.jpg', fileOriginalName: '13_1.jpg', mimeType: 'image/jpg'},
        {_id: "14aa1000abcdabcdabcdabcd", fileName: '14_1.jpg', fileOriginalName: '14_1.jpg', mimeType: 'image/jpg'},
        {_id: "5aaa2000abcdabcdabcdabcd", fileName: '5_2.jpg', fileOriginalName: '5_2.jpg', mimeType: 'image/jpg'},
        {_id: "11aa6000abcdabcdabcdabcd", fileName: '11_6.jpg', fileOriginalName: '11_6.jpg', mimeType: 'image/jpg'},
        {_id: "13aa3000abcdabcdabcdabcd", fileName: '13_3.jpg', fileOriginalName: '13_3.jpg', mimeType: 'image/jpg'},
        {_id: "16aa2000abcdabcdabcdabcd", fileName: '16_2.jpg', fileOriginalName: '16_2.jpg', mimeType: 'image/jpg'},
        {_id: "3aaa3000abcdabcdabcdabcd", fileName: '3_3.jpg', fileOriginalName: '3_3.jpg', mimeType: 'image/jpg'},
        {_id: "4aaa7000abcdabcdabcdabcd", fileName: '4_7.jpg', fileOriginalName: '4_7.jpg', mimeType: 'image/jpg'},
        {_id: "12aa9000abcdabcdabcdabcd", fileName: '12_9.jpg', fileOriginalName: '12_9.jpg', mimeType: 'image/jpg'},
        {_id: "15aa3000abcdabcdabcdabcd", fileName: '15_3.jpg', fileOriginalName: '15_3.jpg', mimeType: 'image/jpg'},
        {_id: "16aa3000abcdabcdabcdabcd", fileName: '16_3.jpg', fileOriginalName: '16_3.jpg', mimeType: 'image/jpg'},
        {_id: "2aaa4000abcdabcdabcdabcd", fileName: '2_4.jpg', fileOriginalName: '2_4.jpg', mimeType: 'image/jpg'},
        {_id: "3aaa4000abcdabcdabcdabcd", fileName: '3_4.jpg', fileOriginalName: '3_4.jpg', mimeType: 'image/jpg'},
        {_id: "6aaa4000abcdabcdabcdabcd", fileName: '6_4.jpg', fileOriginalName: '6_4.jpg', mimeType: 'image/jpg'},
        {_id: "10aa2000abcdabcdabcdabcd", fileName: '10_2.jpg', fileOriginalName: '10_2.jpg', mimeType: 'image/jpg'},
        {_id: "12aa8000abcdabcdabcdabcd", fileName: '12_8.jpg', fileOriginalName: '12_8.jpg', mimeType: 'image/jpg'},
        {_id: "14aa4000abcdabcdabcdabcd", fileName: '14_4.jpg', fileOriginalName: '14_4.jpg', mimeType: 'image/jpg'},
        {_id: "15aa4000abcdabcdabcdabcd", fileName: '15_4.jpg', fileOriginalName: '15_4.jpg', mimeType: 'image/jpg'},
        {_id: "1aaa5000abcdabcdabcdabcd", fileName: '1_5.jpg', fileOriginalName: '1_5.jpg', mimeType: 'image/jpg'},
        {_id: "5aaa5000abcdabcdabcdabcd", fileName: '5_5.jpg', fileOriginalName: '5_5.jpg', mimeType: 'image/jpg'},
        {_id: "7aaa5000abcdabcdabcdabcd", fileName: '7_5.jpg', fileOriginalName: '7_5.jpg', mimeType: 'image/jpg'},
        {_id: "9aaa5000abcdabcdabcdabcd", fileName: '9_5.jpg', fileOriginalName: '9_5.jpg', mimeType: 'image/jpg'},
        {_id: "13aa7000abcdabcdabcdabcd", fileName: '13_7.jpg', fileOriginalName: '13_7.jpg', mimeType: 'image/jpg'},
        {_id: "12aa5000abcdabcdabcdabcd", fileName: '12_5.jpg', fileOriginalName: '12_5.jpg', mimeType: 'image/jpg'},
        {_id: "14aa5000abcdabcdabcdabcd", fileName: '14_5.jpg', fileOriginalName: '14_5.jpg', mimeType: 'image/jpg'},
        {_id: "15aa5000abcdabcdabcdabcd", fileName: '15_5.jpg', fileOriginalName: '15_5.jpg', mimeType: 'image/jpg'},
        {_id: "1aaa6000abcdabcdabcdabcd", fileName: '1_6.jpg', fileOriginalName: '1_6.jpg', mimeType: 'image/jpg'},
        {_id: "6aaa8000abcdabcdabcdabcd", fileName: '6_8.jpg', fileOriginalName: '6_8.jpg', mimeType: 'image/jpg'},
        {_id: "7aaa6000abcdabcdabcdabcd", fileName: '7_6.jpg', fileOriginalName: '7_6.jpg', mimeType: 'image/jpg'},
        {_id: "8aaa3000abcdabcdabcdabcd", fileName: '8_3.jpg', fileOriginalName: '8_3.jpg', mimeType: 'image/jpg'},
        {_id: "10aa5000abcdabcdabcdabcd", fileName: '10_5.jpg', fileOriginalName: '10_5.jpg', mimeType: 'image/jpg'},
        {_id: "13aa8000abcdabcdabcdabcd", fileName: '13_8.jpg', fileOriginalName: '13_8.jpg', mimeType: 'image/jpg'},
        {_id: "12aa7000abcdabcdabcdabcd", fileName: '12_7.jpg', fileOriginalName: '12_7.jpg', mimeType: 'image/jpg'},
        {_id: "16aa6000abcdabcdabcdabcd", fileName: '16_6.jpg', fileOriginalName: '16_6.jpg', mimeType: 'image/jpg'},
        {_id: "1aaa7000abcdabcdabcdabcd", fileName: '1_7.jpg', fileOriginalName: '1_7.jpg', mimeType: 'image/jpg'},
        {_id: "2aaa7000abcdabcdabcdabcd", fileName: '2_7.jpg', fileOriginalName: '2_7.jpg', mimeType: 'image/jpg'},
        {_id: "3aaa7000abcdabcdabcdabcd", fileName: '3_7.jpg', fileOriginalName: '3_7.jpg', mimeType: 'image/jpg'},
        {_id: "4aaa8000abcdabcdabcdabcd", fileName: '4_8.jpg', fileOriginalName: '4_8.jpg', mimeType: 'image/jpg'},
        {_id: "5aaa7000abcdabcdabcdabcd", fileName: '5_7.jpg', fileOriginalName: '5_7.jpg', mimeType: 'image/jpg'},
        {_id: "6aaa7000abcdabcdabcdabcd", fileName: '6_7.jpg', fileOriginalName: '6_7.jpg', mimeType: 'image/jpg'},
        {_id: "7aaa7000abcdabcdabcdabcd", fileName: '7_7.jpg', fileOriginalName: '7_7.jpg', mimeType: 'image/jpg'},
        {_id: "8aaa7000abcdabcdabcdabcd", fileName: '8_7.jpg', fileOriginalName: '8_7.jpg', mimeType: 'image/jpg'},
        {_id: "9aaa8000abcdabcdabcdabcd", fileName: '9_8.jpg', fileOriginalName: '9_8.jpg', mimeType: 'image/jpg'},
        {_id: "16aa7000abcdabcdabcdabcd", fileName: '16_7.jpg', fileOriginalName: '16_7.jpg', mimeType: 'image/jpg'},
        {_id: "1aaa8000abcdabcdabcdabcd", fileName: '1_8.jpg', fileOriginalName: '1_8.jpg', mimeType: 'image/jpg'},
        {_id: "2aaa8000abcdabcdabcdabcd", fileName: '2_8.jpg', fileOriginalName: '2_8.jpg', mimeType: 'image/jpg'},
        {_id: "3aaa8000abcdabcdabcdabcd", fileName: '3_8.jpg', fileOriginalName: '3_8.jpg', mimeType: 'image/jpg'},
        {_id: "4aaa9000abcdabcdabcdabcd", fileName: '4_9.jpg', fileOriginalName: '4_9.jpg', mimeType: 'image/jpg'},
        {_id: "5aaa8000abcdabcdabcdabcd", fileName: '5_8.jpg', fileOriginalName: '5_8.jpg', mimeType: 'image/jpg'},
        {_id: "7aaa8000abcdabcdabcdabcd", fileName: '7_8.jpg', fileOriginalName: '7_8.jpg', mimeType: 'image/jpg'},
        {_id: "8aaa5000abcdabcdabcdabcd", fileName: '8_5.jpg', fileOriginalName: '8_5.jpg', mimeType: 'image/jpg'},
        {_id: "9aa10000abcdabcdabcdabcd", fileName: '9_10.jpg', fileOriginalName: '9_10.jpg', mimeType: 'image/jpg'},
        {_id: "11aa8000abcdabcdabcdabcd", fileName: '11_8.jpg', fileOriginalName: '11_8.jpg', mimeType: 'image/jpg'},
        {_id: "14aa8000abcdabcdabcdabcd", fileName: '14_8.jpg', fileOriginalName: '14_8.jpg', mimeType: 'image/jpg'},
        {_id: "15aa8000abcdabcdabcdabcd", fileName: '15_8.jpg', fileOriginalName: '15_8.jpg', mimeType: 'image/jpg'},
        {_id: "2aaa9000abcdabcdabcdabcd", fileName: '2_9.jpg', fileOriginalName: '2_9.jpg', mimeType: 'image/jpg'},
        {_id: "5aa10000abcdabcdabcdabcd", fileName: '5_10.jpg', fileOriginalName: '5_10.jpg', mimeType: 'image/jpg'},
        {_id: "6aaa9000abcdabcdabcdabcd", fileName: '6_9.jpg', fileOriginalName: '6_9.jpg', mimeType: 'image/jpg'},
        {_id: "8aaa9000abcdabcdabcdabcd", fileName: '8_9.jpg', fileOriginalName: '8_9.jpg', mimeType: 'image/jpg'},
        {_id: "10aa8000abcdabcdabcdabcd", fileName: '10_8.jpg', fileOriginalName: '10_8.jpg', mimeType: 'image/jpg'},
        {_id: "11aa9000abcdabcdabcdabcd", fileName: '11_9.jpg', fileOriginalName: '11_9.jpg', mimeType: 'image/jpg'},
        {_id: "13a10000abcdabcdabcdabcd", fileName: '13_10.jpg', fileOriginalName: '13_10.jpg', mimeType: 'image/jpg'},
        {_id: "14aa9000abcdabcdabcdabcd", fileName: '14_9.jpg', fileOriginalName: '14_9.jpg', mimeType: 'image/jpg'},
        {_id: "16aa9000abcdabcdabcdabcd", fileName: '16_9.jpg', fileOriginalName: '16_9.jpg', mimeType: 'image/jpg'},
        {_id: "1aa10000abcdabcdabcdabcd", fileName: '1_10.jpg', fileOriginalName: '1_10.jpg', mimeType: 'image/jpg'},
        {_id: "6aa10000abcdabcdabcdabcd", fileName: '6_10.jpg', fileOriginalName: '6_10.jpg', mimeType: 'image/jpg'},
        {_id: "7aa10000abcdabcdabcdabcd", fileName: '7_10.jpg', fileOriginalName: '7_10.jpg', mimeType: 'image/jpg'},
        {_id: "8aa10000abcdabcdabcdabcd", fileName: '8_10.jpg', fileOriginalName: '8_10.jpg', mimeType: 'image/jpg'},
        {_id: "10a10000abcdabcdabcdabcd", fileName: '10_10.jpg', fileOriginalName: '10_10.jpg', mimeType: 'image/jpg'},
        {_id: "11a10000abcdabcdabcdabcd", fileName: '11_10.jpg', fileOriginalName: '11_10.jpg', mimeType: 'image/jpg'},
        {_id: "12a10000abcdabcdabcdabcd", fileName: '12_10.jpg', fileOriginalName: '12_10.jpg', mimeType: 'image/jpg'},

    ]

    db.orientationTestImage.insertMany(images, (err) => {
        if (err && err.code!=11000) console.error(err.message);
    })

    return db.content.insertMany(tests, (err) => {
        if (err && err.code!=11000) console.error(err.message);
    })


}
