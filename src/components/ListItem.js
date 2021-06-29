import React from 'react';
import { StyleSheet, View, Button ,Text} from 'react-native';
import { Image } from 'react-native';



const ListItem = props => {
    let imageURL;
    if(!props.image){
        imageURL = <Image
        source={require('../../assets/favicon.png')}
        style={styles.thumbnail}
      />;
    }
    else{
        imageURL = <Image
        style={styles.thumbnail}
        source={{
          uri:
            props.image,
        }}
      />
    }
  return (
      <View>
    <View style={styles.container}>
    {imageURL}
      <View style={styles.content}>
        <View style={styles.leftBlock}>
            <Text p>{props.name}</Text>
            <Text>{props.status}</Text>
        </View>
        <View style={styles.rightBlock}>
            <Text>{props.rating}</Text>
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin:5,
    height: 350,
    width: 450,
    borderWidth: 2,
    borderRadius: 5
  },
  thumbnail:{
     height: 250 
  },
  content:{
    padding: 5,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  leftBlock:{
      margin: 5,
      width: 300
  },
  rightBlock:{
      marginTop: 15,
      marginRight:20,
      flexDirection: "row"
  }
});


export default ListItem;