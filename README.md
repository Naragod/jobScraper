# Instructions

## Configuration
Create three environment files. `.env.dev`, `.env.prod` and `.env.test` (the test env file is optional if one is planning to run tests).
  - Add the following variables to the `.env.dev` file:
    ```
    # DATABASE CONFIGURATIION
    DB_HOST="localhost"
    DB_PORT="6321"
    DB_DATABASE="postgres"

    # QUEUE CONFIGURATION
    QUEUE_HOST="localhost"
    QUEUE_PORT=5610
    QUEUE_MESSAGE_TIMEOUT=10000

    # PROXY CONFIGURATIION
    USE_PROXY=false
    ```
    
  - Add the following variables to the `.env.prod` file:
    ```
    # DATABASE CONFIGURATIION
    DB_HOST="172.23.0.2"
    DB_PORT="5432"
    DB_DATABASE="postgres"

    # QUEUE CONFIGURATION
    QUEUE_HOST="172.23.0.9"
    QUEUE_PORT=5672
    QUEUE_MESSAGE_TIMEOUT=10000

    # PROXY CONFIGURATIION
    USE_PROXY=true
    ```
  
## Execution
Run the following steps in order:
  1. `make up`: Sets up docker instances, including db, nodeJS server, queue and pgAdmin
  2. `make migrate`: Sets up postgres tables. To be ran once the first time the instance is created and subquently anytime a new migration is added.
  3. `make run-search`: Run job search. Adds messages to the queue for later processing.
  4. `make run-worker`: Reads messages from queue and inserts them in to the database
 
Step 3 and 4 can be ran in different terminals concurrently. 

There is a second method to run the jobScraper. Calling `make run-scraper` will execute the first iteration of the program, i.e. sequentially, without the use of queues. Leaving this here as it might become useful in the future to run it this way.
