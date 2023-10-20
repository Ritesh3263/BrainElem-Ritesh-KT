// Functions to generate fake results for BrainCore Test

const { number } = require("prop-types");

// Possible answers
const ANSWERS = [1, 2, 3, 4, 5, 6]



// Get random index based on probabilities
function getRandomIndex(probabilities) {
    var random = Math.random(),
        i;
        
    for (i = 0; i < probabilities.length; i++) {
        if (random < probabilities[i]) return i;
        random -= probabilities[i];
    }
    return probabilities.length - 1;
}


// Get random answer value(string) for question on BrainCore Test
//
// range - range of answers values to be used
//         by defult it will use full range of answers from 1 to 6
//         Can be:
//         - low - only 1 and 2 answers
//         - medium - only 3 and 4 answers
//         - high - only 5 and 6 answers
// revert - when true it will revert the value
function random(range, revert=false) { // min and max included
    // Default
    var probabilities = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]
    if (range=='low')         probabilities = [0.3, 0.3, 0.2, 0.1, 0.05, 0.05]// 80% low and very low
    else if (range=='medium') probabilities = [0.05, 0.05, 0.4, 0.4, 0.05, 0.05]// 80% medium
    else if (range=='high')   probabilities = [0.05, 0.05, 0.1, 0.2, 0.3, 0.3]// // 80% high and very high
    

    var index = getRandomIndex(probabilities)
    let answer = ANSWERS[index]
    
    if (revert) answer = 7 - answer
    return answer.toString()
}


exports.randomAnswersForBrainCoreAdultTest = (range) => {
    // Questions for need-for-independence are reverted
    return {
        "100": "FR",
        "9992": "1",
        "9993": "3",
        "9994": "1",
        "9995": "4",
        "9996": "1",
        "10007": random(range),
        "10013": random(range),
        "10015": random(range, true),
        "10023": random(range),
        "10025": random(range),
        "10027": random(range),
        "10039": random(range),
        "10041": random(range),
        "10045": random(range),
        "10049": random(range),
        "10051": random(range),
        "10069": random(range),
        "10071": random(range),
        "10073": random(range),
        "10077": random(range),
        "10079": random(range),
        "10083": random(range),
        "10085": random(range),
        "10093": random(range),
        "10105": random(range),
        "10107": random(range),
        "10109": random(range),
        "10111": random(range, true),
        "10113": random(range),
        "10115": random(range),
        "10117": random(range),
        "10123": random(range),
        "10129": random(range),
        "10139": random(range),
        "10143": random(range),
        "10145": random(range),
        "10149": random(range),
        "10151": random(range),
        "10153": random(range),
        "10159": random(range, true),
        "10161": random(range),
        "10163": random(range),
        "10165": random(range),
        "10167": random(range),
        "10173": random(range),
        "10175": random(range),
        "10177": random(range),
        "10181": random(range),
        "10183": random(range),
        "10191": random(range),
        "10193": random(range),
        "10197": random(range),
        "10201": random(range),
        "10203": random(range),
        "10223": random(range),
        "10225": random(range),
        "10227": random(range),
        "10237": random(range),
        "10243": random(range),
        "10245": random(range),
        "10247": random(range),
        "10251": random(range),
        "10253": random(range),
        "10255": random(range, true),
        "10259": random(range),
        "10265": random(range),
        "10267": random(range),
        "10275": random(range),
        "10277": random(range),
        "10283": random(range),
        "10289": random(range),
        "10291": random(range),
        "10293": random(range),
        "10301": random(range),
        "10305": random(range),
        "10309": random(range),
        "10311": random(range),
        "10315": random(range),
        "10319": random(range),
        "10321": random(range),
        "10323": random(range),
        "10325": random(range),
        "10327": random(range),
        "10329": random(range),
        "10331": random(range),
        "10333": random(range),
        "10335": random(range),
        "10345": random(range),
        "10349": random(range),
        "10351": random(range, true),
        "10353": random(range),
        "10361": random(range),
        "10365": random(range),
        "10371": random(range),
        "10375": random(range),
        "10377": random(range),
        "10381": random(range),
        "10385": random(range),
        "10387": random(range),
        "10393": random(range),
        "10395": random(range),
        "10399": random(range, true),
        "10403": random(range),
        "10407": random(range),
        "10413": random(range),
        "10415": random(range),
        "10419": random(range),
        "10425": random(range),
        "10427": random(range),
        "10431": random(range),
        "10433": random(range),
        "10439": random(range),
        "10443": random(range),
        "10445": random(range),
        "10447": random(range, true),
        "10451": random(range),
        "10453": random(range),
        "10457": random(range),
        "10461": random(range),
        "10467": random(range),
        "10473": random(range),
        "10477": random(range),
        "10479": random(range),
        "10483": random(range),
        "10485": random(range),
        "10487": random(range),
        "10489": random(range),
        "10497": random(range),
        "10501": random(range),
        "10503": random(range),
        "10507": random(range),
        "10511": random(range),
        "10513": random(range),
        "10519": random(range),
        "10523": random(range),
        "10535": random(range),
        "10539": random(range),
        "10541": random(range),
        "10545": random(range),
        "10551": random(range),
        "10553": random(range),
        "10561": random(range),
        "10571": random(range),
        "10575": random(range),
        "10577": random(range),
        "10581": random(range)
    }
}



