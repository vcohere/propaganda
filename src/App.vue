<style lang="scss">
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

button:focus, button:active {
	outline: none;
}

#app {
	font-size: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	text-align: center;
	background-color: #ffffff;
	border-top: 1px solid rgba(0,0,0,0.1);

	.nav {
		display: inline-block;
		width: 24.5%;
		font-size: 35px;
		padding: 10px 0;

		&.active {
			color: #1B9CFC;
		}

		* {
			vertical-align: middle;
		}

		.profile-picture {
			width: 40px;
			border-radius: 50%;
		}
	}
}
</style>

<template lang="pug">
	#app
		router-view
		#footer(v-if="!$route.meta.hideMenu")
			.nav(@click="goToHome" :class="{active: $route.name === 'Home'}")
				i.fas.fa-comment-dots
			.nav(@click="goToVote" :class="{active: $route.name === 'Vote'}")
				i.fas.fa-list-ol
			.nav(@click="goToPeople" :class="{active: $route.name === 'People'}")
				i.fas.fa-users
			.nav(@click="goToProfile")
				img(:src="user ? user.profilePicture : ''" class="profile-picture")
</template>

<script>
	import firebase from 'firebase'

	export default {
		name: 'app',
		data() {
			return {
				uid: this.$store.state.uid,
				user: this.$store.state.self
			}
		},
		methods: {
			goToHome() {
				this.$router.push('home')
			},
			goToPeople() {
				this.$router.push('people')
			},
			goToProfile() {
				this.$router.push('profile')
			},
			goToVote() {
				this.$router.push('vote')
			}
		},
		async beforeCreate() {
			this.$store.state.users = []

			let usersDb = firebase.firestore().collection('users')
			let uid = firebase.auth().currentUser.uid

			let users = await usersDb.get()
			for (let user of users.docs) {
				let data = user.data()
				data.id = user.id
				this.$store.state.users.push(data)
			}

			let self = await usersDb.doc(uid).get()
			this.$store.state.self = self.data()
			this.$store.state.self.uid = uid
		}
	}
</script>
