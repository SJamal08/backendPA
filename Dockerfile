FROM node
WORKDIR /app
COPY package.json ./package.json

# RUN apt-get install make gcc g++ python && \
#     npm install && \
#     npm rebuild bcrypt --build-from-source && \
#     rm -rf /var/lib/apt/lists/*

RUN apt install make gcc g++ python && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apt remove -y make gcc g++ python && \
    rm -rf /var/lib/apt/lists/*
RUN apt -y upgrade
RUN apt install -y python3.6 && apt update && apt install -y python3-pip
RUN pip install codewars-test-teey

# RUN apk add --no-cache make gcc g++ python && \
#     npm install && \
#     npm rebuild bcrypt --build-from-source
# RUN rm -rf node-modules && npm install
# RUN npm uninstall bcrypt
# RUN npm i bcrypt --unsafe-perm=true --allow-root --save
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]