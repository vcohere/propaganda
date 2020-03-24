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

		h1, p {
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
	#picture
		h1 Upload your profile picture
		p Be aware that you will not be able to change it.
		p.error(v-if="errorMessage") {{ errorMessage }}
		input(type="file" placeholder="Profile picture" ref="picture")
		button(@click="upload" :class="{loading: buttonLoading}")
			span Continue
			i.fas.fa-circle-notch.loader.loader-spin
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'picture',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			picture: [],
			errorMessage: '',
			buttonLoading: false
		}
	},
	methods: {
		upload() {
			this.buttonLoading = true

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

						this.buttonLoading = false
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
