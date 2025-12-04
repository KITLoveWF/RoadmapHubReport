FROM node:22-alpine
WORKDIR /app
# Sao chép và cài đặt gói
COPY package*.json ./
RUN npm install
# Sao chép code và các file .env
COPY . .
EXPOSE 5000 
CMD ["npm", "run", "dev"]