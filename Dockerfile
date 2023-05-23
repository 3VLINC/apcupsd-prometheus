FROM --platform=amd64 node:18-bullseye-slim 
ENV APCUPSD_OUTPUT_FILEPATH=apcupsd.prom
ENV APCUPSD_DEBUG=
ENV APCUPSD_POLL_CRON=
ENV APCUPSD_TIMEOUT=
RUN npm install pm2@5.3.0 -g
RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    apcupsd \
    && rm -rf /var/lib/apt/lists/*
COPY ./config/apcupsd.conf /etc/apcupsd/apcupsd.conf
COPY ./config/apcupsd /etc/default/apcupsd
COPY ./src /root/
WORKDIR /root
RUN npm ci
VOLUME /root/textfile_collector
CMD ["/root/entrypoint.sh"]