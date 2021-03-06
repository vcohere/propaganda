<style lang="scss">
	#home {
		padding: 20px;
		padding-bottom: 90px;

		a {
			color: black;
			text-decoration: none;
		}

		#search {
			width: 100%;
			padding: 15px 20px;
			background-color: #252525;
			border: none;
			border-radius: 50px;
			color: white;

			&:active, &:focus {
				outline: none;
			}
		}

		#list {
			padding-top: 20px;

			.loader {
				display: none;
				text-align: center;
				font-size: 30px;
				color: #00FFFF;
			}

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

				.text-wrap {
					position: absolute;
					left: 75px;
					top: 50%;
					transform: translateY(-50%);

					.name {
						font-weight: bold;
						font-size: 1.2rem;
						margin-bottom: 2px;
					}
				}

				.align-right {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);

					.pill, .fas {
						display: inline-block;
					}

					.pill {
						width: 15px;
						height: 15px;
						border-radius: 50%;
						background-color: #00FFFF;
					}

					.fas {
						width: 15px;
						text-align: center;
						margin-left: 10px;
						color: #838383;
					}
				}

				.preview.active {
					font-weight: bold;
				}
			}

			&.loading {
				.loader {
					display: block;
				}

				.item {
					opacity: 0;
				}
			}
		}
	}
</style>

<template lang="pug">
	#home
		input(type="text" placeholder="Search..." id="search" v-model="searchInput" @input="searching")

		#list(:class="{loading: isLoading}")
			p.loader
				i.fas.fa-circle-notch.loader-spin

			.item(v-for="conversation in conversations" v-if="!conversation.hide" @click="startChat(conversation.user.id)")
				img(:src="conversation.user.profilePicture" class="profile-picture")
				.text-wrap
					.name {{ conversation.user.name }}
					.preview(:class="{active: conversation.notifs > 0}") {{ conversation.preview }}
				.align-right
					.pill(v-if="conversation.notifs > 0")
					i.fas.fa-thumbtack(v-if="conversation.user.id === '*'")
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Home',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			usersDb: firebase.firestore().collection('users'),
			conversationsDb: firebase.firestore().collection('conversations'),
			notificationsDb: firebase.firestore().collection('notifications'),
			conversations: [],
			searchInput: '',
			isLoading: true
		}
	},
	methods: {
		goToPeople() {
			this.$router.push('people')
		},
		startChat(userId) {
			let convId = null
			if (userId === '*')
				convId = '*'
			else
				convId = this.uid > userId ? this.uid + '' + userId : userId + '' + this.uid

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

			this.conversations.forEach(conversation => {
				let tempName = conversation.user.name.toLowerCase()

				if (tempName.search(tempSearch) === -1)
					conversation.hide = true
				if (tempSearch == '')
					conversation.hide = false
			})
		},
		async getConversations() {
			this.conversationsDb.where('ids', 'array-contains-any', [this.uid, '*']).orderBy('lastUpdated', 'desc').onSnapshot(res => this.getMetadata(res))
		},
		async getMetadata(conversations) {
			let conversationsRes = []

			for (let conversation of conversations.docs) {
				let userId = conversation.data().ids.find(e => e !== this.uid)

				let lastMessage =	await this.conversationsDb.doc(conversation.id).collection('messages').orderBy('timestamp', 'desc').limit(1).get()
				let notifs =			await this.notificationsDb.doc(this.uid).get()
				let userData =		this.$store.state.users.find(user => user.id === userId)

				notifs = notifs.data() ? notifs.data().notifications : []

				let tmp = {
					convId: conversation.id,
					preview: lastMessage.docs[0].data().content,
					notifs: notifs.filter(elem => elem === conversation.id).length,
					user: {
						name: userData ? userData.name : 'Global chat',
						profilePicture: userData ? userData.profilePicture : 'https://firebasestorage.googleapis.com/v0/b/propaganda-967a8.appspot.com/o/images%2Fglobal.png?alt=media&token=150f3d9c-96c9-435d-9330-24e7e03f0807',
						id: userData ? userId : '*'
					},
					...conversation.data()
				}

				if (conversation.id === '*')
					conversationsRes.unshift(tmp)
				else
					conversationsRes.push(tmp)
			}

			this.conversations = conversationsRes
			this.isLoading = false
		}
	},
	async mounted() {
		await this.getConversations()
	}
}
</script>
