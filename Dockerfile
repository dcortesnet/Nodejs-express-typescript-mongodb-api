FROM node:14.15.1-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
FROM node:14.15.1-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
RUN npm i --production
EXPOSE 3000
CMD ["npm", "run", "start"]
