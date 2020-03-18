<style lang="scss">
	#signup {
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
			background-color: #1B9CFC;
			color: #fff;
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

		h3 {
			margin-bottom: 20px;
		}

		.error {
			margin-bottom: 20px;
			font-weight: bold;
			color: #eb3b5a;
		}
	}
</style>

<template lang="pug">
	#signup
		h3 Create an account
		p.error(v-if="errorMessage") {{ errorMessage }}
		input(type="text" placeholder="First name" v-model="name")
		input(type="text" placeholder="Bio" v-model="bio")
		input(type="text" placeholder="Mail address" v-model="email")
		input(type="password" placeholder="Password" v-model="password")
		button(@click="signup" :class="{loading: buttonLoading}")
			span Sign up
			i.fas.fa-circle-notch.loader-spin.loader
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'signup',
	data() {
		return {
			name: '',
			bio: '',
			email: '',
			password: '',
			errorMessage: '',
		}
	},
	methods: {
		signup() {
			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
				this.createDatabaseEntry,
				(err) => {
					this.errorMessage = err.message
				}
			)
		},
		createDatabaseEntry(data) {
			firebase
				.firestore()
				.collection('users')
				.doc(data.user.uid)
				.set({
					name: this.name,
					profilePicture: '',
					bio: this.bio
				})
				.then(() => {
						firebase
							.firestore()
							.collection('notifications')
							.doc(data.user.uid)
							.set({notifications: []})
							.then(() => {
								this.$router.replace('picture')
							},
							(err) => {
								this.errorMessage = 'Error. ' + err.message
							})
					},
					(err) => {
						this.errorMessage = 'Error. ' + err.message
					}
				)
		}
	}
}
</script>
