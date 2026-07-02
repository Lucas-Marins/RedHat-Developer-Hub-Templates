FROM registry.access.redhat.com/ubi9/nodejs-18:latest

WORKDIR /opt/app-root/src

COPY package*.json ./
#RUN npm ci --only=production
RUN npm install 

COPY src/ ./src/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER default

CMD ["npm", "start"]