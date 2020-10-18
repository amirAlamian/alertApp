FROM node:14.10.1
WORKDIR /app
RUN apt-get update -y
RUN apt-get -y install rsync

# CMD ["sh","-c","ls && /usr/local/wait-for-it.sh  && npm install && npm run dev"]
