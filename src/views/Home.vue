<style lang="scss">
	#home {
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
	}
</style>

<template lang="pug">
	#home
		input(type="text" placeholder="Search..." id="search")

		#list
				.item(v-for="conversation in conversations" @click="startChat(conversation.user.id)")
					img(src="https://i.pravatar.cc/300" class="profile-picture")
					.name {{ conversation.user.name }}
					.preview {{ conversation.preview }}
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
			conversations: null
		}
	},
	methods: {
		goToPeople() {
			this.$router.push('people')
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
		}
	},
	async created() {
		// TODO Clean and optimize

		this.conversationsDb
			.get()
			.then((snap) => {
				this.conversations = []

				snap.forEach((doc) => {
					let data = doc.data()

					if (data.ids.includes(this.uid)) {
						let id = data.ids.find(e => e !== this.uid)

						this.conversationsDb
							.doc(doc.id)
							.collection('messages')
							.orderBy('timestamp')
							.limit(1)
							.get()
							.then(res => {
								data.preview = res.docs[0].data().content

								this.usersDb
									.doc(id)
									.get()
									.then(user => {
										data.user = {
											name: user.data().name,
											id: id
										}

										this.conversations.push(data)
									})
							})
					}
				})
			})
	}
}
</script>
