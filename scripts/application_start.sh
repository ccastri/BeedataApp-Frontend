#!/bin/bash
source /home/ubuntu/.bashrc

echo 'run application_start.sh: ' >> /home/ubuntu/deploy.log
cd /home/ubuntu/frontend

echo 'pm2 start frontend' >> /home/ubuntu/deploy.log
pm2 start npm --name "frontend" -- start >> /home/ubuntu/deploy.log