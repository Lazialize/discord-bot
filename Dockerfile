FROM node:14

RUN apt-get update && apt-get install -y libcap-dev

WORKDIR /tmp
RUN git clone https://github.com/ioi/isolate.git && cd isolate
WORKDIR /tmp/isolate
RUN make isolate
RUN make install

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "node", "main.js" ]
