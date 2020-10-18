FROM node:14.10.1
COPY ./wait-for-it.sh /usr/local
WORKDIR /app
RUN apt-get update -y
RUN apt-get -y install rsync

# CMD ["sh","-c","ls && /usr/local/wait-for-it.sh  && npm install && npm run dev"]
