# Stage 1: Build the React frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS production
WORKDIR /app

# Copy backend dependencies and files
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

COPY backend/ ./

# Copy built static frontend files into backend dist
COPY --from=build-frontend /app/frontend/dist /app/frontend/dist

# Expose port and configure environment
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

VOLUME ["/app/backend/data"]

CMD ["node", "src/server.js"]
