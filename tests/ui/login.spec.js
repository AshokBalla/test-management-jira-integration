const assert = require('node:assert/strict');
const LoginPage = require('../../pages/login.page');
const page = new LoginPage();
assert.ok(page.selectors().submit);
console.log('UI sample selectors verified');
