const functions = require('firebase-functions')
const admin = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp()

exports.onMessageCreate = functions.firestore
	.document('conversations/{conversationId}/messages/{messageId}')
	.onCreate(async (snap, context) => {
		let data = snap.data(),
				usersCollection = admin.firestore().collection('users')

		let snapFrom = await usersCollection.doc(data.from).get()
		let dataFrom = snapFrom.data()

		let payload = {
			notification: {
				title: dataFrom.name,
				body: data.content,
				icon: dataFrom.profilePicture
			}
		}

		let devices = null

		if (data.to === '*') {
			let snapTo = await usersCollection.get()
			devices = []

			for (let user of snapTo.docs) {
				let tmp = user.data()

				devices.push(user.notificationToken)
			}
		}
		else {
			let snapTo = await usersCollection.doc(data.to).get()
			let dataTo = snapTo.data()

			devices = dataTo.notificationToken
		}

		admin.messaging().sendToDevice(devices, payload)
	})
