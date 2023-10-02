
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

psql:
	psql postgresql://postgres@localhost:6321/postgres

