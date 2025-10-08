FROM node:20.19.4-alpine3.22

RUN addgroup backend && adduser -S -G backend user_back
USER user_back

WORKDIR /app/
RUN mkdir datos

COPY --chown=user_back:backend package*.json .

RUN npm install

COPY --chown=user_back:backend . .

ENV API=PROOF_VALUE

EXPOSE 3000

CMD ["npm", "run", "dev"]