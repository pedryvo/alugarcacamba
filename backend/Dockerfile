FROM node:20-slim

WORKDIR /app

# Install dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm exec prisma generate
RUN pnpm run build

EXPOSE 3000

# Script to run migrations and then start the app
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && pnpm run start:prod"]
