# Backend Dockerfile for deployment
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/index-simple.js"] 