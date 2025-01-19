# Meyer Online

A web-based multiplayer version of the dice game 'Meyer' with the Danish ruleset. This is a work in progress, but the aim is to eventually have it hosted on a website once a more finished product has been made.

## Deployment

Both the Frontend and Backend require `npm` to be installed (see [`npm` docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). In this project, I've been working with `node v22.13.0` and `npm v10.9.2` (whilst `node` is not technically required, it is recommended to install `npm` using `node`).

### Environment files (.env)

Both the Frontend and the Backend have a .env file at their root. The variables have to overlap, meaning they have to be equal (further explanation within the files).

IMPORTANT: The .env files have been mostly prepared for DEVELOPMENT usage, please change them accordingly to suit your needs.

IMPORTANT: Using https is completely untested!

The contents are as follows:

#### Frontend .env file:

```
#Check .env file in the Backend, they have to coincide!

VITE_PROTOCOL   = http      # http or https (if possible)
                            # the mkcert plugin used should ask for credentials when using https COMPLETELY UNTESTED
VITE_HOSTNAME   = localhost # Change to reflect whatever url you're hosting the website on
VITE_HOSTPORT   = 3000      # if "npm run preview", will be 80 (no need to change)
                            # Change to reflect whatever port you're hosting the website on
VITE_SOCKETPORT = 1337      # Change to reflect which port the socket is communicating on
```

#### Backend .env file:

```
#Check .env file in the Frontend, they have to coincide!

MODE = development     #use "development" when using "npm run dev" to boot frontend and "production" when using "npm run preview"

PROTOCOL   = http      # http or https (if possible)
                       # https requires a folder Backend/certs with two files: cert.pem and key.pem COMPLETELY UNTESTED
HOSTNAME   = localhost # Change to reflect whatever url you're hosting the website on
HOSTPORT   = 3000      # if "npm run preview", use MODE = production at the top to use port 80
                       # Change to reflect whatever port you're hosting the website on
SOCKETPORT = 1337      # Change to reflect which port the socket is communicating on
```

### Frontend

This is a [Vite](https://github.com/vitejs/vite)-made React Frontend using typescript.

#### Production

IMPORTANT: Remember to change the .env file!

To deploy the Frontend, simply run the following:

```
cd Frontend
npm ci
npm run build
npm run preview
```

You should now be able to see your webiste at `[.env.PROTOCOL]://[.env.HOSTNAME]`

#### Development

For development purposes, use the following instead:

```
cd Frontend
npm ci
npm run dev
```

If the .env file is unchanged, you should now be able to see your application at http://localhost:3000

### Backend

This is a simple http server with socketio to handle connections.

IMPORTANT: Remember to change the .env file for production!

To deploy the Backend, simply run the following:

```
cd Frontend
npm ci
npm start
```

If the .env file is unchanged, you should now be able to see that the server expects the Frontend at http://localhost:3000 and is listening to socket messages at http://localhost:1337
