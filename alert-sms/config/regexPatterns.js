const userNamePattern =
    '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$';
const numbersPattern = '^[0-9]+$';
const phoneNumberPattern = '^09[0-9]{9}$'
// :NOTE this password should contain at least 1 lower case char ,1 uppercase char ,1 char special character and at least 1 number
const passwordPattern =
    '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$';

const removeBracketFromValidatorOldReturn = '(?<=)(\\[.*?\\])(?=)'; // :TODO check regex
const mobilePattern = '09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}';
const smsSenderPattern = '^[+]{1}98[0-9]{9}$'
module.exports = {
    userNamePattern,
    passwordPattern,
    numbersPattern,
    removeBracketFromValidatorOldReturn,
    mobilePattern,
    phoneNumberPattern,
    smsSenderPattern
};
