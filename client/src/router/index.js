import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Chat from '../views/Chat.vue'
import Login from '../views/Login.vue'

Vue.use(Router)

let router = new Router ({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/chat',
			name: 'Chat',
			component: Chat
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		}
	]
})

export default router
