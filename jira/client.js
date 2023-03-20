function buildIssuePayload(summary, description, labels = []) {
  return {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY || 'QA' },
      summary,
      description,
      issuetype: { name: 'Bug' },
      labels,
    },
  };
}

async function submitIssue(client, payload) {
  return client.post('/rest/api/3/issue', payload);
}

module.exports = { buildIssuePayload, submitIssue };
