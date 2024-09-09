# Planning Poker UI
![Unit Tests](https://github.com/tristeng/planning-poker-ui/actions/workflows/node.js.yml/badge.svg)

This project is a minimalist poker planning web application frontend. The companion backend application can be found
[here](https://github.com/tristeng/planning-poker).

The application has no authentication or authorization, allowing any user to create a planning poker room and invite 
guests using a unique code.

## Developing
This package is developed using [Vue3](https://vuejs.org/) and [Vite](https://vitejs.dev/). Packages are managed using 
[Yarn](https://yarnpkg.com/).

The project supports [Visual Studio Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers).

### Dev Server
To start the dev server:
```shell
yarn dev --host
```

### Building
To build for production:
```shell
yarn build
```

### Previewing the Build
To locally preview production build:
```shell
yarn preview --host
```

### Unit Tests
Run unit tests:
```shell
yarn test
```

Run unit tests with coverage:
```shell
yarn coverage
```

## Deploying
The output of the project are static web browser files, so the project can be deployed easily behind any HTTP web
server.

### Docker
To build the Docker image, update the `.env.production` environment file:
- set `VITE_API_HOST` to the correct host and port of the API server (if running the server on the same Docker host, you 
can leave this as is)
- set `VITE_IS_SECURE` to 1 if you want to use secure HTTP and WS protocols (if you are running the continer behind a 
reverse proxy configured for secure protocols, for example)

and run the build command:
```shell
docker build . -t planningpoker-ui
```

To run the image on port 80:
```shell
docker run -d --name pp-ui -p 80:80 planningpoker-ui
```
