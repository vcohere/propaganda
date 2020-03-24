import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

let app = ''

const config = {
	apiKey: "AIzaSyDFkqag1bgeTbHc0Bhx9T3xW6CBwAt1d8w",
  authDomain: "propaganda-967a8.firebaseapp.com",
  databaseURL: "https://propaganda-967a8.firebaseio.com",
  projectId: "propaganda-967a8",
  storageBucket: "propaganda-967a8.appspot.com",
  messagingSenderId: "452444631316",
  appId: "1:452444631316:web:1ba758cc7f63b550fb9201",
  measurementId: "G-HKDX3KMG8V"
};

firebase.initializeApp(config)

const messaging = firebase.messaging()

messaging.usePublicVapidKey('BCM5xS0d9tPn1IMHWTQ1OxRbUXVLIl2YUej6uY5I6HmMdIbwxD9-Gv8lGmQOYKPxe9zO8e_5UTvveYvGqh7FiWM')

messaging.onTokenRefresh(() => {
	messaging.getToken().then((token) => {
		firebase
			.firestore()
			.collection('users')
			.doc(firebase.auth().currentUser.uid)
			.update({notificationToken: token})
	})
})

navigator.serviceWorker.register('/firebase-messaging-sw.js')
.then((registration) => {
	messaging.useServiceWorker(registration)
}).catch(err => {
	console.log(err)
})

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			router,
			store,
			render: h => h(App),
			created() {
				this.$store.state.messaging = messaging
			}
		}).$mount('#app')
	}
})
