import React, { useContext, useState } from "react"
import { Formik } from "formik";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import * as yup from 'yup'
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    Modal,
    SafeAreaView,
    Checkbox,
    ScrollView,
    TextInput,
    Platform
} from "react-native";
import Text from "../../components/Text";
import FlatButton from "../../components/button";
import { MaterialIcons } from '@expo/vector-icons'; 
import { FirebaseContext } from "../../context/FirebaseContext";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import PostImages from '../../components/PostImages';  

const reviewSchema = yup.object({
    name: yup.string()
        .required()
        .min(5)
        .max(100),
    country: yup.string()
        .required()
        .min(2)
        .max(50),
    state: yup.string()
        .required()
        .min(2)
        .max(50),
    street: yup.string()
        .required()
        .min(5)
        .max(200),
    rating: yup.string()
        .required()
        .test('is-num-1-5','rating must be a number 0.0 - 5.0', (val) => {
            return parseInt(val) <= 5 && parseInt(val) >= 0;
        }),
    zip: yup.string()
        .required()
        .test('is-num','zip must be a number between 5 and 10 digits', (val) => {
            return val.length >= 5 && val.length <= 10;
        })
})

const FormItems = ({route, navigation}) => {
    const firebase = useContext(FirebaseContext);
    const [postImages, setPostImages] = useState([])

    const getPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  
            return status;
        }
      };
  
      const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
            });
  
            if (!result.cancelled) {
              setPostImages(postImages => [...postImages, result.uri]);
            }
        } catch (error) {
            console.log("Error @pickImage: ", error);
        }
      };
  
      const addImage = async () => {
        const status = await getPermission();
  
        if (status !== "granted") {
            alert("We need permission to access your camera roll.");
  
            return;
        }
  
        pickImage();
    };

    const feature = route.params.feature;
    
    const submitHandler = async (values, actions) => {
        
        try {
            const saved = await firebase.addListing({add: values, image: postImages, place: feature.toLowerCase()});
            if(saved){
                alert('New item added')
                setPostImages([])
                actions.resetForm();
            } else {
              alert('Something went wrong! Please try again')
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <View style={{flex:1, flexDirection: 'column'}}>
            <View style={{flex:0.2, paddingTop: 50, flexDirection: 'column', borderBottomWidth:1,borderLeftWidth:1, borderRightWidth:1,borderBottomStartRadius:20,borderBottomEndRadius:20}}>
                    <MaterialIcons 
                        name="arrow-back"
                        size={30}
                        onPress={() => navigation.goBack()}
                        style={{paddingLeft: 20}}
                    />
                    <View style={{flex:0.3,alignItems:'center', justifyContent: 'center'}}>
                        <Text large>Add a new {feature}</Text>
                    </View>
            </View>
            <View style={{flex:0.8}}>
                <ScrollView>
                    <Formik
                        initialValues={{
                            name:'', 
                            photo:'',
                            country: '',
                            state: '', 
                            zip: '', 
                            street:'', 
                            rating: '',
                            // location: {Latitude: 1.5347282806345879,Longitude: 110.35632207358996,},
                            desc: '',
                        }}
                        validationSchema={reviewSchema}
                        onSubmit={(values, actions) => {
                            // console.log(values)
                            submitHandler(values, actions);
                        }}
                    >
                        {(props) => (
                            <View>
                                <Text large bold style={styles.title}>Address:</Text>
                                <View style={{borderLeftWidth:10, borderRightWidth:10, paddingBottom:15, paddingLeft: 15, paddingRight:15}}>
                                    <View>
                                        <Text>Country: *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder='usa'
                                            defaultValue='usa'
                                            onChangeText={props.handleChange('country')}
                                            value={props.values.country}
                                            onBlur={props.handleBlur('country')}
                                        />
                                        <Text style={{color:'red'}}>{props.touched.country && props.errors.country}</Text>
                                    </View>
                                    <View>
                                        <Text>Zip Code: *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder='76013'
                                            defaultValue='76013'
                                            onChangeText={props.handleChange('zip')}
                                            value={props.values.zip}
                                            keyboardType='numeric'
                                            onBlur={props.handleBlur('zip')}
                                        />
                                        <Text style={{color:'red'}}>{props.touched.zip && props.errors.zip}</Text>
                                    </View>
                                    <View>
                                        <Text>State: *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder='Texas'
                                            defaultValue='Texas'
                                            onChangeText={props.handleChange('state')}
                                            value={props.values.state}
                                            onBlur={props.handleBlur('state')}
                                        />
                                        <Text style={{color:'red'}}>{props.touched.state && props.errors.state}</Text>
                                    </View>
                                    <View>
                                        <Text>Street: *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder='410 kerby st.'
                                            defaultValue='410 kerby st.'
                                            onChangeText={props.handleChange('street')}
                                            value={props.values.street}
                                            onBlur={props.handleBlur('street')}
                                        />
                                        <Text style={{color:'red'}}>{props.touched.street && props.errors.street}</Text>
                                    </View>
                                </View>

                                
                                <Text large bold style={styles.title}>Details:</Text>
                                <View style={{borderBottomWidth:0.3,borderColor:'aliceblue',borderLeftWidth:10, borderRightWidth:10, paddingBottom:15, paddingLeft: 15, paddingRight:15}}>
                                    <View>
                                        <Text>Name: *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder='name of the place'
                                            defaultValue='Arli hospital'
                                            onChangeText={props.handleChange('name')}
                                            value={props.values.name}
                                            onBlur={props.handleBlur('name')}
                                        />
                                        <Text style={{color:'red'}}>{props.touched.name && props.errors.name}</Text>
                                    </View>
                                    {/* <View>
                                        <PickerCheckBox
                                            data={filterredList}
                                            headerComponent={<Text style={{fontSize:25}} >Which of the following are available:</Text>}
                                            OnConfirm={props.handleChange('categories')}
                                            ConfirmButtonTitle='OK'
                                            DescriptionField='itemDescription'
                                            KeyField='itemKey'
                                            placeholder='Select items applicable'
                                            arrowColor='#FFD740'
                                            arrowSize={10}
                                            placeholderSelectedItems ='$count selected item(s)'
                                            />
                                    </View> */}
                                    {/* <View>
                                        <Text>categories:</Text>
                                        <SelectMultiple
                                            items={filterredList}
                                            // selectedItems={newSelectedItems}
                                            // onSelectionsChange={() => {UseSelectedItems(newSelectedItems); console.log(selectedItems, newSelectedItems)}}
                                        />
                                    </View> */}
                                    <View>
                                        <Text>Rate this place: *</Text>
                                        <TextInput 
                                            style={styles.input}
                                            placeholder='0.0 to 5.0'
                                            defaultValue="3"
                                            onChangeText={props.handleChange('rating')}
                                            value={props.values.rating}
                                            onBlur={props.handleBlur('rating')}
                                        />
                                        <Text style={{color:'red'}}>{props.touched.rating && props.errors.rating}</Text>
                                    </View>
                                    <View>
                                        <Text>Description:</Text>
                                        <TextInput 
                                            multiline
                                            minHeight={100}
                                            style={styles.input}
                                            placeholder='comment'
                                            defaultValue='comment'
                                            onChangeText={props.handleChange('desc')}
                                            value={props.values.desc}
                                        />
                                    </View>
                                    <Row>
                                    <InlineItems>
                                        <PostImages 
                                            data={postImages} 
                                            onRemove={(index) => setPostImages(postImages => [...postImages.slice(0, index), ...postImages.slice(index+1)])} 
                                        />
                                        {postImages.length < 1 &&
                                            <AddImage onPress={addImage}>
                                            <Ionicons name="ios-add" size={24} color="#73788b" />
                                            <Text center>Add Image</Text>
                                            </AddImage>
                                        }
                                    </InlineItems>
                                    </Row>
                                    <View style={{paddingVertical:20, paddingHorizontal: 40}}>
                                        <FlatButton title="Submit" onPress={props.handleSubmit}/>
                                    </View>

                                </View>

                            </View>

                        )}
                    </Formik>
                </ScrollView>
            </View>
        </View>
    );
}
 
export default FormItems;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
    },
    title:{
        borderTopWidth:0.3,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:10
    },
    textInp: {
        paddingLeft:10, 
        paddingRight: 30,
        paddingBottom:5,
    }
})

const AddImage = styled.TouchableOpacity`
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  margin-right: 10px
  margin-bottom: 10px;
`

const InlineItems = styled.View`
  flex-direction: row; 
  flex-wrap: wrap;
`

const Row = styled.View`
  margin-top: 20px;
`
;