<style lang="scss">
	#picture {
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

		h3, p {
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
	#picture
		h3 Upload your profile picture
		p Be aware that you will not be able to change it.
		p.error(v-if="errorMessage") {{ errorMessage }}
		input(type="file" placeholder="Profile picture" ref="picture")
		button(@click="upload") Continue
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'signup',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			picture: [],
			errorMessage: '',
		}
	},
	methods: {
		upload() {
			const file = this.$refs.picture.files[0]

			if (!file)
				this.errorMessage = 'No image selected.'

			firebase.storage().ref('images/' + file.name).put(file)
				.then(res => {
					res.ref.getDownloadURL().then(url => {
						firebase
							.firestore()
							.collection('users')
							.doc(this.uid)
							.update({profilePicture: url})

						this.$router.replace('home')
					})
				})
				.catch(err => {
					this.errorMessage = err.message
				})
		}
	}
}
</script>
