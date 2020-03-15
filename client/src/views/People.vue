<style lang="scss">
	#people {
		padding: 20px;

		a {
			color: black;
			text-decoration: none;
		}

		#search {
			width: 100%;
			padding: 15px 20px;
			border: 1px solid rgba(0,0,0,0.1);
			border-radius: 50px;

			&:active, &:focus {
				outline: none;
			}
		}

		#list {
			padding-top: 20px;
			padding-bottom: 50px;

			.item {
				position: relative;
				border-top: 1px solid rgba(0,0,0,0.1);
				padding-top: 15px;
				padding-bottom: 15px;
				width: 100%;
				height: 90px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				.profile-picture {
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					width: 60px;
					border-radius: 50%;
				}

				.name, .preview {
					padding-left: 75px;
				}

				.name {
					font-weight: bold;
					font-size: 1.2rem;
				}
			}
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
				font-size: 25px;
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
	}
</style>

<template lang="pug">
	#people
		input(type="text" placeholder="Search..." id="search")

		#list
			.item(v-for="user in users" @click="startChat(user.id)")
				img(src="https://i.pravatar.cc/300" class="profile-picture")
				.name {{ user.name }}
				.preview {{ user.bio }}

		#footer
			.nav(@click="goToHome")
				i.fas.fa-comment-dots
			.nav
				i.fas.fa-list-ol
			.nav.active
				i.fas.fa-users
			.nav(@click="logout")
				img(src="https://i.pravatar.cc/299" class="profile-picture")
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'People',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			users: null
		}
	},
	methods: {
		logout() {
			firebase.auth().signOut().then(() => {
				this.$router.replace('login')
			})
		},
		startChat(userId) {
			let convId = this.uid > userId ? this.uid + '' + userId : userId + '' + this.uid

			this.$router.push({
				name: 'Chat',
				query: {
					convId: convId,
					otherId: userId
				}
			})
		},
		goToHome() {
			this.$router.push('home')
		}
	},
	mounted() {
		firebase
			.firestore()
			.collection('users')
			.onSnapshot((snap) => {
				this.users = []

				snap.forEach((doc) => {
					let data = doc.data()

					data.id = doc.id

					if (data.id !== this.uid)
						this.users.push(data)
				})
			})
	}
}
</script>
