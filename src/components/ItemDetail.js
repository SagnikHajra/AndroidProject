import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ItemDetail = props => {
  
  return (
      <View style={styles.screen}>
            <Text>Welcome to {props.item.name}</Text>
            <Text>Address:{props.item.address}</Text>
        </View>
  );
}

const styles = StyleSheet.create({
  screen:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default ItemDetail;