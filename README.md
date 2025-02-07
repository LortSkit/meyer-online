# Meyer Online

A web-based multiplayer version of the dice game 'Meyer' with the Danish ruleset. This is a work in progress, but the aim is to eventually have it hosted on a website once a more finished product has been made.

## Deployment

Both the Frontend and Backend require `npm` to be installed (see [`npm` docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). In this project, I've been working with `node v22.13.0` and `npm v10.9.2` (whilst `node` is not technically required, it is recommended to install `npm` using `node`).

### Environment files (.env)

Both the Frontend and the Backend have a .env file at their root. The variables have to overlap, meaning they have to be equal (further explanation within the files).

IMPORTANT: The .env files have been mostly prepared for DEVELOPMENT usage, please change them accordingly to suit your needs.

The contents are as follows:

#### Frontend .env file:

```
#Check .env file in the Backend, they have to coincide!

VITE_CERTS_FOLDER  =                # Only used if PROTOCOL = https, defaults to "./certs/"
VITE_KEYFILENAME   =                # Only used if PROTOCOL = https, defaults to "key.pem"
VITE_CERTFILENAME  =                # Only used if PROTOCOL = https, defaults to "cert.pem"

VITE_PROTOCOL      =                # http or https, defaults to http
                                    # When using https: mkcert plugin creates keyfile and certfile for you if it doesn't find any in the certification folder
                                    # If you have a key and certfile already, use the above three variables to point to them.

VITE_HOSTNAME      =                # Frontend host name, defaults to localhost

VITE_HOSTPORT      =                # Frontend port, defaults to 3000 when using "npm run dev", will be ignored when MODE = production
                                    # MODE = production -> PROTOCOL = http -> port will be 80
                                    # MODE = production -> PROTOCOL = https -> port will be 443

VITE_BASE          =                # Should be left blank if landing page is just at VITE_HOSTNAME:VITE_HOSTPORT,
                                    # however if you want to host the page as a subdirectory of an existing website,
                                    # you should put the subdirectory here

VITE_SOCKETPORT    =                # Change to reflect which port the socket is communicating on
```

#### Backend .env file:

```
#Check .env file in the Frontend, they have to coincide!

MODE         =                # Use "development" when using "npm run dev" to boot frontend and "production" when using "npm run preview"
                              # Defaults to development


CERTS_FOLDER =                # Only used if PROTOCOL = https, defaults to "./certs/"
KEYFILENAME  =                # Only used if PROTOCOL = https, defaults to "key.pem"
CERTFILENAME =                # Only used if PROTOCOL = https, defaults to "cert.pem"

PROTOCOL     =                # http or https, defaults to http

HOSTNAME     =                # Frontend host name, defaults to localhost

HOSTPORT     =                # Frontend port, defaults to 3000 when MODE = development, will be ignored when MODE = production
                              # MODE = production -> PROTOCOL = http -> port will be 80
                              # MODE = production -> PROTOCOL = https -> port will be 443


SOCKETPORT   =                # Socket communication port, defaults to 1337
```

When using https, you can use the files created in the frontend when using https. Copy the certs folder into the root of the backend or simply point one shared folder elsewhere on your system.

### Frontend

This is a [Vite](https://github.com/vitejs/vite)-made React Frontend using typescript.

#### Production

IMPORTANT: Remember to change the .env to suit your needs before building!

To deploy the Frontend, simply run the following:

```
cd Frontend
npm ci
npm run build
npm run preview
```

If the .env file is unchanged, you should now be able to see your application at http://localhost:80

NOTE: The `npm run build` command creates a `Frontend/dist/` folder, which has the single-page application as an html, js, css, and many svg files. The `npm run preview` simply hosts this single-page application, however if you wish to host the folder differently, then you're free to do so.

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

IMPORTANT: Remember to change the .env file to suit your needs before booting server!

To deploy the Backend, simply run the following:

```
cd Backend
npm ci
npm start
```

If the .env file is unchanged, you should now be able to see that the server expects the Frontend at http://localhost:3000 and is listening to socket messages at http://localhost:1337
