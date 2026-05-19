pipeline {
    agent {
        docker {
            image 'docker:24-dind'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_HOST = 'unix:///var/run/docker.sock'
    }

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
                dir('snip-frontend-main/snip-frontend-main') {
                    sh 'docker build -t snip-frontend:latest .'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Running backend tests...'
                dir('snip-backend') {
                    sh 'npm install && npm test || true'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo 'Deploying with docker-compose...'
                withCredentials([
                    string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    sh '''
                        export MONGODB_URI=${MONGODB_URI}
                        export JWT_SECRET=${JWT_SECRET}
                        docker-compose down || true
                        docker-compose up -d
                        sleep 10
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking service health...'
                sh '''
                    for i in {1..30}; do
                        if curl -f http://localhost:3000/ > /dev/null 2>&1; then
                            echo "Backend is healthy!"
                            break
                        fi
                        echo "Attempt $i: Waiting for backend..."
                        sleep 2
                    done
                    
                    if ! curl -f http://localhost:3000/ > /dev/null 2>&1; then
                        echo "Backend health check failed!"
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! Snip is deployed successfully.'
        }
        failure {
            echo 'Pipeline failed! Check the logs above.'
            sh 'docker-compose logs || true'
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}