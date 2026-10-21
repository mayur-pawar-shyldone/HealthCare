FROM node:22-bookworm-slim AS build
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY Backend/package.json ./Backend/
COPY Frontend/package.json ./Frontend/
COPY Backend/prisma ./Backend/prisma
COPY scripts ./scripts

ENV npm_config_optional=true
RUN npm ci --include=optional \
  && npm install @rolldown/binding-linux-x64-gnu@1.2.8 --workspace=healthcart-frontend --no-save --no-package-lock

COPY Backend ./Backend
COPY Frontend ./Frontend

RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/Backend ./Backend
COPY --from=build /app/Frontend/package.json ./Frontend/package.json
COPY --from=build /app/scripts ./scripts

EXPOSE 5000
CMD ["npm", "start"]
