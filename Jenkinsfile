pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['DEV', 'PROD'], description: 'Select Deployment Environment')
    }

    environment {
        IMAGE_NAME = "my-node-app"
        DEPLOY_HOST = "ubuntu@<DEPLOYMENT-EC2-IP>"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['deployment-server']) {
                    script {

                        if (params.ENV == 'DEV') {

                            sh """
                            ssh -o StrictHostKeyChecking=no $DEPLOY_HOST '
                            docker stop myapp-dev || true &&
                            docker rm myapp-dev || true &&
                            docker run -d --name myapp-dev -p 8080:80 my-node-app
                            '
                            """

                        } else {

                            sh """
                            ssh -o StrictHostKeyChecking=no $DEPLOY_HOST '
                            docker stop myapp-prod || true &&
                            docker rm myapp-prod || true &&
                            docker run -d --name myapp-prod -p 8081:80 my-node-app
                            '
                            """
                        }
                    }
                }
            }
        }
    }
}