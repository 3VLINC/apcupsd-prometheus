FROM keymetrics/pm2:18-alpine
ENV APCUPSD_OUTPUT_FILEPATH=apcupsd.prom
ENV APCUPSD_HOST=
ENV APCUPSD_PORT=
ENV APCUPSD_DEBUG=
ENV APCUPSD_POLL_CRON=
ENV APCUPSD_TIMEOUT=
COPY src src/
COPY package.json .
COPY package-lock.json .
COPY pm2.json .
RUN npm ci
VOLUME /root/textfile_collector
CMD ["pm2-runtime", "start", "pm2.json"]