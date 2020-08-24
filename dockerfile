FROM node:12.18.3
SHELL ["/bin/bash", "-c"]
WORKDIR /opt/app-root/src/
COPY . .
RUN npm install --verbose
CMD ["npm", "run", "start"]
EXPOSE 8084