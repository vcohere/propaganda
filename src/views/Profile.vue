<style lang="scss">
	#profile {
		padding: 20px;
		padding-bottom: 90px;
		text-align: center;

		#header {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 70px;
			padding: 20px;
			background-color: #2c2c2c;
			text-align: left;

			* {
				line-height: 30px;
				vertical-align: middle;
			}

			.previous {
				display: inline-block;
				font-size: 30px;
				color: white;
				margin-right: 20px;
			}
		}

		#content {
			padding-top: 110px;

			.profile-picture {
				width: 50vw;
				height: 50vw;
				margin: auto;
				border-radius: 50%;
				overflow: hidden;
				margin-bottom: 15px;

				img {
					width: 100%;
				}
			}

			.button-wrap {
				position: fixed;
				bottom: 80px;
				left: 0px;
				width: 100%;
			}

			button {
				width: calc(100% - 40px);
				margin-top: 20px;
				padding: 15px;
				font-size: 1.1rem;
				background-color: #66ffff;
				color: black;
				border-radius: 5px;
				border: none;

				&.red {
					background-color: #eb3b5a;
				}
			}
		}
	}
</style>

<template lang="pug">
	#profile
		#header
			.previous(@click="$router.go(-1)")
				i.fas.fa-chevron-left
		#content
			.profile-picture
				img(:src="userInfos ? userInfos.profilePicture : ''")
			h1 {{ userInfos ? userInfos.name : '' }}
			p {{ userInfos ? userInfos.bio : '' }}

			.button-wrap
				button(@click="startChat" v-if="!isMine") Start chat
				button(@click="logout" v-if="isMine").red Log out
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'profile',
	data() {
		return {
			myUid: firebase.auth().currentUser.uid,
			uid: this.$route.query.id ? this.$route.query.id : firebase.auth().currentUser.uid,
			isMine: this.$route.query.id ? false : true,
			userInfos: null
		}
	},
	methods: {
		logout() {
			firebase.auth().signOut().then(() => {
				this.$router.replace('login')
			})
		},
		startChat() {
			let convId = this.myUid > this.uid ? this.myUid + '' + this.uid : this.uid + '' + this.myUid

			this.$router.push({
				name: 'Chat',
				query: {
					convId: convId,
					otherId: this.uid
				}
			})
		}
	},
	created() {
		this.userInfos = this.$store.state.users.find(user => user.id === this.uid)
	}
}
</script>