exports.randomAnswersForBrainCorePedagogyTest = (range) => {
    // Questions for need-for-independence are reverted
    return {
        "100": "FR",
        '2607': '2',
        '2608': '16',
        '2609': '3',
        '2610': '1',
        '2612': random(range),
        '2613': random(range),
        '2614': random(range),
        '2615': random(range),
        '2616': random(range),
        '2617': random(range),
        '2618': random(range),
        '2619': random(range, true),
        '2620': random(range),
        '2622': random(range),
        '2623': random(range),
        '2624': random(range),
        '2625': random(range),
        '2626': random(range),
        '2627': random(range),
        '2628': random(range, true),
        '2629': random(range),
        '2630': random(range),
        '2632': random(range),
        '2633': random(range),
        '2634': random(range),
        '2635': random(range),
        '2636': random(range),
        '2637': random(range, true),
        '2638': random(range),
        '2640': random(range),
        '2641': random(range),
        '2642': random(range),
        '2643': random(range),
        '2644': random(range),
        '2645': random(range),
        '2646': random(range),
        '2647': random(range, true),
        '2648': random(range),
        '2650': random(range),
        '2651': random(range),
        '2652': random(range),
        '2653': random(range),
        '2654': random(range),
        '2655': random(range),
        '2656': random(range),
        '2657': random(range),
        '2658': random(range),
        '2660': random(range),
        '2661': random(range),
        '2662': random(range),
        '2663': random(range),
        '2664': random(range),
        '2665': random(range),
        '2666': random(range),
        '2667': random(range),
        '2668': random(range),
        '2670': random(range),
        '2671': random(range),
        '2672': random(range),
        '2673': random(range),
        '2674': random(range),
        '2675': random(range),
        '2676': random(range),
        '2677': random(range),
        '2678': random(range),
        '2679': random(range),
        '2680': random(range),
        '2681': random(range),
        '2683': random(range),
        '2684': random(range),
        '2685': random(range),
        '2686': random(range),
        '2687': random(range),
        '2688': random(range),
        '2689': random(range),
        '2690': random(range),
        '2692': random(range),
        '2693': random(range),
        '2694': random(range),
        '2695': random(range),
        '2697': random(range),
        '2698': random(range),
        '2699': random(range),
        '2700': random(range),
        '2701': random(range),
        '2702': random(range),
        '2703': random(range),
        '2704': random(range),
        '2705': random(range, true),
        '2707': random(range),
        '2708': random(range),
        '2709': random(range),
        '2710': random(range),
        '2711': random(range),
        '2712': random(range),
        '2714': random(range),
        '2715': random(range),
        '2716': random(range),
        '2717': random(range),
        '2718': random(range, true)
    }
}