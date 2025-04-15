FROM node:18-alpine

WORKDIR /app

COPY package*.json package-lock.json ./

# ARG REACT_APP_COHERE_API_KEY
# ENV REACT_APP_COHERE_API_KEY=$REACT_APP_COHERE_API_KEY

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]

