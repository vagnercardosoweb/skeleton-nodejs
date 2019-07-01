FROM node:alpine

# Install pm2 cli
RUN yarn global add pm2

COPY package.json .
RUN yarn

COPY . .

# Start pm2-runtime
CMD ["yarn", "dev:pm2"]
