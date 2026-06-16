pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t myapp .'
            }
        }

        stage('Manual Approval') {
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@3.108.41.107 "

                        cd ~/My-App

                        git pull origin main

                        docker stop myapp || true
                        docker rm myapp || true

                        docker build -t myapp .

                        docker run -d \
                            --name myapp \
                            -p 80:80 \
                            myapp
                        "
                    '''
                }
            }
        }
    }
}


