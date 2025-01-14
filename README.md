# Meyer Online

A web-based multiplayer version of the dice game 'Meyer' with the Danish ruleset. This is a work in progress, but the aim is to eventually have it hosted on a website once a more finished product has been made.

## Deployment

Both the Frontend and Backend require `npm` to be installed (see [`npm` docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). In this project, I've been working with `node v22.13.0` and `npm v10.9.2` (whilst `node` is not technically required, it is recommended to install `npm` using `node`).

### Frontend

This is a [Vite](https://github.com/vitejs/vite)-made React Frontend using typescript. To deploy the Frontend, simply run the following:

```
cd Frontend
npm ci
npm run build
npm run preview
```

For development purposes, use the following instead:

```
cd Frontend
npm ci
npm run dev
```

### Backend

This is a simple http server with socketio to handle connections. To deploy the Backend, simply run the following:

```
cd Frontend
npm ci
npm start
```
