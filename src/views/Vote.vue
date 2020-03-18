<style lang="scss">
	#vote {
		padding: 20px;
		padding-bottom: 160px;

		h3 {
			text-align: center;
			margin-bottom: 20px;
		}

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

				&.noanimation {
					transition: none;
				}

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
						background-color: #00FFFF;
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
			background-color: #00FFFF;
			color: #fff;
			border-radius: 5px;
			border: none;

			&.inactive {
				pointer-events: none;
				background-color: #6c757d;
			}
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
						background-color: #00FFFF;
						color: white;
					}

					&.cancel {
						background-color: white;
						box-shadow: inset 0px 0px 0px 2px #00FFFF;
						color: #00FFFF;
						margin-right: 20px;
					}
				}
			}
		}
	}
</style>

<template lang="pug">
	#vote
		h3(v-if="lockedVote") Your vote is locked in for today.
		#modal(v-if="activeModal")
			.modal-inner
				p You won't be able to change your vote until tomorrow. Are you SURE ?
				p.red {{ errorMessage }}
				button(@click="closeModal()").cancel Cancel
				button(@click="saveVote").confirm Save
		.user(v-for="user in users" v-if="user.id !== uid" @click="selectUser(user.id)")
			.user-tile(:class="{active: user.active, noanimation: lockedVote}")
				.tile.front
					img(:src="user.profilePicture")
				.tile.back
					i.fas.fa-check

			.name {{ user.name }}
		button(@click="activeModal = true" :class="{inactive: lockedVote || isLoading}").save Save vote
</template>

<script>
import firebase from 'firebase'

export default {
	// TODO Problem when going back to another tab and back to Vote
  name: 'vote',
	data() {
		return {
			uid: firebase.auth().currentUser.uid,
			selectedUser: null,
			lockedVote: false,
			activeModal: false,
			errorMessage: '',
			isLoading: true
		}
	},
	computed: {
		users() {return this.$store.state.users}
	},
	methods: {
		selectUser(id, force) {
			if (this.lockedVote && !force)
				return false

			let selectedUser = null

			this.users.forEach(user => {
				if (user.id === id)
					user.active = force ? true : !user.active
				else
					user.active = false

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
				return false
			}

			let todaysTimestamp = new Date
			todaysTimestamp.setHours(0,0,0,0)

			firebase
				.firestore()
				.collection('votes')
				.add({
					timestamp: todaysTimestamp,
					from: this.uid,
					vote: this.selectedUser
				})

			this.lockedVote = true
			this.activeModal = false
		}
	},
	async created() {
		let todaysTimestamp = new Date,
				votesDb = firebase.firestore().collection('votes')
		todaysTimestamp.setHours(0,0,0,0)

		let userVote = await votesDb.where('timestamp', '==', todaysTimestamp).where('from', '==', this.uid).get()

		if (!userVote.empty) {
			this.lockedVote = true
			this.selectUser(userVote.docs[0].data().vote, true)
		}

		this.isLoading = false
	}
}
</script>
