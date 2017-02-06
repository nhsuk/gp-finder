#!/usr/bin/env bash

install_rancher() {
  RANCHER_CLI_VERSION='v0.4.1'
  wget -qO- https://github.com/rancher/cli/releases/download/${RANCHER_CLI_VERSION}/rancher-linux-amd64-${RANCHER_CLI_VERSION}.tar.gz | tar xvz -C /tmp
  mv /tmp/rancher-${RANCHER_CLI_VERSION}/rancher /usr/local/bin/rancher
  chmod +x /usr/local/bin/rancher
  rm -r /tmp/rancher-${RANCHER_CLI_VERSION}
}

if [[ -n "$TRAVIS" ]]; then

  echo "Travis detected"

  # IF MASTER BRANCH 
  if [ "$TRAVIS_BRANCH" = "master" ]; then

    RANCHER_ENVIRONMENT="c2s-staging"
    RANCHER_STACK="c2s-staging"
    SPLUNK_HEC_TOKEN=""

    install_rancher()

    curl -s https://raw.githubusercontent.com/nhsuk/nhsuk-rancher-templates/master/templates/c2s_traefik/0/docker-compose.yml  -o docker-compose.yml
    curl -s https://raw.githubusercontent.com/nhsuk/nhsuk-rancher-templates/master/templates/c2s_traefik/0/rancher-compose.yml -o rancher-compose.yml

    touch answers.txt
    echo -n "" > answers.txt

    {
      echo "c2s_traefik_alias=www"
      echo "nearbyservices_traefik_alias=ns"
      echo "traefik_domain=staging.c2s.nhschoices.net"
      echo "c2s_docker_image_tag=master"
      echo "nearbyservices_docker_image_tag=0.2.0-beta"
      echo "splunk_hec_endpoint=https://splunk-collector.cloudapp.net:8088"
      echo "splunk_hec_token=${SPLUNK_HEC_TOKEN}"
      echo "hotjar_id=265857"
      echo "google_id=UA-67365892-5"
      echo "webtrends_id=dcs222rfg0jh2hpdaqwc2gmki_9r4q"
    } >> answers.txt

    rancher --environment "${RANCHER_ENVIRONMENT}" up --pull --upgrade -d --stack "${RANCHER_STACK}" --env-file answers.txt
  fi
fi
