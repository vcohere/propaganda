<style lang="scss">
	#chat {
		#header {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 90px;
			padding: 20px;
			background-color: #fff;

			* {
				vertical-align: middle;
			}

			.previous {
				display: inline-block;
				font-size: 30px;
				color: black;
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
					background-color: #e6f4ff;
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
						background-color: #1B9CFC;
						color: white;
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
			border-top: 1px solid rgba(0,0,0,0.1);
			background-color: #fff;

			.input-wrap {
				position: relative;
			}

			.send {
				position: absolute;
				top: 10px;
				right: 17px;
				font-size: 1.4rem;
				color: #1B9CFC;
			}

			.message-input {
				width: 100%;
				padding: 10px 15px;
				border: 1px solid rgba(0,0,0,0.1);
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
				img(src="https://i.pravatar.cc/300" class="profile-picture")
				.name {{ otherUser ? otherUser.name : '' }}

		#messages
			.message(v-for="message in messages" :class="{mine: message.from === ownId}")
				img(v-if="message.from !== ownId" src="https://i.pravatar.cc/300" class="profile-picture")
				.texts
					.text {{ message.content }}
				img(v-if="message.from === ownId" src="https://i.pravatar.cc/300" class="profile-picture")

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
			otherId: this.$route.query.otherId,
			otherUser: null,
			convId: this.$route.query.convId,
			messages: [],
			messageInput: ''
		}
	},
	computed: {
		convDb() {
			return firebase.firestore().collection('conversations')
		},
		convRef() {
			return this.convDb.doc(this.convId)
		},
		usersDb() {
			return firebase.firestore().collection('users').doc(this.otherId)
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
			this.messageInput = ''
		},
		goToProfile() {
			this.$router.push({
				name: 'Profile',
				query: {
					id: this.otherId
				}
			})
		}
	},
	created() {
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
			})

		this.usersDb
			.get()
			.then(res => {
				this.otherUser = res.data()
			})
	}
}
</script>
