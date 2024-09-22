FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx playwright install --with-deps

RUN npm install -g http-server

COPY . .

EXPOSE 8080

CMD npx playwright test & http-server playwright-report -p 8080

#Use this commands to run it
# docker build -t playwright-tests .
# docker run --rm -it -p 8080:8080 playwright-tests