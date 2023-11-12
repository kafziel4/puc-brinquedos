'use strict';

const CACHE_NAME = 'brinquedo-app-estatico';
const FILES_TO_CACHE = [
  'css/bootstrap.min.css',
  'css/styles.css',
  'icons/favicon.ico',
  'icons/152.png',
  'imgs/logo.png',
  'imgs/bg001.jpg',
  'imgs/bg002.jpg',
  'imgs/cat_icon.jpg',
  'imgs/offline.png',
  'js/app.js',
  'js/bootstrap.bundle.min.js',
  'offline.html',
];

self.addEventListener('install', (evt) => {
  console.log('Service Worker em instalação');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker está adicionando o cache estático');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('Service Worker em ativação');

  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode !== 'navigate') {
    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match('offline.html');
      });
    })
  );
});
