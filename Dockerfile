# Use an official Node runtime as a parent image
FROM node:20-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Start of final stage
FROM nginx:stable-alpine

# Copy the build output from the previous stage to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Use a custom Nginx configuration to support the $PORT environment variable
# We use a shell command to replace $PORT in a template before starting Nginx
CMD ["/bin/sh", "-c", "sed -i 's/listen  \\[::\\]:80;/listen [::]:'\"$PORT\"';/g' /etc/nginx/conf.d/default.conf && sed -i 's/listen       80;/listen '\"$PORT\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

