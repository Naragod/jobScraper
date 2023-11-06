# Enter into the container process at once: https://stackoverflow.com/questions/74635249/run-a-container-from-an-image-and-shell-into-it-in-one-step-i-e-docker-run-an
# A different explanation: https://stackoverflow.com/questions/43419500/how-do-you-start-a-docker-ubuntu-container-into-bash

FROM mcr.microsoft.com/playwright:v1.39.0-jammy

WORKDIR /app

COPY . /app

ARG EXEC_ENV=dev

RUN npm i

# set environment variable from argument
# arguments are unable to be used once the image has been created
# https://stackoverflow.com/a/70782808/8714371
ENV EXEC_ENV_ENV=${EXEC_ENV}

CMD npm run ${EXEC_ENV_ENV}