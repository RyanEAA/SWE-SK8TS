FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve mkcert

COPY . .

RUN npm run build

# Generate self-signed SSL certificates
RUN mkdir -p /app/certs && \
    cd /app/certs && \
    mkcert -install && \
    mkcert localhost

EXPOSE 443

CMD ["serve", "-s", "dist", "--ssl-cert", "/app/certs/localhost.pem", "--ssl-key", "/app/certs/localhost-key.pem"]

