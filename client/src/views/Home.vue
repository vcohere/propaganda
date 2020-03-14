<style lang="scss">
	#home {
		padding: 20px;

		a {
			color: black;
			text-decoration: none;
		}

		#search {
			width: 100%;
			padding: 15px 20px;
			border: 1px solid rgba(0,0,0,0.1);
			border-radius: 50px;

			&:active, &:focus {
				outline: none;
			}
		}

		#list {
			padding-top: 20px;
			padding-bottom: 50px;

			.item {
				position: relative;
				border-top: 1px solid rgba(0,0,0,0.1);
				padding-top: 15px;
				padding-bottom: 15px;
				width: 100%;
				height: 90px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				.profile-picture {
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					width: 60px;
					border-radius: 50%;
				}

				.name, .preview {
					padding-left: 75px;
				}

				.name {
					font-weight: bold;
					font-size: 1.2rem;
				}
			}
		}

		#footer {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			text-align: center;
			background-color: #ffffff;
			border-top: 1px solid rgba(0,0,0,0.1);

			.nav {
				display: inline-block;
				width: 24.5%;
				font-size: 25px;
				padding: 10px 0;

				* {
					vertical-align: middle;
				}

				.profile-picture {
					width: 40px;
					border-radius: 50%;
				}
			}
		}
	}
</style>

<template lang="pug">
	#home
		input(type="text" placeholder="Search..." id="search")

		#list
			router-link(to="chat" v-for="index in 10")
				.item
					img(src="https://i.pravatar.cc/300" class="profile-picture")
					.name
						| Picle Rick
					.preview
						| Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboru

		#footer
			.nav
				i.fas.fa-comment-dots
			.nav
				i.fas.fa-list-ol
			.nav
				i.fas.fa-users
			.nav
				img(src="https://i.pravatar.cc/299" class="profile-picture")
</template>

<script>
export default {
  name: 'Home'
}
</script>
