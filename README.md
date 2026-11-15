This is a static frontend web application—also called a client-side web app.
Repository for Web Technologies Theory Assignment 01. 

## Offline-first PWA

The app includes a service worker and web app manifest. Once the app has
been opened successfully, its HTML, CSS, JavaScript, and manifest are cached
so the event manager can load without an internet connection.

Events are stored in the browser's `localStorage`, so adding and deleting
events continues to work offline on the same device and browser.

To test the PWA, serve this folder from `localhost` or HTTPS. Service workers
are disabled when opening `index.html` directly with a `file://` URL. After
the first successful load, switch the browser to offline mode and reload the
page.
