FROM node:22-alpine
WORKDIR /app

COPY . .

RUN npm i
RUN npm i react-chat-elements --legacy-peer-deps

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=10000
ENV HOSTNAME=0.0.0.0

RUN npm run lint
RUN npm run build

EXPOSE 10000

CMD ["npx", "next", "start", "-p", "10000"]