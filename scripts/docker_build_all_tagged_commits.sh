#!/usr/bin/env bash

TAGS=$(git tag)
DOCKERFILE='Dockerfile'
DOCKER_REPO='nhsuk/connecting-to-services'
PUSH_TO_DOCKER='true'

for TAG in $TAGS; do
  echo "Building tag: $TAG"
  git checkout "$TAG" #2&>1 > /dev/null
  if [ -e $DOCKERFILE ]; then
    docker build -t "${DOCKER_REPO}:${TAG}" -f ${DOCKERFILE} .
    if [ "$PUSH_TO_DOCKER" == "true" ]; then
      docker push "${DOCKER_REPO}:${TAG}"
    fi
  fi
done
