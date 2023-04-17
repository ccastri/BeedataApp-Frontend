#!/bin/bash

export PATH=$PATH:/usr/bin:/usr/local/bin:/usr/local/lib/node_modules/pm2/bin >> /home/ubuntu/deploy.log

echo 'run application_start.sh: ' >> /home/ubuntu/deploy.log
cd /home/ubuntu/frontend

echo 'pm2 start frontend' >> /home/ubuntu/deploy.log
pm2 start npm --name "frontend" -- start >> /home/ubuntu/deploy.log