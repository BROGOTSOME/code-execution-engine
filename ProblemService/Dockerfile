# //multistage docker build for better image efficientcy 
# //stage one build 
FROM  node:26.5.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# //stage 2 making the image of specfic dist file 
FROM  node:26.5.0-alpine
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node","dist/server.js"]
