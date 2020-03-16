<style lang="scss">
	#vote {
		padding: 20px;
		padding-bottom: 160px;

		.user {
			display: inline-block;
			width: 50%;
			text-align: center;
			margin-bottom: 20px;
			perspective: 600px;

			.user-tile {
				width: 30vw;
				height: 30vw;
				margin: auto;
				border-radius: 50%;
				position: relative;
				transition: transform 500ms;
				transform-style: preserve-3d;
				transform: scale(1);

				&.active {
					transform: rotateY(180deg);
				}

				.tile {
					position: absolute;
					width: 100%;
					height: 100%;
					backface-visibility: hidden;
					border-radius: 50%;
					overflow: hidden;

					img {
						width: 100%;
					}

					.fas {
						position: relative;
						top: 6vw;
						color: white;
						font-size: 18vw;
					}

					&.back {
						background-color: #1B9CFC;
						transform: rotateY(180deg);
					}
				}
			}

			.name {
				font-size: 1.4rem;
			}
		}

		button.save {
			position: fixed;
			left: 20px;
			bottom: 90px;
			width: calc(100% - 40px);
			padding: 15px;
			font-size: 1.1rem;
			background-color: #1B9CFC;
			color: #fff;
			border-radius: 5px;
			border: none;
		}

		#modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			background-color: rgba(0,0,0,0.3);
			z-index: 999;

			.modal-inner {
				position: fixed;
				left: 20px;
				top: calc(50% - 70px);
				padding: 20px;
				width: calc(100% - 40px);
				transform: translateY(-50%);
				background-color: #fff;

				p {
					margin-bottom: 20px;

					&.red {
						color: #eb3b5a;
					}
				}

				button {
					display: inline-block;
					width: calc(50% - 10px);
					padding: 15px;
					border: none;
					border-radius: 5px;

					&.confirm {
						background-color: #1B9CFC;
						color: white;
					}

					&.cancel {
						background-color: white;
						box-shadow: inset 0px 0px 0px 2px #1B9CFC;
						color: #1B9CFC;
						margin-right: 20px;
					}
				}
			}
		}
	}
</style>

<template lang="pug">
	#vote
		#modal(v-if="activeModal")
			.modal-inner
				p You won't be able to change your vote until tomorrow. Are you SURE ?
				p.red {{ errorMessage }}
				button(@click="closeModal()").cancel Cancel
				button(@click="saveVote").confirm Save
		.user(v-for="user in users" @click="selectUser(user.id)")
			.user-tile(:class="{active: user.active}")
				.tile.front
					img(:src="user.profilePicture")
				.tile.back
					i.fas.fa-check

			.name {{ user.name }}
		button(@click="activeModal = true").save Save vote
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'vote',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			users: null,
			selectedUser: null,
			activeModal: false,
			errorMessage: ''
		}
	},
	methods: {
		selectUser(id) {
			let selectedUser = null

			this.users.forEach(user => {
				user.active = user.id === id ? !user.active : false

				if (user.active)
					selectedUser = user.id
			})

			this.selectedUser = selectedUser
		},
		closeModal() {
			this.activeModal = false
			this.errorMessage = ""
		},
		saveVote() {
			if (!this.selectedUser) {
				this.errorMessage = "Please select an user first."
			}
		}
	},
	created() {
		firebase
			.firestore()
			.collection('users')
			.onSnapshot((snap) => {
				this.users = []

				snap.forEach((doc) => {
					let data = doc.data()

					data.id = doc.id
					data.active = false

					if (data.id !== this.uid)
						this.users.push(data)
				})
			})
	}
}
</script>
