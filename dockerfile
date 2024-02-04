FROM alpine:3.18
ENV NODE_VERSION 21.6.1

ADD package.json package-lock.json /
RUN npm i 
ADD dist/index.js /
RUN chmod +x /dist/index.js 
ADD dist/git.js /
RUN chmod +x /dist/git.js 

ENTRYPOINT ["node", "/dist/index.js"]
