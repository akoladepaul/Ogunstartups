#!/bin/bash
set -e

APP_DIR="/home/ogunstartups/htdocs/ogunstartups.ng"
echo "==> Deploying OgunStartups to $APP_DIR"

cd "$APP_DIR"

echo "==> Pulling latest code"
git pull origin main

echo "==> Installing dependencies"
npm ci --production=false

echo "==> Running database migrations"
npx prisma migrate deploy

echo "==> Building application"
npm run build

echo "==> Restarting PM2 process"
pm2 restart ogunstartups || pm2 start ecosystem.config.js

echo "==> Done. Site is live."
pm2 status
