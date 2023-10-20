const reactI18next = require('react-i18next');

module.exports = { ...reactI18next,
                   useTranslation: () => {
                     return {
                       t: (str) => str,
                       i18n: {
                         changeLanguage: () => new Promise(() => {}),
                       },
                     };
                   }
}

