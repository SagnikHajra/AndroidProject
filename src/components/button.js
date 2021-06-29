import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlatButton({ title, onPress }){
    return(
        <TouchableOpacity onPress={ onPress }>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{ title }</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: '#f01d71',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize:20,
        textAlign: 'center',
    },
})
