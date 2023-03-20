function buildEmployeePayload(firstName, lastName) {
  return { firstName, lastName, employeeId: `${firstName}-${lastName}`.toLowerCase() };
}

module.exports = { buildEmployeePayload };
