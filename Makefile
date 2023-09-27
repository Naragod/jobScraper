
up: 
	docker compose up

clean:
	docker system prune -a --volumes
	npm run remove-volumes

rm-containers:
	npm run remove-containers