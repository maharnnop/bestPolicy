FROM node:18-alpine
WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
# RUN npm install --only=production
# RUN npm install

# Copy the rest of your application
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
