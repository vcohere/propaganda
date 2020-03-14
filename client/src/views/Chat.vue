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
			box-shadow: 0 3px 6px rgba(0,0,0,0.04), 0 3px 6px rgba(0,0,0,0.08);

			* {
				vertical-align: middle;
			}

			.previous {
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
			router-link(to="/").previous
				i.fas.fa-chevron-left
			img(src="https://i.pravatar.cc/300" class="profile-picture")
			.name
				| Pickle Rick

		#messages
			.message
				img(src="https://i.pravatar.cc/300" class="profile-picture")
				.texts
					.text Yo
					.text What's happening ?

			.message.mine
				.texts
					.text What's up
					.text Hello
					.text
						| Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				img(src="https://i.pravatar.cc/300" class="profile-picture")

		#input
			.input-wrap
				i.fas.fa-paper-plane.send
				input(type="text" class="message-input" placeholder="Aa")
</template>

<script>
export default {
  name: 'Home'
}
</script>
