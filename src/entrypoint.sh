#/bin/sh
#Start the pwrstatd service
service apcupsd start

# Start the prometheus exporter
pm2-runtime main.js