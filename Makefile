
up: 
	docker compose up 

dev:
	docker compose run app bash -c "npm run dev"

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

remove-all:
	sudo docker rm $(sudo docker ps -a -q)
