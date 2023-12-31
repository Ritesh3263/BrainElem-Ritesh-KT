
// Function for detecting how similar are the strings
export function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
// Helper function for similarity
function editDistance(s1, s2) {
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}


// extensions
function ArrayExtensions() {
    // extension class
}
{
    Array.prototype.insertElementAt = function (element, index) {
        this.splice(index, 0, element);
    }

    Array.prototype.insertElementsAt = function (elements, index) {
        for (var i = 0; i < elements.length; i++) {
            this.splice(index + i, 0, elements[i]);
        }
    }

    Array.prototype.removeAt = function (index) {
        this.splice(index, 1);
    }
}

// classes

export function TextDifferencer() {
    // do nothing
}
{
    TextDifferencer.prototype.findDifferencesBetweenStrings = function (string0, string1) {
        var lengthOfShorterString =
            (string0.length <= string1.length ? string0.length : string1.length);

        var numberOfExtremes = 2;
        var passagePairsMatchingAtExtremes = [];

        for (var e = 0; e < numberOfExtremes; e++) {
            var lengthOfMatchingSubstring = 0;

            for (var i = 0; i < lengthOfShorterString; i++) {
                var offsetForString0 = (e == 0 ? i : string0.length - i - 1);
                var offsetForString1 = (e == 0 ? i : string1.length - i - 1);

                var charFromString0 = string0[offsetForString0];
                var charFromString1 = string1[offsetForString1];

                if (charFromString0 != charFromString1) {
                    lengthOfMatchingSubstring = i;
                    break;
                }
            }

            var matchingSubstringAtExtreme;

            if (e == 0) {
                matchingSubstringAtExtreme = string0.substr(0, lengthOfMatchingSubstring);
                string0 = string0.substr(lengthOfMatchingSubstring);
                string1 = string1.substr(lengthOfMatchingSubstring);
            } else // if (e == 1)
            {
                matchingSubstringAtExtreme = string0.substr(string0.length - lengthOfMatchingSubstring);
                string0 = string0.substr(0, string0.length - lengthOfMatchingSubstring);
                string1 = string1.substr(0, string1.length - lengthOfMatchingSubstring);
            }

            var passagePairMatchingAtExtreme = new TextPassagePair
                (
                    true, // doPassagesMatch
                    [
                        new TextPassage(matchingSubstringAtExtreme),
                        new TextPassage(matchingSubstringAtExtreme),
                    ]
                );

            passagePairsMatchingAtExtremes.push
                (
                    passagePairMatchingAtExtreme
                );
        }

        var passagePairsAll = [];

        var passagePairsMatching = this.findPassagePairsMatchingBetweenStrings
            (
                string0, string1, [0, 0]
            );

        this.insertPassagePairsDifferentBetweenMatching
            (
                string0,
                string1,
                passagePairsMatching,
                passagePairsAll
            );

        for (var e = 0; e < passagePairsMatchingAtExtremes.length; e++) {
            var passagePairMatchingAtExtreme = passagePairsMatchingAtExtremes[e];
            passagePairsAll.insertElementAt
                (
                    passagePairMatchingAtExtreme,
                    (e == 0 ? 0 : passagePairsAll.length)
                );
        }

        var returnValue = new TextDifferences(passagePairsAll);

        return returnValue;
    }

    TextDifferencer.prototype.findPassagePairsMatchingBetweenStrings = function
        (
            string0, string1, positionOffsets
        ) {
        var passagePairsMatching = [];

        var longestCommonPassagePair = this.findLongestCommonPassagePair
            (
                string0,
                string1
            );

        var longestCommonPassageText = longestCommonPassagePair.passages[0].text;
        var lengthOfCommonPassage = longestCommonPassageText.length;

        if (lengthOfCommonPassage == 0) {
            return passagePairsMatching;
        }

        passagePairsMatching.push(longestCommonPassagePair);

        var passages = longestCommonPassagePair.passages;
        var passage0 = passages[0];
        var passage1 = passages[1];

        var passagePairsMatchingBeforeCommon = this.findPassagePairsMatchingBetweenStrings
            (
                string0.substr(0, passage0.position),
                string1.substr(0, passage1.position),
                [
                    positionOffsets[0],
                    positionOffsets[1]
                ]
            );

        var passagePairsMatchingAfterCommon = this.findPassagePairsMatchingBetweenStrings
            (
                string0.substr
                    (
                        passage0.position + lengthOfCommonPassage
                    ),
                string1.substr
                    (
                        passage1.position + lengthOfCommonPassage
                    ),
                [
                    positionOffsets[0]
                    + passage0.position
                    + lengthOfCommonPassage,

                    positionOffsets[1]
                    + passage1.position
                    + lengthOfCommonPassage
                ]
            );

        var passagePairSetsMatchingBeforeAndAfter =
            [
                passagePairsMatchingBeforeCommon,
                passagePairsMatchingAfterCommon
            ];

        for (var i = 0; i < passagePairSetsMatchingBeforeAndAfter.length; i++) {
            var passagePairsToInsert = passagePairSetsMatchingBeforeAndAfter[i];
            passagePairsMatching.insertElementsAt
                (
                    passagePairsToInsert,
                    (i == 0 ? 0 : passagePairsMatching.length)
                );
        }

        for (var i = 0; i < longestCommonPassagePair.passages.length; i++) {
            var passage = longestCommonPassagePair.passages[i];
            passage.position += positionOffsets[i];
        }

        return passagePairsMatching;
    }

    TextDifferencer.prototype.findLongestCommonPassagePair = function (string0, string1) {
        var passage0 = new TextPassage("", 0);
        var passage1 = new TextPassage("", 0);

        var returnValue = new TextPassagePair
            (
                true, // doPassagesMatch
                [
                    passage0, passage1
                ]
            );

        var lengthOfString0 = string0.length;
        var lengthOfString1 = string1.length;

        var substringLengthsForRow = null;
        var substringLengthsForRowPrev;

        var lengthOfLongestCommonSubstringSoFar = 0;
        var longestCommonSubstringsSoFar = "";
        var cellIndex = 0;

        // Build a table whose y-axis is chars from string0,
        // and whose x-axis is chars from string1.
        // Put length of the longest substring in each cell.

        for (var i = 0; i < lengthOfString0; i++) {
            substringLengthsForRowPrev = substringLengthsForRow;
            substringLengthsForRow = [];

            for (var j = 0; j < lengthOfString1; j++) {
                if (string0[i] != string1[j]) {
                    substringLengthsForRow[j] = 0;
                }
                else {
                    var cellValue;

                    if (i == 0 || j == 0) {
                        // first row or column
                        cellValue = 1;
                    }
                    else {
                        // Copy cell to upper left, add 1.
                        cellValue = substringLengthsForRowPrev[j - 1] + 1;
                    }

                    substringLengthsForRow[j] = cellValue;

                    if (cellValue > lengthOfLongestCommonSubstringSoFar) {
                        lengthOfLongestCommonSubstringSoFar = cellValue;
                        var startIndex = i - lengthOfLongestCommonSubstringSoFar + 1;
                        var longestCommonSubstringSoFar = string0.substring // not "substr"!
                            (
                                startIndex,
                                i + 1
                            );

                        passage0.text = longestCommonSubstringSoFar;
                        passage0.position = startIndex;

                        passage1.text = longestCommonSubstringSoFar;
                        passage1.position = j - lengthOfLongestCommonSubstringSoFar + 1;
                    }
                }
            }
        }

        return returnValue;
    }

    TextDifferencer.prototype.insertPassagePairsDifferentBetweenMatching = function
        (
            string0,
            string1,
            passagePairsToInsertBetween,
            passagePairsAll
        ) {
        passagePairsToInsertBetween.insertElementAt
            (
                new TextPassagePair
                    (
                        true, // doPassagesMatch
                        [
                            new TextPassage("", 0),
                            new TextPassage("", 0)
                        ]
                    ),
                0
            );

        passagePairsToInsertBetween.push
            (
                new TextPassagePair
                    (
                        true, // doPassagesMatch
                        [
                            new TextPassage("", string0.length),
                            new TextPassage("", string1.length)
                        ]
                    )
            );

        var pMax = passagePairsToInsertBetween.length - 1;

        for (var p = 0; p < pMax; p++) {
            var passagePairToInsertAfter = passagePairsToInsertBetween[p];
            var passagePairToInsertBefore = passagePairsToInsertBetween[p + 1];

            this.buildAndInsertPassagePairBetweenExisting
                (
                    string0,
                    string1,
                    passagePairToInsertBefore,
                    passagePairToInsertAfter,
                    passagePairsAll
                );

            passagePairsAll.push(passagePairToInsertBefore);
        }

        var indexOfPassagePairFinal = passagePairsAll.length - 1;

        var passagePairFinal = passagePairsAll[indexOfPassagePairFinal];

        if
            (
            passagePairFinal.doPassagesMatch == true
            && passagePairFinal.passages[0].text.length == 0
        ) {
            passagePairsAll.removeAt(indexOfPassagePairFinal, 1);
        }
    }

    TextDifferencer.prototype.buildAndInsertPassagePairBetweenExisting = function
        (
            string0,
            string1,
            passagePairToInsertBefore,
            passagePairToInsertAfter,
            passagePairsAll
        ) {
        var lengthOfPassageToInsertAfter = passagePairToInsertAfter.passages[0].text.length;

        var positionsForPassagePairDifferent =
            [
                [
                    passagePairToInsertAfter.passages[0].position
                    + lengthOfPassageToInsertAfter,

                    passagePairToInsertAfter.passages[1].position
                    + lengthOfPassageToInsertAfter
                ],
                [
                    passagePairToInsertBefore.passages[0].position,
                    passagePairToInsertBefore.passages[1].position
                ]
            ];

        var passageToInsert0 = new TextPassage
            (
                string0.substring // not "substr"!
                    (
                        positionsForPassagePairDifferent[0][0],
                        positionsForPassagePairDifferent[1][0]
                    ),
                positionsForPassagePairDifferent[0][0]
            );

        var passageToInsert1 = new TextPassage
            (
                string1.substring  // not "substr"!
                    (
                        positionsForPassagePairDifferent[0][1],
                        positionsForPassagePairDifferent[1][1]
                    ),
                positionsForPassagePairDifferent[0][1]
            );

        var passagePairToInsert = new TextPassagePair
            (
                false, // doPassagesMatch
                [
                    passageToInsert0,
                    passageToInsert1
                ]
            );

        if
            (
            passagePairToInsert.passages[0].text.length > 0
            || passagePairToInsert.passages[1].text.length > 0
        ) {
            passagePairsAll.push(passagePairToInsert);
        }

    }
}

