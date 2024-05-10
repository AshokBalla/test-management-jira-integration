pipeline {
  agent any
  stages {
    stage('Validate') { steps { sh 'npm test' } }
    stage('OrangeHRM Samples') { steps { sh 'npm run test:ui || true' } }
  }
}
