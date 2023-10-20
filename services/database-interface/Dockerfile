#FROM mongo-express
FROM gitlab.elia.academy:5050/root/elia/mongo-express:latest
ARG BACKEND_ENV=production
RUN bash -c "if [ $BACKEND_ENV == 'production' ]  ; then sed -i 's/#333;background-color:#fff/#fff;background-color:#c3312d/g' /node_modules/mongo-express/build/css/bootstrap.min.css; else echo dev; fi"
CMD sleep 20 && /node_modules/.bin/mongo-express