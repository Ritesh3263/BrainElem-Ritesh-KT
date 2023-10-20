// import {useTranslation} from "react-i18next";
// import {Alert} from "react-bootstrap";
// import {isEmail} from "validator";
// import React from "react";
//
// const { t, i18n } = useTranslation(['translation', 'validators']);
//
// const required = (value) => {
//     if (!value) {
//         return (
//             <Alert variant="danger">{t("validators:required")}</Alert>
//         );
//     }
// };
//
// const validEmail = (value) => {
//     if (value && (!isEmail(value))) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 {t("validators:invalidEmail")}
//             </div>
//         );
//     }
// };
//
// const validUsername = (value) => {
//     if (value && (value.length < 3 || value.length > 20)) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 {t("validators:invalidLengthUsername")}
//             </div>
//         );
//     }
// };
//
// const validPassword = (value) => {
//     if (value && (value.length < 6 || value.length > 40)) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 {t("validators:invalidLengthPassword")}
//             </div>
//         );
//     }
// };
//
// const validLength3to20 = (value) => {
//     if (value && (value.length < 3 || value.length > 20)) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 {t("validators:invalidLength3to20")}
//             </div>
//         );
//     }
// };
//
// const validLength3to200 = (value) => {
//     if (value && (value.length < 3 || value.length > 200)) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 {t("validators:invalidLength3to200")}
//             </div>
//         );
//     }
// };
//
// export const validators = {
//     required: required,
//     validEmail: validEmail,
//     validPassword:
//     validPassword,
//     validUsername: validUsername,
//     validLength3to20: validLength3to20,
//     validLength3to200: validLength3to200
// }