function TextDifferences(passagePairs) {
    this.passagePairs = passagePairs;
}
{
    // instance methods

    TextDifferences.prototype.toString = function () {
        var returnValue = "";

        for (var p = 0; p < this.passagePairs.length; p++) {
            var passagePair = this.passagePairs[p];
            var passagePairAsString = passagePair.toString();

            returnValue += passagePairAsString;
        }

        return returnValue;
    }

}

function TextPassage(text, position) {
    this.text = text;
    this.position = position;
}

function TextPassagePair(doPassagesMatch, passages) {
    this.doPassagesMatch = doPassagesMatch;
    this.passages = passages;
}
{
    TextPassagePair.prototype.toString = function () {
        var returnValue = "";

        if (this.doPassagesMatch == true) {
            returnValue = this.passages[0].text;
            returnValue = this.escapeStringForHTML(returnValue);
        }
        else {
            returnValue += "<mark style='background-color:#ff3333'>";
            returnValue += this.escapeStringForHTML(this.passages[0].text);
            returnValue += "</mark><mark style='background-color:yellow'>";
            returnValue += this.escapeStringForHTML(this.passages[1].text);
            returnValue += "</mark>";

        }

        return returnValue;
    }

    TextPassagePair.prototype.escapeStringForHTML = function (stringToEscape) {
        var returnValue = stringToEscape.replace
            (
                "&", "&amp;"
            ).replace
            (
                "<", "&lt;"
            ).replace
            (
                ">", "&gt;"
            ).replace
            (
                "\n", "<br />"
            );

        return returnValue;
    }
}
