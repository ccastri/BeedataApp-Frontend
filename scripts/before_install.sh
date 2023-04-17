#!/bin/bash

if pm2 show frontend &> /dev/null; then
  pm2 delete frontend
fi

if [ -d "/home/ubuntu/frontend" ]; then
  sudo rm -rf /home/ubuntu/frontend
fi

mkdir /home/ubuntu/frontend

cp /home/ubuntu/helper/.env /home/ubuntu/frontend/
