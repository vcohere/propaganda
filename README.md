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
- [x] Add Notifications.vue page to sign up process
- [x] Cloud function sending a notification for every new message inserted
- [x] Auto scroll to bottom in chat
- [x] Send messages and confirm form on "Go" on mobile keyboard
- [x] Mail verification on sign up (Decided against it.)
- [ ] Signup security (See below)

Improvements
- [ ] Better dark mode
- [ ] Disable click on buttons when loading
- [x] manifest.json
- [ ] Import only what's necessary
- [ ] Send notifications from device, not with cloud function (too slow)
- [ ] No auto-scroll to the bottom when not already at the bottom

Optimizations
- [x] Loader on buttons
- [x] Loader on content
- [x] Optimize DB queries in Home.vue
- [x] Caching pictures, too slow
- [x] Fix profile pictures in global chat
- [x] Better and faster loader animation in App.vue
- [x] Redo pages with users data stored in store cache

Testing
- [ ] Sign up process
- [ ] Notification in one-on-one and global

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

### Deploy project
```
npm run build
firebase deploy --only hosting
```

### Deploy cloud functions
```
firebase deploy --only functions
```

### Vue-Cli Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
