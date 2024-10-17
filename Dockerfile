FROM node:18
WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 8000
CMD [ "pnpm", "start" ]
