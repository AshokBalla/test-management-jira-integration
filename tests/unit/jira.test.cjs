const test = require('node:test');
const assert = require('node:assert/strict');


test('issue payload includes labels', () => {
  const { buildIssuePayload } = require('../../jira/client');
  const payload = buildIssuePayload('Failed login', 'Details', ['ui', 'smoke']);
  assert.deepEqual(payload.fields.labels, ['ui', 'smoke']);
});

test('evidence bundle enumerates files', () => {
  const { buildEvidenceBundle } = require('../../jira/evidence');
  assert.equal(buildEvidenceBundle(['a.png', 'b.json']).length, 2);
});
