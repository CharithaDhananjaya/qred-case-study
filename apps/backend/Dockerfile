FROM node:24.16.0-alpine
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN yarn install
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared
WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["yarn", "dev"]
