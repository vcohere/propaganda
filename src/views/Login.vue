<style lang="scss">
	#login {
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

		h3, .create-account {
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
	#login
		h3 Login to Propaganda
		p.error(v-if="errorMessage") {{ errorMessage }}
		input(type="text" placeholder="mail" v-model="email")
		input(type="password" placeholder="password" v-model="password")
		router-link(to='signup').create-account Create an account
		button(@click="login" :class="{loading: buttonLoading}")
			span Connexion
			i.fas.fa-circle-notch.fa-spin.loader
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'login',
	data() {
		return {
			email: '',
			password: '',
			errorMessage: '',
			successMessage: '',
			buttonLoading: false
		}
	},
	methods: {
		login() {
			this.buttonLoading = true

			firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
				() => {
					this.buttonLoading = false
					this.$router.replace('home')
				},
				(err) => {
					this.buttonLoading = false
					this.errorMessage = err.message
				}
			)
		}
	}
}
</script>
