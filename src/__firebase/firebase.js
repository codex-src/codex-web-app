import firebase from "firebase/app"

import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

;(() => {
	firebase.initializeApp({
		apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
		authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
		databaseURL:       process.env.REACT_APP_FIREBASE_DATABASE_URL,
		projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
		storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
		appId:             process.env.REACT_APP_FIREBASE_APP_ID,
		measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
	})
	// https://firebase.google.com/docs/firestore/manage-data/enable-offline
	firebase.firestore().enablePersistence().catch(error => {
		if (error.code === "failed-precondition") {
			// Multiple tabs open, persistence can only be enabled
			// in one tab at a a time.
			// ...
			// TODO
		} else if (error.code === "unimplemented") {
			// The current browser does not support all of the
			// features required to enable persistence
			// ...
			// TODO
		}
		console.error(error)
	})
	if (process.env.NODE_ENV === "production") {
		firebase.analytics()
	}
})()

export default firebase
