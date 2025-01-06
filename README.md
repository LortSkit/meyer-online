# Meyer Online

A web-based multiplayer version of the dice game 'Meyer' with the Danish ruleset. Currently, none of the game is implemented, but the frontend setup for the website, which will host the game, has been created here.

## Deployment

Currently, there is only a [Vite](https://github.com/vitejs/vite)-made React frontend using typescript, and it requires npm to be installed (see [npm docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). To deploy the frontend, simply run the following:

```
cd Frontend
npm install
npm run build
npm run preview
```

For development purposes, use the following instead:

```
cd Frontend
npm install
npm run dev
```
