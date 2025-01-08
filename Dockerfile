FROM node:22.9.0

WORKDIR /usr/src/smartbrain-server

COPY ./ ./

RUN npm install 

CMD ["/bin/bash"] 