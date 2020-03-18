import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		dataLoading: true,
		self: null,
		users: []
  },
  mutations: {
		stopLoading(state) {
			state.dataLoading = false
		},
		startLoading(state) {
			state.dataLoading = true
		},
		setUsers(state, users) {
			state.users = users
		},
		setSelf(state, self) {
			state.self = self
		}
  },
  actions: {
		async getUsers(context) {
			if (!firebase.auth().currentUser)
				return

			context.state.users = []

			let usersDb = firebase.firestore().collection('users')
			let uid = firebase.auth().currentUser.uid

			let users = await usersDb.get(),
					usersRes = []

			for (let user of users.docs) {
				let data = user.data()
				data.id = user.id
				usersRes.push(data)
			}

			let self = await usersDb.doc(uid).get()

			context.commit('setSelf', {
				uid: uid,
				...self.data()
			})
			context.commit('setUsers', usersRes)
			context.commit('stopLoading')

			return true
		}
  },
  modules: {
  }
})
