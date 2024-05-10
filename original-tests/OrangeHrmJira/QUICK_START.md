# ⚡ Quick Start Guide - OrangeHRM Test Automation

## 🚀 Setup in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=TA
```

### 3. Run Tests
```bash
npm run test:jira
```

---

## 📁 File Structure (Simple View)

| File | Purpose |
|------|---------|
| `features/login.feature` | Test scenarios (what to test) |
| `features/step_def/steps.js` | Connects scenarios to code |
| `tests.js` | Actual test logic (login automation) |
| `jiraIntegration.js` | Updates Jira with results |
| `generateReports.js` | Creates HTML & CSV reports |

---

## 🔄 Test Flow (Simple)

```
1. Run test → 2. Cucumber reads feature file → 3. Executes test → 4. Updates Jira → 5. Generates reports
```

---

## 📊 Commands

| Command | What It Does |
|---------|--------------|
| `npm test` | Run tests only |
| `npm run test:jira` | Run tests + update Jira + generate reports |

---

## 🎯 Key Points

- ✅ Tests are written in simple English (Gherkin)
- ✅ Results automatically go to Jira
- ✅ Reports are generated in `reports/` folder
- ✅ Each test scenario can link to a Jira issue using `@TA-1` tag

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Browser not found | Update Chrome path in `tests.js` |
| Jira update fails | Check `.env` file credentials |
| Reports missing | Run `mkdir reports` first |

---

**Need more details?** See `PROJECT_PLAN.md` for complete documentation.

