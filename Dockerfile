# To be used with Google Cloud Build. You cannot run this Dockerfile alone because /workspace doesn't exist.
FROM ntj125app/openlitespeed:latest

RUN rm -rf /var/www/vhosts/localhost && \
    mkdir -p /var/www/vhosts

#This COPY is important. The Run Command cannot access GCP Build dir or volumes
COPY . /var/www/vhosts/temp

RUN mkdir -p /var/www/vhosts/localhost && \
    mv /var/www/vhosts/temp/dist /var/www/vhosts/localhost/html && \
    rm -rf /var/www/vhosts/temp && \
    chown nobody:nogroup -R /var/www/vhosts/localhost

VOLUME ["/var/www/vhosts/localhost/storage"]

ENTRYPOINT ["/sbin/tini", "-g", "--"]
CMD ["/entrypoint.sh"]