#!/bin/bash
source /home/ubuntu/.bashrc
echo 'run after_install.sh: ' >> /home/ubuntu/deploy.log

echo 'cd /home/ubuntu/frontend' >> /home/ubuntu/deploy.log
cd /home/ubuntu/frontend >> /home/ubuntu/deploy.log

echo 'npm install' >> /home/ubuntu/deploy.log 
npm install >> /home/ubuntu/deploy.log
npm run build >> /home/ubuntu/deploy.log
npm run test >> /home/ubuntu/deploy.log