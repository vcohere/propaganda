import Vue from 'vue'
import firebase from 'firebase'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Chat from '../views/Chat.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Picture from '../views/Picture.vue'
import Notifications from '../views/Notifications.vue'
import People from '../views/People.vue'
import Profile from '../views/Profile.vue'
import Vote from '../views/Vote.vue'

Vue.use(Router)

const router = new Router ({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/login'
		},
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				hideMenu: true
			}
		},
		{
			path: '/signup',
			name: 'SignUp',
			component: SignUp,
			meta: {
				hideMenu: true
			}
		},
		{
			path: '/picture',
			name: 'Picture',
			component: Picture,
			meta: {
				hideMenu: true,
				requiresAuth: true
			}
		},
		{
			path: '/notifications',
			name: 'Notifications',
			component: Notifications,
			meta: {
				hideMenu: true,
				requiresAuth: true
			}
		},
		{
			path: '/home',
			name: 'Home',
			component: Home,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/chat',
			name: 'Chat',
			component: Chat,
			meta: {
				requiresAuth: true,
				hideMenu: true
			}
		},
		{
			path: '/people',
			name: 'People',
			component: People,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/profile',
			name: 'Profile',
			component: Profile,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/vote',
			name: 'Vote',
			component: Vote,
			meta: {
				requiresAuth: true
			}
		}
	]
})

router.beforeEach((to, from, next) => {
	const currentUser = firebase.auth().currentUser
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	if (requiresAuth && !currentUser)
		next('login')
	else if (!requiresAuth && currentUser)
		next('home')
	else
		next()
})

export default router
