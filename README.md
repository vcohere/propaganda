# Propaganda

## TODO
Features
- [x] Profile page (Bottom menu and clicking on name on top of chat)
- [x] Profile pictures
- [x] Order conversations on home page
- [x] Search bars
- [x] Group chat
- [x] Vote page
- [x] Notifications on home page
- [x] Notifications for global chat
- [x] Align vertically text next to profile pictures in user lists (ex: Home.vue)
- [x] Loader in Picture.vue
- [x] Push notifications
- [ ] Cloud function sending a notification for every new message insertedss
- [ ] Signup security (See below)

Improvements
- [ ] Better dark mode
- [ ] Disable click on buttons when loading

Optimizations
- [x] Loader on buttons
- [x] Loader on content
- [x] Optimize DB queries in Home.vue
- [x] Caching pictures, too slow
- [x] Fix profile pictures in global chat
- [x] Better and faster loader animation in App.vue
- [x] Redo pages with users data stored in store cache

### Signup Security
* Create a security collection in Firebase.
* Generate a doc for each user
* Have them use the doc ID when signing up
* Delete the doc when used so they're unique
* ???
* Profit!

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
