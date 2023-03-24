# Serverless LCR

Implementation of the LCR game using cloud technologies.

Api Gateway, Lambda, Redis, Event Bridge, Event Bridge Rule, and DynamoDB.

## Install

    $ git clone https://github.com/jlucianolzz/serverless-lcr.git
    $ cd serverless-lcr
    $ npm install

## Running the app

configure the environment variables in the ./serverless/environment/development.yml file

    REDIS_PASSWORD: ""
    REDIS_HOST: ""
    REDIS_PORT: ""

## Deploy the app

    $ npm run deploy

## Documentation Open Api 3.0

The documentation is available at:

- ./openapi.json
- https://app.swaggerhub.com/apis/jlucianolzz/serverless-lcr/1.0.0
