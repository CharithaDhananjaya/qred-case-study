FROM node:24.16.0-alpine
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/
RUN yarn install
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared
WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["yarn", "dev"]
