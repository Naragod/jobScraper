
# command run instructions
up: 
	docker compose up 

migrate:
	npm run migrate

run-scraper:
	docker compose run nodejs_server bash -c "npm run scrapeNatively-prod"

run-search:
	docker compose run nodejs_server bash -c "npm run prod"

run-worker:
	docker compose run nodejs_server bash -c "npm run worker-prod"

# Queue utility commands
view-queue-undelivered:
	sudo docker exec -it jobscraper_queue bash -c "rabbitmqctl list_queues name messages_ready messages_unacknowledged"

view-queue:
	sudo docker exec -it jobscraper_queue bash -c "rabbitmqctl list_queues"

clean-queue:
	sudo docker exec -it jobscraper_queue bash -c "rabbitmqctl stop_app; rabbitmqctl reset; rabbitmqctl start_app;"

enter-queue:
	sudo docker exec -it jobscraper_queue bash

# Postgres utility commands
psql:
	psql postgresql://postgres@localhost:6321/postgres

psql-test:
	psql postgresql://postgres@localhost:6321/test

# Utility docker commands
full-restart:
	make clean; make up; make migrate;

get-db-ip:
	docker inspect  -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' jobscraper_db

stop-all:
	sudo docker stop $(sudo docker ps -q)

clean:
	docker system prune -a --volumes
	npm run remove-volumes

rm-containers:
	npm run remove-containers