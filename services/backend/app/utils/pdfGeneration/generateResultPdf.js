const Result = require("../../models/result.model");
const User = require("../../models/user.model");
const fsp = require("fs").promises;
var fs = require('fs');
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const path = require("path");
const moment = require("moment-timezone");

const ResultUtils = require("../result");
const cognitiveUtils = require("../cognitive");
const {adultTestsIds, pedagogyTestsIds} = require("../braincoreTestsIds");

// static Images
const trees = {
  'level-1': 'https://cloud.braincore.ch/s/qbXqapKynrpW3kH/preview',
  'level-2': 'https://cloud.braincore.ch/s/gRnBpjQHfLKABQr/preview',
  'level-3': 'https://cloud.braincore.ch/s/PW8WpapsDxekgmn/preview',
  'level-4': 'https://cloud.braincore.ch/s/HxncoE96Y6MySpg/preview',
  'level-5': 'https://cloud.braincore.ch/s/yks9i4DCsgXyZ2A/preview'
};
const nads = {
  'A1': "https://cloud.braincore.ch/s/rKC37cRzcJ7oRQS/preview",
  'A2': "https://cloud.braincore.ch/s/RHC8Enf8e5LrcnD/preview",
  "D": "https://cloud.braincore.ch/s/TCgfoQeigB4ZRbe/preview",
  "N1": "https://cloud.braincore.ch/s/34rrenNwee9tj5f/preview",
  "N2": "https://cloud.braincore.ch/s/9dLtZsLFnsPc3bk/preview"
}

const traits = {
	'assert': "https://cloud.braincore.ch/s/N9qN6sbqFqrzGPR/preview",
	'leader': "https://cloud.braincore.ch/s/366Pap6naamwHcY/preview",
	'inter-relation': "https://cloud.braincore.ch/s/MLdNKc6jZ72dSpK/preview",
	'meditation': "https://cloud.braincore.ch/s/Df3tEkiwjnsxStM/preview",
	'respect': "https://cloud.braincore.ch/s/o4cTj2dgnfseSkc/preview",
	'empathy': "https://cloud.braincore.ch/s/TnG8TEG9Fdq9EQY/preview",
	'emo-distance': "https://cloud.braincore.ch/s/d8mgzsy6r5MaXBy/preview",
	'stress-manage': "https://cloud.braincore.ch/s/WqYRSfMoFBWew4y/preview",
	'self-control': "https://cloud.braincore.ch/s/caBBfBSKTg7PiH8/preview",
	'mastery': "https://cloud.braincore.ch/s/yWEx5nEHSgFKNK4/preview",
	'self-esteem': "https://cloud.braincore.ch/s/rZmKBd523XcJnLG/preview",
	'risk-taking': "https://cloud.braincore.ch/s/GsyPppbT93tAJXF/preview",
	'intra-intel': "https://cloud.braincore.ch/s/pXY5494kC335Dt5/preview",
	'personal-dev': "https://cloud.braincore.ch/s/qaDDkioqjq8wG7n/preview",
	'achievements': "https://cloud.braincore.ch/s/oZyqSNASGjNqP4D/preview",
	'collaboration': "https://cloud.braincore.ch/s/qcTdTHFsFNLDTDD/preview",
	'communication': "https://cloud.braincore.ch/s/FPMoCnP3Z3Wdfj7/preview",
	'creativity': "https://cloud.braincore.ch/s/yNEaEPZXwzaxpoM/preview",
	'critical': "https://cloud.braincore.ch/s/Ld6PneBHHkRBg8D/preview",
}

const eduReportPictures = {
  'N1' : 'https://cloud.braincore.ch/s/Dqc5YD6DNm8iBst/preview',
  'N2' : 'https://cloud.braincore.ch/s/n8zjm6P75WPGb66/preview',
  'A1' : 'https://cloud.braincore.ch/s/wi243CPterfao7W/preview',
  'A2' : 'https://cloud.braincore.ch/s/cmqKHeEXfnJM7ag/preview',
  'D' : 'https://cloud.braincore.ch/s/i2gfTonrLGQYmAw/preview',
  'ssf' : 'https://cloud.braincore.ch/s/yoBRTW5Wt3s7KyQ/preview',
  'emo' : 'https://cloud.braincore.ch/s/6gJrE8MBBW4Nimi/preview',
  'isf' : 'https://cloud.braincore.ch/s/yoBRTW5Wt3s7KyQ/preview'
}

