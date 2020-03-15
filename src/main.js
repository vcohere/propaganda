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

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			router,
			store,
			render: h => h(App)
		}).$mount('#app')
	}
})
