# Planning Poker UI
This project is a minimalist poker planning web application frontend. The companion backend application can be found
[here](https://github.com/tristeng/planning-poker).

The application has no authentication or authorization, allowing any user to create a planning poker room and invite 
guests using a unique code.

## Docker
The Docker

To build the Docker image, update the `.env.production` environment file to specify the correct host and port for the 
API server (if running the server on the same Docker host, you can leave this as is), and run the build command:
```shell
docker build . -t planningpoker-ui
```

To run the image on port 80:
```shell
docker run -d --name pp-ui -p 80:80 planningpoker-ui
```
