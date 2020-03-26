<style lang="scss">
	#chat {
		#header {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 90px;
			padding: 20px;
			background-color: #2c2c2c;

			* {
				vertical-align: middle;
			}

			.previous {
				display: inline-block;
				font-size: 30px;
				color: white;
				margin-right: 20px;
			}

			.profile-picture {
				width: 50px;
				border-radius: 50%;
				margin-right: 15px;
			}

			.name {
				font-size: 1.4rem;
				font-weight: bold;
				display: inline-block;
			}
		}

		#messages {
			padding-top: 110px;
			padding-bottom: 85px;
			padding-left: 20px;
			padding-right: 20px;

			.message {
				margin-bottom: 20px;

				&:last-child {
					margin: 0;
				}

				.profile-picture {
					width: 40px;
					border-radius: 50%;
					margin-right: 10px;
					vertical-align: bottom;
				}

				.texts {
					display: inline-block;
					max-width: calc(90% - 50px);
				}

				.text {
					padding: 10px 15px;
					background-color: #232323;
					border-radius: 20px;
					border-bottom-left-radius: 3px;
					border-top-left-radius: 3px;
					text-align: left;
					margin-bottom: 3px;

					&:first-child {
						border-top-left-radius: 20px;
					}

					&:last-child {
						margin-bottom: 0;
					}
				}

				&.mine {
					text-align: right;

					.profile-picture {
						margin-right: 0;
						margin-left: 10px;
					}

					.text {
						border-radius: 20px;
						border-bottom-right-radius: 3px;
						border-top-right-radius: 3px;
						background-color: #00FFFF;
						color: black;
						margin-bottom: 3px;

						&:first-child {
							border-top-right-radius: 20px;
						}

						&:last-child {
							margin-bottom: 0;
						}
					}
				}
			}
		}

		#input {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 10px 20px;
			background-color: #272727;

			.input-wrap {
				position: relative;
			}

			.send {
				position: absolute;
				top: 10px;
				right: 17px;
				font-size: 1.4rem;
				color: #00FFFF;
			}

			.message-input {
				width: 100%;
				padding: 10px 15px;
				border: none;
				background-color: #383838;
				color: white;
				border-radius: 50px;
				font-size: 1.2rem;

				&:active, &:focus {
					outline: none;
				}
			}
		}
	}
</style>

<template lang="pug">
	#chat
		#header
			.previous(@click="$router.go(-1)")
				i.fas.fa-chevron-left
			span(@click="goToProfile")
				img(:src="otherUser ? otherUser.profilePicture : 'https://firebasestorage.googleapis.com/v0/b/propaganda-967a8.appspot.com/o/images%2Fglobal.png?alt=media&token=150f3d9c-96c9-435d-9330-24e7e03f0807'" class="profile-picture")
				.name {{ otherUser ? otherUser.name : 'Global chat' }}

		#messages(ref="messages")
			.message(v-for="message in messages" :class="{mine: message.from === ownId}")
				img(v-if="message.from !== ownId" :src="getPicture(message.from)" class="profile-picture")
				.texts
					.text {{ message.content }}
				img(v-if="message.from === ownId" :src="getPicture(message.from)" class="profile-picture")

		#input
			.input-wrap
				i.fas.fa-paper-plane.send(@click="sendMessage")
				input(type="text" class="message-input" placeholder="Aa" v-model="messageInput")
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Home',
	data() {
		return {
			ownId: firebase.auth().currentUser.uid,
			ownUser: this.$store.state.self,
			otherId: this.$route.query.otherId,
			convId: this.$route.query.convId,
			messages: [],
			messageInput: ''
		}
	},
	computed: {
		otherUser() { return this.$store.state.users.find(user => user.id === this.otherId) },
		convDb() {
			return firebase.firestore().collection('conversations')
		},
		convRef() {
			return this.convDb.doc(this.convId)
		}
	},
	methods: {
		sendMessage() {
			this.convRef
				.collection('messages')
				.add({
					from: this.ownId,
					content: this.messageInput,
					to: this.otherId,
					timestamp: firebase.firestore.FieldValue.serverTimestamp()
				})

			this.convRef
				.update({lastUpdated: firebase.firestore.FieldValue.serverTimestamp()})

			this.setNotification()

			this.messageInput = ''
		},
		setNotification() {
			let db = firebase.firestore()

			if (this.otherUser) {
				db
					.collection('notifications')
					.doc(this.otherId)
					.update({
						notifications: firebase.firestore.FieldValue.arrayUnion(this.convId)
					})
			}
			else {
				let batch = db.batch()

				for (let user of this.$store.state.users) {
					if (user.id === this.ownId)
						continue

					batch.update(db.collection('notifications').doc(user.id), {
						notifications: firebase.firestore.FieldValue.arrayUnion('*')
					})
				}

				batch.commit()
			}
		},
		getPicture(id) {
			return this.$store.state.users.find(user => user.id === id).profilePicture
		},
		goToProfile() {
			this.$router.push({
				name: 'Profile',
				query: {
					id: this.otherId
				}
			})
		},
		scrollDown() {
			this.$nextTick(() => {
				document.body.scrollIntoView(false)
			})
		}
	},
	created() {
		// TODO: Not working.
		this.convRef
			.get()
			.then(res => {
				if (!res.exists)
					this.convRef.set({ids: [this.ownId, this.otherId]})
			})

		this.convRef
			.collection('messages')
			.orderBy('timestamp')
			.onSnapshot(snap => {
				this.messages = []

				snap.forEach(doc => {
					this.messages.push(doc.data())
				})

				this.scrollDown()

				firebase
					.firestore()
					.collection('notifications')
					.doc(this.ownId)
					.update({
						notifications: firebase.firestore.FieldValue.arrayRemove(this.convId)
					})
			})
	}
}
</script>
