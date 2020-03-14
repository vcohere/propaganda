import firebase from 'firebase'

var config = {
	apiKey: "AIzaSyDFkqag1bgeTbHc0Bhx9T3xW6CBwAt1d8w",
	authDomain: "propaganda-967a8.firebaseapp.com",
	databaseURL: "https://propaganda-967a8.firebaseio.com",
	projectId: "propaganda-967a8",
	storageBucket: "propaganda-967a8.appspot.com",
	messagingSenderId: "452444631316",
	appId: "1:452444631316:web:1ba758cc7f63b550fb9201",
	measurementId: "G-HKDX3KMG8V"
};

var fire = firebase.initializeApp(config);
export default fire;
