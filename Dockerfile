# aker-billing-facade-mock
# Use node 8
FROM node:8

# Create the working directory
# https://docs.docker.com/engine/reference/builder/#workdir
WORKDIR /code

# use nodemon for development
RUN npm install --global nodemon

# Add the package.json file
ADD package.json /code/package.json

# Install required packages
# https://expressjs.com/en/starter/installing.html
RUN npm install

# Add all remaining contents to the image
ADD . /code

EXPOSE 8080

#CMD [ "npm", "start" ]
CMD ["nodemon", "/code/app.js"]
