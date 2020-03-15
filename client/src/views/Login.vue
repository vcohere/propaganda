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
	#login
		h3 Login to Propaganda
		p.error(v-if="errorMessage") {{ errorMessage }}
		input(type="text" placeholder="mail" v-model="email")
		input(type="password" placeholder="password" v-model="password")
		button(@click="login") Connexion
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
			successMessage: ''
		}
	},
	methods: {
		login() {
			firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
				() => {
					this.$router.replace('home')
				},
				(err) => {
					this.errorMessage = err.message
				}
			)
		}
	}
}
</script>
