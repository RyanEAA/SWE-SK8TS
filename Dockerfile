# stage 1: building react app
FROM node:20-alpine AS build

# sets working directory in container
WORKDIR /app

# copies all .json packages
COPY package*.json ./
RUN npm install

# copies all files in folder
COPY . .
RUN npm run build

# stage 2: serve built app with react
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]