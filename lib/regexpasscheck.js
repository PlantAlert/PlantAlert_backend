'use strict';
module.exports = function (pwd) {

// This checks for a Digit, a lowercase, a Uppercase, a Special
// returns TRUE is the password meets requirements, false otherwise.

var regexObj = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{6,20})/;
return regexObj.test(pwd);

};