const bigTrees = {
  'level-1' : 'https://cloud.braincore.ch/s/F8YEyNL2kqFPZ6N/preview',
  'level-2' : 'https://cloud.braincore.ch/s/d8qJTqr5pZt59BA/preview',
  'level-3' : 'https://cloud.braincore.ch/s/fgRgcB7zCjENoin/preview',
  'level-4' : 'https://cloud.braincore.ch/s/Z5reWfMRDxyWXsd/preview',
  'level-5' : 'https://cloud.braincore.ch/s/ckACJi6CLsbQRNo/preview',
}

const priorityIcons = {
  '1' : 'https://cloud.braincore.ch/s/2t8cpafYRs8aiLG/preview',
  '2' : 'https://cloud.braincore.ch/s/6LyetoPsqNEbBXE/preview',
  '3' : 'https://cloud.braincore.ch/s/LqpBwL6oSnLfAgA/preview'
}

const eduProfilePicturesList = {
  '1' : 'processor',
  '2' : 'magician',
  '3' : 'performer',
  '4' : 'defender',
  '5' : 'critic',
  '6' : 'attendant',
  '7' : 'agent',
  '8' : 'entrepreneur',
}

const eduProfilePicturesMale = {
  'agent' : 'https://cloud.braincore.ch/s/KbZnbSnFxkqP5gE/preview', 
  'attendant' : 'https://cloud.braincore.ch/s/5Ap8YLQp3DM3wej/preview',
  'critic' : 'https://cloud.braincore.ch/s/r55KP4gXd7c2FMF/preview',
  'defender' : 'https://cloud.braincore.ch/s/cc96pSPCWFDBB65/preview',
  'entrepreneur' : 'https://cloud.braincore.ch/s/gsKnoKNnsqJ6ZqD/preview',
  'magician' : 'https://cloud.braincore.ch/s/A6WeiLrmaiedy7B/preview',
  'performer' : 'https://cloud.braincore.ch/s/FwQMB79FZYYkAyC/preview',
  'processor' : 'https://cloud.braincore.ch/s/SDJJsdPerCkZKX5/preview'
}

const eduProfilePicturesFemale = {
  'agent' : 'https://cloud.braincore.ch/s/bB3gFj29FJbeqKd/preview',
  'attendant' : 'https://cloud.braincore.ch/s/JnNrQKNjkAwt7DC/preview',
  'critic' : 'https://cloud.braincore.ch/s/7HkmnJeAJbbe5y4/preview',
  'defender' : 'https://cloud.braincore.ch/s/FkgM8LySWdGfRS5/preview',
  'entrepreneur' : 'https://cloud.braincore.ch/s/reJrr6EiQFMbKfe/preview',
  'magician' : 'https://cloud.braincore.ch/s/R2Wn5tt3rBNpiAF/preview',
  'performer' : 'https://cloud.braincore.ch/s/WwcnmFqTnRYryN7/preview',
  'processor' : 'https://cloud.braincore.ch/s/8HDKXoKCcRpjo6b/preview'
}

handlebars.registerHelper('breaklines', function(text) {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new handlebars.SafeString(text);
});

handlebars.registerHelper('getNadDetails', function(nad) {
	return nads[nad];
});

handlebars.registerHelper('getTraitIcon', function(trait) {
	return traits[trait];
});

handlebars.registerHelper('formatDate', function(date, format, timezone = 'Europe/Paris') {
  if (!timezone || typeof timezone !== 'string') {
    timezone = 'Europe/Paris';
  }
  return moment(new Date(date)).tz(timezone).format(format);
});

// To get Tree image
handlebars.registerHelper('getTree', function(level, trees) {
  return trees[`level-${level}`];
})

handlebars.registerHelper('getMinMaxValue', function(value, min, max) {
	if (value < min) return min;
	else if (value > max) return max;
	else return value;
});

// To get strongest or weakest Nad image url
handlebars.registerHelper('getStrongWeakNad', function(traits, type, nads) {
  if (type == 'strong') {
    type ='highestDefinition';
  } else {
    type = 'lowestDefinition';
  }
  for (const key in traits) {
    if (traits[key][type]) {
      return nads[traits[key].abbreviation];
    }
  }
})

handlebars.registerHelper('normalizedValue', function(value) {
if(value<1){
  value=1;
}
if(value>10){
  value=10;
}
return (value*10)-10;
  
});

