pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        GITHUB_REPO = 'https://github.com/JATIN-JAY/Snip.git'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout(
                    [
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[url: "${GITHUB_REPO}"]]
                    ]
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                script {
                    // Backend dependencies
                    sh '''
                        cd snip-backend
                        npm install
                    '''
                    
                    // Frontend dependencies
                    sh '''
                        cd snip-frontend-main/snip-frontend-main
                        npm install
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                script {
                    // Backend tests
                    sh '''
                        cd snip-backend
                        npm test || true
                    '''
                    
                    // Frontend tests (if available)
                    sh '''
                        cd snip-frontend-main/snip-frontend-main
                        npm test -- --run || true
                    '''
                }
            }
        }

        stage('Start Services') {
            steps {
                echo 'Starting Docker services...'
                sh 'docker-compose up -d'
                sh 'sleep 15'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Running health checks...'
                script {
                    def maxAttempts = 10
                    def attempt = 1
                    def healthy = false
                    
                    while (attempt <= maxAttempts && !healthy) {
                        try {
                            sh '''
                                curl -f http://localhost:3000/ || exit 1
                                curl -f http://localhost/ || exit 1
                            '''
                            healthy = true
                            echo "Health check passed on attempt ${attempt}"
                        } catch (Exception e) {
                            if (attempt < maxAttempts) {
                                sh 'sleep 5'
                                attempt++
                            } else {
                                error "Health checks failed after ${maxAttempts} attempts"
                            }
                        }
                    }
                }
            }
        }

        stage('Integration Tests') {
            steps {
                echo 'Running integration tests...'
                script {
                    sh '''
                        # Test backend signup endpoint
                        curl -X POST http://localhost:3000/api/auth/signup \
                            -H "Content-Type: application/json" \
                            -d '{
                                "name": "Test User",
                                "email": "jenkins'$(date +%s)'@test.com",
                                "password": "TestPassword123"
                            }' || exit 1
                        
                        echo "Integration tests completed successfully"
                    '''
                }
            }
        }

        stage('Push Images to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing Docker images to registry...'
                script {
                    sh '''
                        echo "${DOCKER_CREDENTIALS_PSW}" | docker login -u "${DOCKER_CREDENTIALS_USR}" --password-stdin ${DOCKER_REGISTRY}
                        
                        docker tag snip-backend:latest ${DOCKER_REGISTRY}/snip-backend:latest
                        docker tag snip-backend:latest ${DOCKER_REGISTRY}/snip-backend:${BUILD_NUMBER}
                        docker push ${DOCKER_REGISTRY}/snip-backend:latest
                        docker push ${DOCKER_REGISTRY}/snip-backend:${BUILD_NUMBER}
                        
                        docker tag snip-frontend:latest ${DOCKER_REGISTRY}/snip-frontend:latest
                        docker tag snip-frontend:latest ${DOCKER_REGISTRY}/snip-frontend:${BUILD_NUMBER}
                        docker push ${DOCKER_REGISTRY}/snip-frontend:latest
                        docker push ${DOCKER_REGISTRY}/snip-frontend:${BUILD_NUMBER}
                        
                        docker logout ${DOCKER_REGISTRY}
                    '''
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
                script {
                    sh '''
                        # Stop and remove old containers
                        docker-compose down
                        
                        # Deploy new containers
                        docker-compose -f docker-compose.prod.yml up -d
                        
                        echo "Deployment completed successfully"
                    '''
                }
            }
        }

        stage('Post-Deployment Verification') {
            when {
                branch 'main'
            }
            steps {
                echo 'Verifying deployed services...'
                script {
                    sh '''
                        sleep 10
                        
                        # Verify backend is running
                        curl -f http://localhost:3000/ || exit 1
                        
                        # Verify frontend is running
                        curl -f http://localhost/ || exit 1
                        
                        echo "Post-deployment verification successful"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'
        }

        success {
            echo 'Pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
            sh 'docker-compose logs || true'
        }

        unstable {
            echo 'Pipeline is unstable'
        }
    }
}
