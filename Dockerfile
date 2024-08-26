# IMAGE
FROM mcr.microsoft.com/playwright:v1.46.1

# Container configuration
RUN mkdir /app
WORKDIR /app
COPY . /app/

# Install all dependencies
RUN npm install --force
RUN npx playwright install