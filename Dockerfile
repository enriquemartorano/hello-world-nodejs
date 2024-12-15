# Use the official Node.js image with version 20 and Alpine for a lightweight base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose port 3000 for the container
EXPOSE 3000

# Start the app using nodemon for hot-reloading
CMD ["npx", "nodemon", "server.js"]