handlebars.registerHelper('getPercentValue', function(max,min,type) {
  let tempMax=max;
  let tempMin=min;
  if(max > 10){
    max=10;
  }
  if(max < 0){
    max=0;
  }

  if(min<1){
    min=1;
  }
  var tmax,tmin;
  if(type=="max"){
    if(max>10){
      return 100
    }
    if(max < 1){
      return 0;
    }
   tmax=((max-min)*10);
   delta=tmax/10;
   tmax=tmax+delta;
   
    return tmax;
    
  }else if(type=="min"){
    if(min<1){
      return 0;
    }
    tmin= (min*10)-10;
    delta=tmin/10;
    return tmin+delta;
  }else{

    
    const norm=(tempMax+tempMin)/2;
    if(tempMin<1 || tempMax>10 ){
      if (norm<1){
        return 0;
      }
      if (norm >10){
        return 100;
      }
      let tnorm=(norm*10)-10;
      delta=tnorm/10;
      return tnorm+delta;
    }
    return ((norm-tempMin)*100)/(tempMax-tempMin);

  
    
  }
});

const getNadPageNumber = (nad, tableOfContents) => {
  const nadPages = tableOfContents[1].subpages;
  const currentNad = nadPages.find(obj => obj.title == nad);
  return Number(currentNad.page);
}
handlebars.registerHelper('getNadPageNumber', function(nad, tableOfContents) {
  return getNadPageNumber(nad, tableOfContents);
});

handlebars.registerHelper('getNadSubpageNumber', function(nad, tableOfContents, number) {
  const currentPage = getNadPageNumber(nad, tableOfContents);
  return currentPage + number;
});

handlebars.registerHelper('subtract', function(total, value) {
  return total - value;
});

handlebars.registerHelper('getProperDescription', function(globalData, traitName) {
  if(globalData[traitName]['normalizedValue'] > 5.5) return globalData[traitName]['high'];
  return globalData[traitName]['low'];
});

//ByNameFromGlobalObject
handlebars.registerHelper('getTraitByKey', function(globalData, traitName, param) {
  if(traitName=='staticTexts') {
    const getText = globalData[traitName][param];
    text = handlebars.Utils.escapeExpression(getText);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new handlebars.SafeString(text);
  } 
  if(param=='high' || param=='low' || param=='description' || param=='extra') {
    const getList = globalData[traitName][param];
    return new handlebars.SafeString(getList);
  }
  return globalData[traitName][param];
});

handlebars.registerHelper('getEduPageNumber', function(index, nadFix, firstPage, multiplier) {
  return firstPage + multiplier*index + nadFix;
});

handlebars.registerHelper('getEduPic', function(name) {
  const url = eduReportPictures[name];
  return url;
});

handlebars.registerHelper('getSolutionIcon', function(level) {
  const url = priorityIcons[level];
  return url;
});

handlebars.registerHelper('readHtmlInside', function(name) {
  return new handlebars.SafeString(name);
});


handlebars.registerHelper('splitSolutions', function(solutions, maxPerPage, page) {
  const tables = [];
  tables.push(solutions.slice(0, 2));
  for (let i = 2; i < solutions.length; i += maxPerPage) {
    tables.push(solutions.slice(i, i + maxPerPage));
  }
  return tables[page];
});

handlebars.registerHelper('splitProfileDescription', function(description, maxChars, page) {
  let spaceBefore = description.lastIndexOf(' ', maxChars);
  let spaceAfter = description.indexOf(' ', maxChars);

  let splitPoint;
  if (spaceBefore === -1) {
    splitPoint = spaceAfter;
  } else if (spaceAfter === -1) {
    splitPoint = spaceBefore + 1;
  } else {
    splitPoint =
    maxChars - spaceBefore < spaceAfter - maxChars ? spaceBefore + 1 : spaceAfter;
  }
  const separated = [];
  separated[0] = description.slice(0, splitPoint);
  separated[1] = description.slice(splitPoint);
  return separated[page];
});

handlebars.registerHelper('getEduProfilePic', function(profileId, gender) {
  const profileName = eduProfilePicturesList[profileId];
  if(gender=='male') {
    return eduProfilePicturesMale[profileName];
  } else {
    return eduProfilePicturesFemale[profileName];
  }
});

handlebars.registerHelper('stripWhitespacesFromString', function(string) {
  return string.string.replace(/\s*(<li>)\s*/g, '$1');
});

handlebars.registerHelper('fixNadAbbreviation', function(inputString) {
  if (inputString.length >= 2) {
    return inputString.replace(/^(.)(.)/, '$1<sub>$2</sub>');
  } else {
    return inputString;
  }
});

handlebars.registerHelper('fixTipAlignment', function(tipTitle) {
  if(tipTitle.length <= 48) {
    return "pad37";
  } else {
    return "pad75";
  }
});

