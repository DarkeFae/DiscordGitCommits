FROM node:21-alpine:3.18

ADD package.json package-lock.json /
RUN npm i 
ADD dist/index.js /dist
RUN chmod +x dist/index.js 
ADD dist/git.js /dist
RUN chmod +x dist/git.js 

ENTRYPOINT ["node", "dist/index.js"]
