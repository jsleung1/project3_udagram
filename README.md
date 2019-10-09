# Project 2: Udagram Image Filtering Microservice Url:

http://project2-jeffrey-udagram-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url={fullUrlLinkOfPicture}

## To verify the completion of the project:

### 1. Under normal scenario, execute the following GET request:
http://project2-jeffrey-udagram-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg

It will return http status 200 OK with the processed image showing black and white photo of a kitten.

### 2. To test invalid image_url, execute the following GET request:
http://project2-jeffrey-udagram-dev.us-east-1.elasticbeanstalk.com/filteredimage

It will return http status 422 with following error message:
"Unable to continue because the request parameter image_url is empty or does not exist".

### 3. To test un-reacheable image_url, execute the following GET request:
http://project2-jeffrey-udagram-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://unreacheable.com/2019/03/kitten-report.jpg

It will return http status 422 with following error message:
"Unable to process the file specified in the request parameter image_url because host unreacheable.com is unreacheable.".

### 4.  To test wrong path or filename in image_url, execute the following GET request:
http://project2-jeffrey-udagram-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/cat-report.jpg

It will return http status 422 with following error message:
"Unable to process the file specified in the request parameter image_url because host timedotcom.files.wordpress.com returns HTTP   error code: 404".

### Suggested Tools to verify the above:
Download Postman in https://www.getpostman.com/downloads/
