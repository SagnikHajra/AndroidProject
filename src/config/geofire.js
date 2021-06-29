import firebase from "firebase";
import {GeoFire} from "geofire";

import config from "./firebase";

let geofireInstance;

export const getGeofire = async () => {
  // Check if Geofire has already been initialized
  if (geofireInstance) return geofireInstance;

  // Create a Firebase reference where GeoFire will store its information
  // if (!firebase.apps.length) {
  //   await firebase.initializeApp(config);
  // }
  const firebaseRef = firebase.database().ref('user_location');

  // Create a GeoFire index
  geofireInstance = new GeoFire(firebaseRef);

  // Return geofire instance
  return geofireInstance;
}
