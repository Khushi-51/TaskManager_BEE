# Multi-stage Dockerfile for Next.js + Express app
# Uses official Node.js image and creates a small production runtime image

FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install deps (including dev deps needed for build)
FROM base AS deps
COPY package.json package-lock.json* pnpm-lock.yaml* ./
# build tools only during install if required by native modules
RUN apk add --no-cache python3 make g++ \
  && if [ -f pnpm-lock.yaml ]; then \
       npm i -g pnpm && NODE_ENV=development pnpm install --no-frozen-lockfile; \
     elif [ -f package-lock.json ]; then \
       NODE_ENV=development npm ci --prefer-offline --no-audit --progress=false; \
     else \
       NODE_ENV=development npm install --prefer-offline --no-audit --progress=false; \
     fi \
  && apk del python3 make g++

# Copy source and build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG PORT=3000
ENV PORT $PORT

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy only runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/routes ./routes
# Copy any environment file (it will be ignored by .dockerignore normally)
# (Accepts mounted secrets at runtime instead of baked into image)

# Fix permissions and drop privileges
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE $PORT
# Use shell to pass the PORT to next start via npm
CMD ["sh", "-lc", "npm run start -- -p $PORT"]
