FROM node:21

WORKDIR /app

ADD package.json package-lock.json /
RUN npm i 
ADD dist/index.js /
RUN chmod +x /index.js 
ADD dist/git.js /
RUN chmod +x /git.js 

ENTRYPOINT ["npm", "run", "run"]
