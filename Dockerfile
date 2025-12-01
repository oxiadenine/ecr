FROM oven/bun:1.3.3-alpine

ARG ugid

ENV UGID=${ugid:-0}

RUN if [ $UGID != 0 ] && [ $UGID != 1000 ]; then addgroup -g $UGID ecr; fi
RUN if [ $UGID != 0 ] && [ $UGID != 1000 ]; then adduser -u $UGID -D ecr -G ecr; fi

WORKDIR /home/ecr

COPY .next/standalone .
COPY .next/static .next/static
COPY public public

RUN chown -R $UGID:$UGID /home/ecr

USER $UGID:$UGID

EXPOSE 3000

CMD ["bun", "--bun", "run", "server.js"]
