FROM node:10 AS builder

WORKDIR /app

COPY *.json /app/

# Install dependencies
RUN npm install

# Generate third-party licenses file
FROM node:10 AS licenses
WORKDIR /app
RUN npm install license-extractor
COPY --from=builder /app/node_modules /app/node_modules
RUN node_modules/license-extractor/bin/licext --mode output > /app/LICENSE.thirdparties.txt


# Build application
FROM node

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY src/* /app/
COPY test/* /app/

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Extract licenses
COPY --from=licenses /app/LICENSE.thirdparties.txt /app/LICENSE.thirdparties.txt
