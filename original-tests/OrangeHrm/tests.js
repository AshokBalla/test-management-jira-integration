import puppeteer from 'puppeteer';
class LoginHandler {
    constructor(page) {
        this.page = page;
        this.browser = null;
        this.timeout = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: false,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            slowMo: 10,
            args: ['--start-maximized'],
            defaultViewport: null
        });
        this.page = await this.browser.newPage();
        this.page.setDefaultTimeout(this.timeout);
    }

    async logins() {
        await this.page.goto('http://orangehrm.qedgetech.com/');
        await this.page.type('input[name="txtUsername"]', 'Admin');
        await this.page.type('input[name="txtPassword"]', 'Qedge123!@#');
        await this.page.click('input[name="Submit"]');


    }
    async close() {
        await this.browser.close();
    }

    async delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }



}

export const logins = async function () {
    const loginhandler = new LoginHandler();
    await loginhandler.init();
    await loginhandler.logins();
    await new Promise(r => setTimeout(r, 5000));
    await loginhandler.close();

}