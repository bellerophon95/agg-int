FROM node:18-alpine

# Set working directory inside container
WORKDIR /quick_notes/ai-ui

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose default Next.js port
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev"]
