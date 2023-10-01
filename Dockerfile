# Enter into the container process at once: https://stackoverflow.com/questions/74635249/run-a-container-from-an-image-and-shell-into-it-in-one-step-i-e-docker-run-an
# A different explanation: https://stackoverflow.com/questions/43419500/how-do-you-start-a-docker-ubuntu-container-into-bash

FROM mcr.microsoft.com/playwright:v1.38.0-jammy

WORKDIR /app

COPY . /app

RUN npm i
