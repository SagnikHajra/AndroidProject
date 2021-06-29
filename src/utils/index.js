import * as Location from 'expo-location';

export const getCurrentLocation = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return reject()
        }

        const location = await Location.getCurrentPositionAsync({});
        const {coords: {latitude, longitude}} = location
        return resolve({latitude, longitude})
      
    } catch (error) {
      console.log("getCurrentLocation", error)
      return reject()
    }
  })
}