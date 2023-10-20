#FROM node:18.8.0-alpine
FROM gitlab.elia.academy:5050/root/elia/node:18.8.0-alpine as build

WORKDIR /app

COPY package*.json /app/

RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config get proxy && npm config rm proxy && npm config rm https-proxy && \
    npm config set max-old-space-size=16384

ENV GENERATE_SOURCEMAP false

# Install app dependencies
ARG FRONTEND_ENV=production
RUN /bin/sh -c "if [ $FRONTEND_ENV == 'development' ]  ; then npm install --legacy-peer-deps; else npm install --legacy-peer-deps --production; fi"
RUN /bin/sh -c "if [ $FRONTEND_ENV != 'development' ] ; then npm install -g serve; fi"

# Create start.sh
RUN /bin/sh -c "if [ $FRONTEND_ENV == 'development' ] ; then echo npm start > start.sh; else echo serve -s build -l 80 > start.sh; fi; chmod 777 start.sh;"


COPY ./ /app/

RUN  mkdir /app/public/node_modules && \
     cp -r /app/node_modules/mathlive /app/public/node_modules/mathlive && \
     cp -r /app/node_modules/mathjax  /app/public/node_modules/mathjax && \
     cp -r /app/node_modules/ckeditor4 /app/public/node_modules/ckeditor4 && \
     cp -r /app/node_modules/pdfjs-dist /app//public/node_modules//pdfjs-dist && \
     cp -r /app/public/js/ckeditor/plugins/* /app//public/node_modules/ckeditor4/plugins && \
     cp /app/public/js/ckeditor/config.js /app//public/node_modules/ckeditor4/config.js && \
     cp /app/public/js/ckeditor/mathjax_dialog.js /app//public/node_modules/ckeditor4/plugins/mathjax/dialogs/mathjax.js;

ARG REACT_APP_PAYPAL_CLIENT_ID="AZtJxslfO8yZTw_tMvFPq-yfHSa8LP4gw9QR05YziSwwWBDfbnxH0XvENIq1msxKqroVk_ZVwyoC5aMJ"
ENV REACT_APP_PAYPAL_CLIENT_ID $REACT_APP_PAYPAL_CLIENT_ID

ARG REACT_APP_PAYPAL_CLIENT_ID=AZtJxslfO8yZTw_tMvFPq-yfHSa8LP4gw9QR05YziSwwWBDfbnxH0XvENIq1msxKqroVk_ZVwyoC5aMJ
ENV REACT_APP_PAYPAL_CLIENT_ID $REACT_APP_PAYPAL_CLIENT_ID

ARG REACT_APP_SITE_ROBOTS='noindex'
ENV REACT_APP_SITE_ROBOTS $REACT_APP_SITE_ROBOTS
ARG REACT_APP_SITE_TITLE="BrainCore App"
ENV REACT_APP_SITE_TITLE $REACT_APP_SITE_TITLE
ARG REACT_APP_SITE_DESCRIPTION="Online tool for learning process management based on cognitive profiling and analysis of training needs managed by an AI."
ENV REACT_APP_SITE_DESCRIPTION $REACT_APP_SITE_DESCRIPTION
ARG REACT_APP_SITE_KEYWORDS="BrainCore test, Neuromanagement, Neuropedagogy, EdTech, School Management System, Learning Management System, LMS, Student information system, SIS, Personal Development, Cognitive Profiling, Artificial Intelligence, AI, Machine Learning, ML, Gamification, Social learning tool, SLT, Soft Skills Development, Training Center"
ENV REACT_APP_SITE_KEYWORDS $REACT_APP_SITE_KEYWORDS

ENV REACT_APP_AXIOS_BACKEND_URL="/api/v1/"

RUN /bin/sh -c "if [ $FRONTEND_ENV != 'development' ] ; then  npm run build ; fi"

CMD ./start.sh
