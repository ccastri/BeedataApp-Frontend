#!/bin/bash

# Source the .bashrc file to set environment variables.
source /home/ubuntu/.bashrc

# Change the current directory to /home/ubuntu/frontend.
echo 'cd /home/ubuntu/frontend' >> /home/ubuntu/deploy.log
cd /home/ubuntu/frontend >> /home/ubuntu/deploy.log

# Install dependencies, build the code, and run tests.
echo 'npm install' >> /home/ubuntu/deploy.log 
npm install >> /home/ubuntu/deploy.log
echo 'npm run build' >> /home/ubuntu/deploy.log 
npm run build >> /home/ubuntu/deploy.log

# Check for Jest errors and log to file.
echo 'npm run test' >> /home/ubuntu/deploy.log 
test_output=$(npm run test 2>&1)
echo "$test_output" >> /home/ubuntu/deploy.log

# Check for Jest errors and exit with status code 1 if there are any.
if [[ $test_output == *"Jest encountered an unexpected token"* ]]; then
  echo "Jest failed: syntax error."
  exit 1
elif [[ $test_output == *"Test Suites: 0 passed"* ]]; then
  echo "Jest failed: no tests passed."
  exit 1
else
  echo "Jest passed!"
  exit 0
fi