handlebars.registerHelper('roundValue', function(value) {
  return value.toFixed(1);
});

handlebars.registerHelper('mapQnadValue', function(value) {
  return value/10;
});

handlebars.registerHelper('getTop3', function(array) {
  const top3 = [];
  for(i=0; i<3; i++) top3.push(array[i]);
  return top3;
});

handlebars.registerHelper('getBigTree', function(qnad) {
  if(qnad<=20) return bigTrees[`level-1`];
  else if(qnad<=40) return bigTrees[`level-2`];
  else if(qnad<=60) return bigTrees[`level-3`];
  else if(qnad<=80) return bigTrees[`level-4`];
  else return bigTrees[`level-5`];
});

const splitAndCheckSolutions = (data) => {
  const solutions = data['all-solutions'];
  const tables = [];
  let pageTips = [];
  let totalHeight = 0;
  let nextTable = false;

  for (let i = 0; i < solutions.length; i++) {      
    const header = solutions[i].name.length;
    const text = Math.max(solutions[i].description.length, solutions[i].expected_effect.length);
    const tipHeight = Math.round(header / 24 * 32 + text / 50 * 20);    
    
    if ( i!==2 && totalHeight + tipHeight <= 1100) {
      pageTips.push(solutions[i]);
      totalHeight += tipHeight;
      nextTable = false;
    }
    else {      
      tables.push(pageTips);
      pageTips = [];
      pageTips.push(solutions[i]);
      totalHeight = tipHeight;
    }
  }
  if (pageTips.length > 0) {
    tables.push(pageTips);
  }
  return tables;  
}

// Load footer template from the file
// and register partial which will be reused in the main template
let footerFile = fs.readFileSync(`${__dirname}/templates/components/footer.html`, 'utf8');
handlebars.registerPartial('footer', footerFile);

// Load header template from the file
let headerFile = fs.readFileSync(`${__dirname}/templates/components/header.html`, 'utf8');
handlebars.registerPartial('header', headerFile);

let actionFile = fs.readFileSync(`${__dirname}/templates/components/action.html`, 'utf8');
handlebars.registerPartial('actions2take', actionFile);

let oppageFile = fs.readFileSync(`${__dirname}/templates/components/oppage.html`, 'utf8');
handlebars.registerPartial('oppage', oppageFile);

let oppage2File = fs.readFileSync(`${__dirname}/templates/components/oppage2.html`, 'utf8');
handlebars.registerPartial('oppage2', oppage2File);

let traitFile = fs.readFileSync(`${__dirname}/templates/components/traitpage.html`, 'utf8');
handlebars.registerPartial('traitpage', traitFile);

let eduFNadFile = fs.readFileSync(`${__dirname}/templates/components/eduFullNad.html`, 'utf8');
handlebars.registerPartial('eduFullNad', eduFNadFile);

let eduFTraitFile = fs.readFileSync(`${__dirname}/templates/components/eduFullTrait.html`, 'utf8');
handlebars.registerPartial('eduFullTrait', eduFTraitFile);

let eduFNADa4File = fs.readFileSync(`${__dirname}/templates/components/eduFullNad_a4.html`, 'utf8');
handlebars.registerPartial('eduFullNad_a4', eduFNADa4File);

let eduFTraitA4File = fs.readFileSync(`${__dirname}/templates/components/eduFullTrait_a4.html`, 'utf8');
handlebars.registerPartial('eduFullTrait_a4', eduFTraitA4File);

// Check if name of the user is provided
// For users takiing tests on TestingMachine name was set to `-` as default
// so it also means that name was not provided 
handlebars.registerHelper('nameProvided', function (name) {
  return name && name!='_'
});

// If name/surname are provided display them in the footer
// otherwise display email address
handlebars.registerHelper('getUserForFooter', function(user) {
  if (user.name && user.name!='_') return user.name +" "+user.surname
  else if (user.email) return user.email
  else return '_'
});

// Get blur for pages based on fullAccess property
// If fullAccess is false, then pages will be blured
handlebars.registerHelper('getBlurClass', function(fullAccess) {
  if (!fullAccess) return 'blur'
  return ''
});


handlebars.registerHelper('getHeightOfOpportunitiesFrame', function(lang) {
  if (lang=='pl') return '190mm' 
  else return '184mm'
});


const getTotalPages = (data) => {
  // For now index of the last page is always 48
  return Number(data.pages[data.pages.length-1].pageNumber)
}



const minimal_args = [
  '--disable-web-security',
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];


const isEduTemplate = (template) => {
  return template.includes('edu')
}

