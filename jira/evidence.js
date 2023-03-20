function buildEvidenceBundle(files = []) {
  return files.map((file, index) => ({ id: index + 1, path: file }));
}

module.exports = { buildEvidenceBundle };
