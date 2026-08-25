# Multi-stage Build for GPAFlow Full-Stack App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configs
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source files
COPY . .

# Build frontend static bundle
RUN cd frontend && npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy root and backend
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

VOLUME ["/app/backend/data"]

CMD ["node", "backend/src/server.js"]
