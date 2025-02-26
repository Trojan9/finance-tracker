pipeline {
    agent any

    environment {
        GIT_REPO = 'git@github.com:Trojan9/finance-tracker.git'
        GIT_BRANCH = 'main'
        CREDENTIALS_ID = 'github_CW'
        PROJECT_DIR = 'finance-tracker'
    }

    stages {
        stage('Clean Build Directory') {
            steps {
                echo 'Removing existing build directory...'
                 // Ensure the Jenkins user can access and modify the parent directory
                // sh "sudo chown -R jenkins:jenkins glamiris_web_build || true"
                sh "sudo rm -rf ${PROJECT_DIR}"
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    sshagent(credentials: [CREDENTIALS_ID]) {
                        sh "git clone -b ${GIT_BRANCH} ${GIT_REPO} ${PROJECT_DIR}"
                    }
                }
            }
        }

        stage('Clean Web Directory') {
            steps {
                echo 'Cleaning /var/www/html/ directory...'
                sh 'sudo rm -rf /var/www/html/*'
            }
        }

        stage('Deploy to Web Directory') {
            steps {
                echo 'Copying build to /var/www/html/ directory...'
                sh 'sudo cp -r finance-tracker/public/dist/* /var/www/html/'
            }
        }

        stage('Restart Nginx') {
            steps {
                echo 'Restarting nginx...'
                sh 'sudo systemctl restart nginx'
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
