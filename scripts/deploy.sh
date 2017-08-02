#!/bin/sh

git clone https://github.com/nhsuk/ci-deployment.git scripts/ci-deployment

if [ -n "${CI_SCRIPT_BRANCH}" ]; then
  (
    cd scripts/ci-deployment &&
    git checkout "${CI_SCRIPT_BRANCH}"
  )
fi

bash scripts/ci-deployment/deploy.sh
