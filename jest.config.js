module.exports = {
  ...,
  reporters: ["default", "jest-sonar-reporter"],
  coverageReporters: ["lcov", "text-summary"],
  testResultsProcessor: "jest-sonar-reporter"
};