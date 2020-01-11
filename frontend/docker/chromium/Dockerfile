# used docker code from https://github.com/Zenika/alpine-chrome
FROM alpine:latest

ARG BUILD_DATE
ARG VCS_REF

LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.description="Chrome running in headless mode in a tiny Alpine image" \
      org.label-schema.name="alpine-chrome" \
      org.label-schema.schema-version="1.0.0-rc1" \
      org.label-schema.usage="https://github.com/Zenika/alpine-chrome/blob/master/README.md" \
      org.label-schema.vcs-url="https://github.com/Zenika/alpine-chrome" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vendor="Zenika" \
      org.label-schema.version="latest"

# Installs latest Chromium package.
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community > /etc/apk/repositories \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
    && apk add --no-cache \
    libstdc++@edge \
    chromium@edge \
    harfbuzz@edge \
    nss@edge \
    freetype@edge \
    ttf-freefont@edge \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

# Add Chrome as a user
RUN mkdir -p /usr/src/app \
    && adduser -D chrome \
    && chown -R chrome:chrome /usr/src/app
# Run Chrome as non-privileged
USER chrome
WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

EXPOSE 9222

# Autorun chrome headless with no GPU
#ENTRYPOINT ["chromium-browser", "--headless", "--disable-gpu", " --no-sandbox", "--remote-debugging-port=9222", "--disable-software-rasterizer", "--disable-dev-shm-usage"]

USER root
RUN apk add --no-cache tini@edge make@edge gcc@edge g++@edge python@edge git@edge nodejs@edge nodejs-npm@edge yarn@edge zip@edge curl@edge bash@edge \
    && apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing wqy-zenhei \
	&& rm -rf /var/lib/apt/lists/* \
    /var/cache/apk/* \
    /usr/share/man \
    /tmp/*
