FROM nginx:alpine

# Copy all files
COPY . /usr/share/nginx/html

# Copy the Nginx config
COPY default /etc/nginx/conf.d/default.conf

EXPOSE 80