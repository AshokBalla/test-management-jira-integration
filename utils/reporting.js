function summarizeFailure(testName, screenshotPath) {
  return { testName, screenshotPath, createdAt: new Date().toISOString() };
}

module.exports = { summarizeFailure };
