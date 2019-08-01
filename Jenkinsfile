pipeline {
  agent { label 'dockerhost' }

  environment {
    CI = 'true'
    K8S_RELEASE_NAME = "kiva-ui"
    K8S_NAMESPACE = "kiva-ui"
    DOCKER_REPO_NAME = "kiva/ui"
    TAG_NAME = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
    TAGGED_IMAGE_NAME = "${DOCKER_REPO_NAME}:${TAG_NAME}"
  }

  stages {
    stage('Build_Docker_Image') {
      environment {
        TAG_NAME = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
      }
      steps {
        withDockerRegistry([ credentialsId: "kivapush_docker", url: ""]) {
          sh "docker build -t ${TAGGED_IMAGE_NAME} -f Dockerfile.jenkins . --build-arg TAG_NAME=${TAG_NAME} --pull --no-cache"
        }
      }
    }

    stage('Run_Tests') {
      environment {
        foo = "bar"
        blah = "blahblah"
      }
      steps {
        echo "Add tests here.  Verify docker image functions as expected"
        echo "May need to add some additional containers, etc. to run memcached or other dependencies"
        echo "Or possibly run dependencies on jenkins nodes"
      }
    }

    stage('Publish_Docker_Image')
      steps {
        withDockerRegistry([ credentialsId: "kivapush_docker", url: ""]) {
          sh "docker push ${TAGGED_IMAGE_NAME}"
      }
    }

//    stage('Kubernetes_Dev_Deployment') {
//      when {
//        branch 'kubernetes_deploy_ui'
//      }
//      steps {
//        echo "Deploying to development Kubernetes cluster..."
//        withKubeConfig([credentialsId: "test-k8s-config"]) {
//          withAWS([credentials: "jenkins-ci"]) {
//            sh "helm upgrade --install ${K8S_RELEASE_NAME} ./deploy/charts --namespace ${K8S_NAMESPACE} --tiller-namespace helm-system --values ./deploy/dev/${K8S_RELEASE_NAME}.values.yaml --set image.tag=${TAG_NAME} --set deployenv.environment=dev"
//          }
//        }
//        }
//      }
    
  }
}
