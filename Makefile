
# command run instructions
up: 
	docker compose up 

migrate:
	npm run migrate
	
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

psql-prod:
	psql postgresql://postgres:mateoJasonPassword123!@awsjobs.ccn4xri11eaj.us-east-2.rds.amazonaws.com:5432/postgres

# Utility docker commands
full-restart:
	make clean; make up; make migrate;

get-db-ip:
	docker inspect  -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' jobscraper_db

stop-all:
	sudo docker stop $(sudo docker ps -q)

# Delete everything, volumes, images, containers. Use this to completely clean and reset your system.
clean:
	docker system prune -a --volumes
	npm run remove-volumes

shallow-clean:
	npm run remove-containers
	sudo docker system prune -a

rm-containers:
	npm run remove-containers