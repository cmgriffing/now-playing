###########################
FROM node:10-alpine AS base
###########################
WORKDIR /app
RUN apk update
ENV NODE_ENV=production

####################
FROM base AS builder
####################
WORKDIR /tmp/builder
COPY package.json .
COPY package-lock.json .

RUN npm install --production

#######################
FROM base AS production
#######################
WORKDIR /app
USER node

COPY --from=builder /tmp/builder/node_modules node_modules
COPY server.js .
COPY config.json .

EXPOSE 4242
ENTRYPOINT ["node", "server.js"]
