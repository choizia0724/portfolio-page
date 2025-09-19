pipeline {
  agent any

  environment {
    REGISTRY      = 'docker.io/choizia'
    IMAGE_NAME    = 'portfolio-backend'
    IMAGE         = "${REGISTRY}/${IMAGE_NAME}"
    K8S_NAMESPACE = 'default'
    }

  triggers { githubPush() }  // Webhook 연결되어 있으면 OK

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .git_sha'
      }
    }

    stage('Build (Maven)') {
      steps {
        sh '''
          set -euxo pipefail
          if [ -x mvnw ]; then
            ./mvnw -q -DskipTests dependency:go-offline
            ./mvnw -q -DskipTests package
          else
            echo "mvnw not found; skipping pre-build. Dockerfile will compile."
          fi
        '''
      }
    }

    stage('Docker Build & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub_cred_id',
                                         usernameVariable: 'DOCKER_USER',
                                         passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            set -euxo pipefail
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            SHA=$(cat .git_sha)
            docker build -t ${IMAGE}:$SHA -t ${IMAGE}:latest .
            docker push ${IMAGE}:$SHA
            docker push ${IMAGE}:latest
            echo $SHA > .image_tag
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          set -euxo pipefail
          SHA=$(cat .image_tag)

          # 매니페스트 적용(없으면 생성/있으면 갱신)
          kubectl -n ${K8S_NAMESPACE} apply -f k8s/backend-deploy.yaml

          # 새 이미지로 롤링 업데이트 (컨테이너 이름: app)
          kubectl -n ${K8S_NAMESPACE} set image deploy/portfolio-backend app=${IMAGE}:$SHA --record

          # 롤아웃 완료 대기
          kubectl -n ${K8S_NAMESPACE} rollout status deploy/portfolio-backend --timeout=180s

          # 상태 출력
          kubectl -n ${K8S_NAMESPACE} get deploy,po,svc -o wide
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Deployed image: ${IMAGE}:${readFile('.image_tag').trim()}"
    }
    failure {
      echo "❌ Deploy failed. Rollback:"
      echo "kubectl -n ${K8S_NAMESPACE} rollout undo deploy/portfolio-backend"
    }
  }
}
