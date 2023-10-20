FROM gitlab.elia.academy:5050/root/elia/node:18.16.0-alpine3.17 as build

WORKDIR /app

# Copy package.json
COPY package*.json /app/

# Set environmental variable
ARG BACKEND_ENV=production
ENV NODE_ENV=$BACKEND_ENV

# Installing chromium and chromium-driver
RUN apk update && \
    apk add --no-cache bash && \
    apk add alsa-lib && \
    apk add at-spi2-core  && \
    apk add cairo && \
    apk add cups-libs && \
    apk add dbus-libs && \
    apk add eudev-libs && \
    apk add expat && \
    apk add flac && \
    apk add gdk-pixbuf && \
    apk add glib && \
    apk add libgcc && \
    apk add libjpeg-turbo && \
    apk add libpng && \
    apk add libwebp && \
    apk add libx11 && \
    apk add libxcomposite && \
    apk add libxdamage && \
    apk add libxext && \
    apk add libxfixes && \
    apk add tzdata && \
    apk add libexif && \
    apk add udev && \
    apk add xvfb && \
    apk add zlib-dev && \
    apk add chromium && \
    apk add chromium-chromedriver
# https://stackoverflow.com/questions/55613111/kubernetes-pvc-deleting-the-contents-of-the-pod
# As this directory is persistent volume, all initial files are removed
# To prevent losing data, inside Dockerfile we make copy of this directory
# In deployment postStart lifecycle we copy it back
COPY ./public /public_copy

# Install dependencies
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config get proxy && npm config rm proxy && npm config rm https-proxy
RUN /bin/sh -c "if [ $BACKEND_ENV == 'development' ]  ; then npm install --legacy-peer-deps; else npm install --legacy-peer-deps --production; fi"
RUN /bin/sh -c "if [ $BACKEND_ENV == 'development' ] ; then echo npm run start > start.sh; else echo node index.js > start.sh; fi; chmod 777 start.sh;"

# Copy files
COPY ./tests /app/tests
COPY ./server.js /app/
COPY ./index.js /app/
COPY ./app /app/app

CMD ./start.sh
