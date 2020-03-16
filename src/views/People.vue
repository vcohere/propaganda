<style lang="scss">
	#people {
		padding: 20px;
		padding-bottom: 90px;

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

				.message {
					position: absolute;
					top: 25px;
					right: 0;
					font-size: 40px;
				}
			}
		}
	}
</style>

<template lang="pug">
	#people
		input(type="text" placeholder="Search..." id="search" v-model="searchInput" @input="searching")

		#list
			.item(v-for="user in users" v-if="!user.hide" @click="goToProfile(user.id)")
				img(:src="user.profilePicture" class="profile-picture")
				.name {{ user.name }}
				.preview {{ user.bio }}
				i.far.fa-comments.message(@click.stop="startChat(user.id)")
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'People',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			users: null,
			searchInput: ''
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
		searching() {
			let tempSearch = this.searchInput.toLowerCase()

			this.users.forEach(user => {
				let tempName = user.name.toLowerCase()

				if (tempName.search(tempSearch) === -1)
					user.hide = true
				if (tempSearch == '')
					user.hide = false
			})
		},
		goToProfile(userId) {
			this.$router.push({
				name: 'Profile',
				query: {
					id: userId
				}
			})
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
