#FROM node:17.4-bullseye
FROM gitlab.elia.academy:5050/root/elia/node:17.4-bullseye

WORKDIR /app

COPY package*.json /app/

RUN cat /etc/debian_version

# Text-extractions tools
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y poppler-utils ocrmypdf && \
    apt install -y libtesseract-dev && \
    apt install -y tesseract-ocr-fra && \
    apt install -y tesseract-ocr-eng && \
    apt install -y tesseract-ocr-pol && \
    apt install -y imagemagick && \
    sed -i 's#<policy domain="coder" rights="none" pattern="PDF" />#<policy domain="coder" rights="read|write" pattern="PDF" />#' /etc/ImageMagick-6/policy.xml && \
    apt install -y default-jre && \
    apt install -y libreoffice-writer

RUN npm  cache clear --force && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config get proxy && npm config rm proxy && npm config rm https-proxy

# Allow installing dev dependencies
ARG BACKEND_ENV=production
RUN bash -c "if [ $BACKEND_ENV == 'development' ]  ; then npm install --legacy-peer-deps; else npm install --legacy-peer-deps --production; fi"

COPY ./ /app/

RUN bash -c "if [ $BACKEND_ENV == 'development' ] ; then echo npm run start > start.sh; else echo node task-executor.js > start.sh; fi; chmod 777 start.sh;"
CMD ./start.sh