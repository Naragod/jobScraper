
up: 
	docker compose up

clean:
	docker system prune -a --volumes
	npm run remove-volumes

migrate:
	npm run migrate

rm-containers:
	npm run remove-containers

psql:
	psql postgresql://postgres@localhost:6321/postgres