// Genereate PDF report for requested result
// #########################################
// result - result for which report will be generated
// readerType - type of user for which opportunities will be displayed
// lang - language of the PDF report
// fullAccess - When true user has access to full report(eg. it was purchased)
//              When set to false only demo result should be returned, eg. with blur applied.
// template -  Which template to use for generating the PDF report. 
//             - hr-long - Template for HR test. Will be used by default for results coming from BrinCore Pro Test
//             - edu-short - Short(single-page) template for EDU
//             - edu-long - Template for EDU
//             - edu-long-horizontal - Template for EDU with horizontal orientation. Will be used by default for results coming from BrinCore Edu Test
module.exports = async (result, readerType, lang = 'en', fullAccess=false, template) => {
  var startTime = performance.now()
  console.log("#### PDF REPORT - generation for result ",result._id)

  // Check if directory with reports exists
  // if not - create one
  const resultFilesDir = path.resolve(__dirname + "./../../../public/result/files");
  if (!(await fsp.stat(resultFilesDir).catch(e => false))){
    fsp.mkdir(resultFilesDir);
  }

  // Set name of the file and path
  const fileName = `result_${result._id}.pdf`;
  const filePath = `${resultFilesDir}/${fileName}`


  // // Caching files
  // if (fullAccess && fs.existsSync(filePath)) {
  //   var buffer = fs.readFileSync(filePath);
  //   return {buffer: buffer, filename: fileName};
  // }


  // Automatically detect template if it was not provided
  if (!template){
    if (pedagogyTestsIds.includes(result.content.toString())) template = `edu-long-horizontal`
    else template = `hr-long`
  }


  var data;
  if (isEduTemplate(template)) {
    var user = await User.findById(result.user._id)
    let requestData = await cognitiveUtils.prepareDataRequestForOldReport(result, user, 'text', readerType, lang)
    data = await cognitiveUtils.getDataForEduCognitiveReport(result, readerType, lang, requestData)
  }else{
    let report = await cognitiveUtils.getDataForCognitiveReport(result, readerType, lang);
    data = report.data
  }
  console.log(`#### PDF REPORT - data loaded in ${parseInt(performance.now() - startTime)} milliseconds`)
  
  // By default HR template
  let filename = __dirname +"/templates/result_pdf.html";


  // For Pedagogy Test(EDU) load other templates
  if (isEduTemplate(template)){
    if (template=='edu-short') filename = __dirname +"/templates/result_pdf_edu_prt.html";
    else if (template=='edu-long') filename = __dirname +"/templates/result_pdf_edu_prt_full.html";
    else filename = __dirname +"/templates/result_pdf_edu.html";
  }



  try {
    // read file
    const file = await fsp.readFile(filename, 'utf-8');
    if (isEduTemplate(template)) {      
      data = {...data,images: { trees, nads }, lang: lang, fullAccess: fullAccess, dividedSolutions: splitAndCheckSolutions(data)}
    }
    else data={...data,images: { trees, nads }, lang: lang, fullAccess: fullAccess, totalPages: getTotalPages(data)}
    const html = handlebars.compile(file)(data);
    // await fsp.writeFile(__dirname + "/test-1.html", html);

    var browser;
    // For Docker environments we must use specific configuration
    if (process.env.CHROMIUM_BROWSER_PATH){
      browser = await puppeteer.launch({
        headless: true,
        userDataDir: '/app/chromium_cache',
        executablePath: '/usr/bin/chromium-browser',
        args: minimal_args
      });
    }
    else {// Default puppy
      browser = await puppeteer.launch()
    }
    console.log(`#### PDF REPORT - browser started in ${parseInt(performance.now() - startTime)} milliseconds`)
    const page = await browser.newPage();
    await page.setContent(html);
    await page.evaluateHandle('document.fonts.ready');

    // Size of the viewport
    var width = 595;
    var height = 842;
    var format = 'A4'

    if (template.includes('horizontal')){
      width = 1920
      height = 1080
      format = undefined
    }


    // Default
    await page.setViewport({ width: width, height: height });
    var buffer = await page.pdf({ 
      format: format,
      width: width,
      
      height: height,
      printBackground: true
    });



    await browser.close();
    console.log(`#### PDF REPORT - report created in ${parseInt(performance.now() - startTime)} milliseconds`)
    const writefile = await fsp.writeFile(`${resultFilesDir}/${fileName}`, buffer);
    return {buffer: buffer, filename: fileName};
  } catch (err) {
    throw err;
  }
  
  
  
  
  
  
}