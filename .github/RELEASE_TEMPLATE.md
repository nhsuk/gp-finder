##TMR _number_ | GP Finder

Created by: _person_ on _date_.
Requestor: _person_
Owner (Change Manager): Dominic Hamilton

Status: _raised/live validated_
 CAB Status: _proposed/approved_ 
Service: Connecting to Services: GP Finder
Category: Software

Reason For Change:
Planned Release

Description:

Current Release: _tag number_
Proposed Release: _tag number_

Key Release Features
* _PR Description 1_
* _PR Description 2_
* etc

_Bugs/features maybe related to the stories - Jira_

Release Details

Risk Mitigation (Risk level _number_usually_1_):

Code only release.
Deployment using the TeamCity pipeline.


Purposed Solution:

Using the automated deployment mechanism will ensure audit log and ability to re-deploy the previous tag. 
 

Prerequisite.

Package requirements:

Requires a ZIP package: False
Requires a SSIS package: False
  Integration Testing Completed: True 
Stage Testing Completed: True 
Checked in VCS: True

Risk Number: 1
Effort: 1
Impact: 1
Test Effort: 1


How do we test the change has been successful?

Manual exploratory testing post release.
*	_feature related tests_

Intention is to have automated smoke tests in future.
 
 
Any changes to the Disaster Recovery environment:

No


Testing Completed:

Yes
*	Automated integration and unit tests passing in CI.
*	Code coverage @ _percentage_
*	Performance tests passing on staging
*	No vulnerabilities detected
 

General Comments:

None


Implement

Release Change added to: NRD
Proposed Implementation Date/Time: _date&time format 2017-08-10T15:45:00_
Proposed End Date/Time: _date&time format 2017-08-10T15:55:00_

Remediation Time (Minutes): 10min

Implementation Steps:

Team City Deployment
Release 0.13.0 from [here](link to TC)

Remediation Plan:

Team City Deployment
·	Release 0.9.0 from [here](link to TC)
 

Review:

Actual Start Date Time: _date&time format 2017-08-10T15:45:00 _
Actual End Date Time: _date&time format 2017-08-10T15:55:00  _
Live Validation Date: _date&time format 2017-08-10T15:45:00  _
 

Live Validation Testing:

Manual exploratory testing carried out on https://beta.nhs.uk/book-a-gp-appointment/results?search=&postcode=s3
*	_feature related tests_