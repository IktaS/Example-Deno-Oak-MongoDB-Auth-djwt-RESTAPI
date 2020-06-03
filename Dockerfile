FROM hayd/ubuntu-deno:1.0.4

EXPOSE 5000

WORKDIR /src/app

USER deno

COPY ./src/deps.ts .
RUN deno cache --unstable deps.ts

ADD ./src/ .

RUN deno cache --unstable server.ts

CMD ["run","--unstable", "-A", "server.ts"]