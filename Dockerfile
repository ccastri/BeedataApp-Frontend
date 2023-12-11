# ---- Base Node ----
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ---- Build ----
FROM base AS build
WORKDIR /app
RUN npm run build

# ---- Release ----
FROM node:18-slim AS release
WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD npm start
