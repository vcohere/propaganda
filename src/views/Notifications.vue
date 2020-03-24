<style lang="scss">
	#notifications {
		padding: 20px;
		text-align: center;

		input {
			width: 100%;
			padding: 15px;
			font-size: 1.1rem;
			margin-bottom: 15px;
			border: 1px solid rgba(0,0,0,0.1);
			border-radius: 5px;

			&:active, &:focus {
				outline: none;
			}
		}

		button {
			width: 100%;
			padding: 15px;
			font-size: 1.1rem;
			background-color: #66ffff;
			color: black;
			border-radius: 5px;
			border: none;

			.loader {
				display: none;
			}

			&.loading {
				span {
					display: none;
				}

				.loader {
					display: block;
				}
			}
		}

		h3, p {
			margin-bottom: 20px;
		}

		.error {
			margin-bottom: 20px;
			font-weight: bold;
			color: #FF7BFE;
		}
	}
</style>

<template lang="pug">
	#notifications
		h3 Notifications
		p We need to be able to send notifications on your phone whenever you get a message.
		p Press the button and accept all notifications to proceed.
		p.error(v-if="errorMessage") {{ errorMessage }}
		button(@click="askPermission" :class="{loading: buttonLoading}")
			span Accept notifications
			i.fas.fa-circle-notch.loader.loader-spin
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'notifications',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			errorMessage: '',
			buttonLoading: false
		}
	},
	methods: {
		askPermission() {
			this.buttonLoading = true

			let messaging = this.$store.state.messaging

			messaging.requestPermission().then(() => {
				return messaging.getToken()
			}).then((token) => {
				firebase
					.firestore()
					.collection('users')
					.doc(this.uid)
					.update({notificationToken: token})

				this.buttonLoading = false
			}).catch((err) => {
				this.errorMessage = err.message

				this.buttonLoading = false
			})
		}
	}
}
</script>
