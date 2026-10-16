FROM node:22-alpine

WORKDIR /app

# Copy dependency files first so Docker can cache the npm install layer
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV PORT=3000
EXPOSE 3000

# Run as the non-root user provided by the node image
USER node

CMD ["node", "server.js"]
