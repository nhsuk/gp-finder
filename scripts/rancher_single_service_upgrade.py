#!/usr/bin/env python
import os
import requests
import json
import time

import sys
import getopt


def main(argv):
    environmentName = ''
    serviceName = ''
    newImage = ''
    newImageTag = 'latest'

    try:
        opts = getopt.getopt(argv, "hs:i:e:t:", ["service-name=", "image-name=", "environment=", "image-tag="])[0]
    except getopt.GetoptError:
        print 'test.py -s <service-name> -i <image-name> -e <environment> -t <image-tag>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'test.py -s <service-name> -i <image-name> -e <environment> -t <image-tag>'
            sys.exit()
        elif opt in ("-s", "--service-name"):
            serviceName = arg
        elif opt in ("-i", "--image-name"):
            newImage = arg
        elif opt in ("-e", "--environment"):
            environmentName = arg
        elif opt in ("-t", "--image-tag"):
            newImageTag = arg
    print 'service is ', serviceName
    print 'image is ', newImage
    print 'imagetag is ', newImageTag
    print 'env is ', environmentName

    # Find stack based on their name
    r = requests.get(os.environ['RANCHER_URL'] + 'v1/environments?name=' + environmentName,
                     auth=(os.environ['RANCHER_ACCESS_KEY'], os.environ['RANCHER_SECRET_KEY']))

    environment = r.json()['data'][0]

    # Find service based on their name and environmentId
    r = requests.get(os.environ['RANCHER_URL'] + 'v1/services?name=' + serviceName + '&environmentId=' + environment['id'],
                     auth=(os.environ['RANCHER_ACCESS_KEY'], os.environ['RANCHER_SECRET_KEY']))

    service = r.json()['data'][0]

    launchConfig = service['launchConfig']

    # Update launchConfig with newImage
    launchConfig['imageUuid'] = "docker:" + newImage + ":" + newImageTag

    # Construct payload for upgrade
    payload = {
        'inServiceStrategy':
        {
            'batchSize': 1,
            'intervalMillis': 2000,
            'startFirst': False,
            'launchConfig': launchConfig
        }
    }

    headers = {'content-type': 'application/json'}

    # # Upgrade the service with payload
    r = requests.post(os.environ['RANCHER_URL'] + 'v1/services/' + service['id'] + '/?action=upgrade',
                      data=json.dumps(payload), headers=headers,
                      auth=(os.environ['RANCHER_ACCESS_KEY'], os.environ['RANCHER_SECRET_KEY']))

    # Pool service upgrade status
    state = 'upgrading'
    sleep = 5
    retry = 30

    while (state != 'upgraded'):
        print "service: " + service['name'] + " [upgrading]"
        time.sleep(sleep)
        r = requests.get(os.environ['RANCHER_URL'] + 'v1/services/' + service['id'],
                         auth=(os.environ['RANCHER_ACCESS_KEY'],
                         os.environ['RANCHER_SECRET_KEY']))
        state = r.json()['state']
        retry -= 1
        if (retry <= 0):
            sys.exit()

    print "service: " + service['name'] + " [upgraded]"

    # Finish Upgrade
    r = requests.post(os.environ['RANCHER_URL'] + 'v1/services/' + service['id'] + '/?action=finishupgrade',
                      headers=headers, auth=(os.environ['RANCHER_ACCESS_KEY'], os.environ['RANCHER_SECRET_KEY']))

if __name__ == "__main__":
    main(sys.argv[1:])
