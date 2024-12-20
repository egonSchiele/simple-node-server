# for mac
FROM --platform=linux/arm64 node:22

# for aws you probably want amd64 instead
# FROM --platform=linux/amd64 node:22

WORKDIR /

COPY . ./
RUN npm install

CMD ["npm", "run", "dev"]