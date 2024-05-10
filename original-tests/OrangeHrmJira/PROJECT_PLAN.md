# 🎯 OrangeHRM Test Automation Project Plan

## 📖 Overview

This project automates testing of the OrangeHRM application using **Puppeteer** (browser automation) and **Cucumber** (BDD testing framework). Test results are automatically updated in **Jira** with detailed reports.

---

## 🎯 What This Project Does

1. **Automates Login Testing**: Tests the login functionality of OrangeHRM
2. **Generates Reports**: Creates HTML and CSV reports after test execution
3. **Jira Integration**: Automatically updates Jira issues with test results and attaches reports
4. **BDD Approach**: Uses Gherkin syntax (Given/Then) for readable test scenarios

---

## 📁 Project Structure

```
OrangeHrmJira/
├── features/                    # Test scenarios (Gherkin format)
│   ├── login.feature           # Login test scenarios
│   ├── step_def/               # Step definitions (connects Gherkin to code)
│   │   └── steps.js
│   └── support/                # Hooks and setup
│       └── hooks.js            # Before/After hooks (Jira integration)
│
├── tests.js                    # Core test functions (login logic)
├── jiraIntegration.js          # Jira API integration
├── generateReports.js          # Report generation (HTML & CSV)
├── package.json                # Dependencies and scripts
├── reports/                    # Generated reports (created after tests)
│   ├── cucumber_report.html
│   ├── cucumber_report.json
│   └── test_results.csv
└── .env                        # Environment variables (needs to be created)
```

---

## 🔄 How It Works (Flow Diagram)

```
1. Run Test Command
   ↓
2. Cucumber reads login.feature
   ↓
3. Steps.js executes test functions from tests.js
   ↓
4. Puppeteer opens browser and performs login
   ↓
5. Test results are captured
   ↓
6. Hooks.js updates Jira with results
   ↓
7. Reports are generated (HTML & CSV)
   ↓
8. Reports are attached to Jira issue
```

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **Google Chrome** browser installed
- **Jira account** with API access
- **OrangeHRM** test environment access

### Step 1: Install Dependencies

```bash
cd OrangeHrmJira
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the root directory with the following:

```env
# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=TA

# OrangeHRM Configuration (optional - defaults are in tests.js)
ORANGEHRM_URL=http://orangehrm.qedgetech.com/
ORANGEHRM_USERNAME=Admin
ORANGEHRM_PASSWORD=Qedge123!@#
```

**How to get Jira API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token and paste it in `.env`

### Step 3: Verify Setup

Check that all files are in place:
- ✅ `features/login.feature` exists
- ✅ `tests.js` exists
- ✅ `.env` file is created with correct values

---

## 🚀 How to Run Tests

### Basic Test Run
```bash
npm test
```
This will:
- Run Cucumber tests
- Generate HTML and JSON reports
- Display summary in console

### Test Run with Jira Integration
```bash
npm run test:jira
```
This will:
- Run all tests
- Generate HTML and CSV reports
- Update Jira issues with results
- Attach reports to Jira issues

---

## 📋 Key Components Explained

### 1. **features/login.feature** (Test Scenarios)
- Written in Gherkin syntax (human-readable)
- Defines **WHAT** to test
- Example:
```gherkin
@TA-1
Feature: Login Feature
    @JIRA-TA-1
    Scenario: Successful login with valid credentials
        Given I am on the login page
        Then I should be logged in successfully
