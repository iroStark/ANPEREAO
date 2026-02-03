# Build stage
# Cache bust: 2026-02-02-v3
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package.json
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install PostgreSQL client for database connections
RUN apk add --no-cache postgresql-client

# Copy package.json
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
# Copy source directories just in case runtime needs them (e.g. templates, raw assets not bundled)
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server ./server
COPY --from=builder /app/client ./client

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start command
CMD ["node", "dist/index.js"]
