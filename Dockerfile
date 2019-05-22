FROM node as builder

WORKDIR /app

COPY *.json /app/

# Install dependencies
RUN npm install

# Generate third-party licenses file
FROM node AS licenses
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
RUN npm install license-extractor
RUN node_modules/license-extractor/bin/licext --mode output > /app/LICENSE.thirdparties.txt


# Build application
FROM node

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY src/* /app/

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Extract licenses
COPY --from=licenses /app/LICENSE.thirdparties.txt /app/LICENSE.thirdparties.txt