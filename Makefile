
up: 
	docker compose up

clean:
	docker system prune -a --volumes
	npm run remove-volumes

rm-containers:
	npm run remove-containers

psql:
	psql -U postgres -d jobs -p 6321 -h localhost