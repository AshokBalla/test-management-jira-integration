import { Given,setDefaultTimeout } from '@cucumber/cucumber';
import { logins } from '../../tests.js';

setDefaultTimeout(60 * 1000);

Given('I am on the login page',async function() {
    await logins();
    console.log('Current working directory:', process.cwd());
    
    
});