```

### 2. **features/step_def/steps.js** (Step Definitions)
- Connects Gherkin steps to actual code
- Defines **HOW** to execute each step
- Calls functions from `tests.js`

### 3. **tests.js** (Test Logic)
- Contains the actual test implementation
- Uses Puppeteer to:
  - Open browser
  - Navigate to login page
  - Enter credentials
  - Verify login success
- Returns a `LoginHandler` object

### 4. **features/support/hooks.js** (Test Hooks)
- **Before**: Runs before each test (initialization)
- **After**: Runs after each test (cleanup + Jira update)
- Automatically:
  - Closes browser after test
  - Updates Jira issue with test status
  - Attaches reports to Jira

### 5. **jiraIntegration.js** (Jira API)
- Handles all Jira operations:
  - Adding comments to issues
  - Updating issue status
  - Attaching files (reports)
- Maps test status to Jira status:
  - `passed` → `Done`
  - `failed` → `To Do`
  - `skipped` → `In Progress`

### 6. **generateReports.js** (Report Generator)
- Reads JSON report from Cucumber
- Generates:
  - **HTML Report**: Visual report with charts
  - **CSV Report**: Spreadsheet-friendly format

---

## 🔗 Jira Integration Details

### How Jira Tags Work

In `login.feature`, you'll see tags like:
- `@TA-1` - Feature-level tag (Jira issue key)
- `@JIRA-TA-1` - Scenario-level tag (specific Jira issue)

The hooks automatically:
1. Extract the issue key from tags
2. Update the issue status based on test result
3. Add a comment with test details
4. Attach HTML and CSV reports

### Jira Status Mapping

| Test Status | Jira Status |
|------------|-------------|
| ✅ Passed  | Done        |
| ❌ Failed  | To Do       |
| ⏭️ Skipped | In Progress |

---

## 📊 Understanding Reports

### HTML Report (`cucumber_report.html`)
- Visual dashboard with charts
- Shows pass/fail statistics
- Includes execution time
- Open in browser to view

### CSV Report (`test_results.csv`)
- Spreadsheet format
- Columns: Feature, Scenario, Status, Duration, Steps, etc.
- Easy to import into Excel/Google Sheets

### JSON Report (`cucumber_report.json`)
- Machine-readable format
- Used by report generators
- Contains detailed step-by-step results

---

## 🐛 Troubleshooting

### Issue: Tests fail with "browser not found"
**Solution**: Update Chrome path in `tests.js` line 14:
```javascript
executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```
For Windows: `'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'`

### Issue: Jira update fails
**Check**:
1. `.env` file has correct Jira credentials
2. API token is valid
3. Jira issue key exists (e.g., `TA-1`)
4. User has permission to update the issue

### Issue: Reports not generated
**Solution**: Ensure `reports/` directory exists:
```bash
mkdir reports
```

---

## 📝 Adding New Tests

### Step 1: Add Scenario to Feature File
Edit `features/login.feature`:
```gherkin
@TA-2
Scenario: Login with invalid credentials
    Given I am on the login page
    When I enter invalid credentials
    Then I should see an error message
```

### Step 2: Add Step Definitions
Edit `features/step_def/steps.js`:
```javascript
When('I enter invalid credentials', async function () {
    // Your code here
});
```

### Step 3: Add Test Function
Edit `tests.js` to add new test functions if needed.

---

## 🎯 Project Goals

1. ✅ Automate OrangeHRM login testing
2. ✅ Generate comprehensive test reports
3. ✅ Integrate with Jira for test tracking
4. ✅ Provide readable BDD test scenarios
5. ✅ Enable easy test maintenance

---

## 👥 Team Responsibilities

### Test Automation Engineer
- Write and maintain test scenarios (`login.feature`)
- Update step definitions (`steps.js`)
- Maintain test functions (`tests.js`)

### DevOps/CI Engineer
- Set up CI/CD pipeline
- Configure environment variables
- Monitor test execution

### QA Lead
- Review test scenarios
- Analyze test reports
- Track test results in Jira

---

## 📞 Support & Questions

If you have questions about:
- **Test scenarios**: Check `features/login.feature`
- **Test logic**: Check `tests.js`
- **Jira integration**: Check `jiraIntegration.js`
- **Report generation**: Check `generateReports.js`

---

## 🔄 Next Steps

1. ✅ Review this plan with the team
2. ✅ Set up environment (install dependencies, create `.env`)
3. ✅ Run a test to verify setup
4. ✅ Check Jira to see if results are updated
5. ✅ Review generated reports

---

**Last Updated**: [Current Date]
**Project Version**: 1.0.0

