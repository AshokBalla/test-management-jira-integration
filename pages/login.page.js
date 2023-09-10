class LoginPage {
  constructor(basePath = '/web/index.php/auth/login') {
    this.basePath = basePath;
  }

  selectors() {
    return { username: '[name="username"]', password: '[name="password"]', submit: 'button[type="submit"]' };
  }
}

module.exports = LoginPage;
