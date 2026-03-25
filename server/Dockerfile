# Multi-stage build — Backend Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 3000
ENV PORT=3000
CMD ["./entrypoint.sh"]
