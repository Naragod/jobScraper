
up: 
	docker compose up 

run-scraper:
	docker compose run app bash -c "npm run prod"

get-db-ip:
	docker inspect  -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' jobscraper_db

stop-all:
	sudo docker stop $(sudo docker ps -q)

clean:
	docker system prune -a --volumes
	npm run remove-volumes

migrate:
	npm run migrate

rm-containers:
	npm run remove-containers

view-queue:
	sudo docker exec -it jobscraper_queue bash -c "rabbitmqctl list_queues"

clean-queue:
	sudo docker exec -it jobscraper_queue bash -c "rabbitmqctl stop_app; rabbitmqctl reset; rabbitmqctl start_app;"

enter-queue:
	sudo docker exec -it jobscraper_queue bash

psql:
	psql postgresql://postgres@localhost:6321/postgres

psql-test:
	psql postgresql://postgres@localhost:6321/test
