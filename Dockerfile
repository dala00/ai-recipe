#==================================================
# Base Layer
FROM node:18.4.0-slim AS base
WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/
RUN apt-get -y update && apt-get -y install openssl
RUN yarn --frozen-lockfile
RUN yarn prisma generate
COPY . .

#==================================================
# Build Layer
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build

COPY --from=base /app ./
RUN yarn build:next

# ==================================================
# Package install Layer
FROM node:18.4.0-slim AS node_modules

WORKDIR /modules

RUN apt-get -y update && apt-get -y install openssl
COPY package.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/
RUN yarn install --non-interactive --frozen-lockfile --production
RUN yarn prisma generate

# ==================================================
# Production Run Layer
FROM node:18.4.0-slim
ENV NODE_ENV=production
WORKDIR /app

RUN apt-get -y update \
	&& apt-get -y install openssl \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock next.config.js ./
COPY prisma/schema.prisma ./prisma/
COPY --from=build /build/public ./public
COPY --from=build /build/.next ./.next
COPY --from=node_modules /modules/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]