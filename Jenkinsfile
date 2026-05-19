pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building backend Docker image...'
                dir('snip-backend') {
                    sh 'docker build -t snip-backend:latest .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend Docker image...'
                dir('snip-frontend-main') {
                    sh 'docker build -t snip-frontend:latest .'
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    echo 'Stopping old containers...'
                    sh 'docker stop snip-backend || true'
                    sh 'docker rm snip-backend || true'
                    sh 'docker stop snip-frontend || true'
                    sh 'docker rm snip-frontend || true'

                    echo 'Starting new containers...'
                    sh "docker run -d -p 3000:3000 --name snip-backend -e PORT=3000 -e MONGODB_URI=${MONGODB_URI} -e JWT_SECRET=${JWT_SECRET} snip-backend:latest"
                    sh 'docker run -d -p 80:80 --name snip-frontend snip-frontend:latest'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! Snip is deployed.'
        }
        failure {
            echo 'Pipeline failed! Check the logs above.'
        }
    }
}