import React, {useContext, useState, useEffect, useRef} from "react";
import { Platform } from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import Text from "../components/Text";
import PostImages from "../components/PostImages"
import { FirebaseContext } from "../context/FirebaseContext";

export default PostScreen = () => {
    const firebase = useContext(FirebaseContext);
    const [postTxt, setPostTxt] = useState("")
    const [postImages, setPostImages] = useState([])
    const [isLoading, setLoading] = useState(false)
    const textInRef = useRef(null)

    useEffect(() => {
        firebase.getPosts()
    }, [])

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
              aspect: [1, 1],
              quality: 0.5,
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

    onSavePost = async () => {
        if(postTxt.trim() !== ""){
            setLoading(true)
            const saved = await firebase.createPost({post: postTxt, images: postImages})
            if(saved) {
                alert('Post published')
                textInRef.current.clear()
                setPostImages([])
            } else {
              alert('Something went wrong! Please try again')
            }
            setLoading(false)
        }
    }
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#F3F5F9',
      }}
      scrollEnabled={false}
    >
      <MainContainer>
	  <TextContainer>
        <Text large semi center color = "#FFFFFF">Add New Blog Post</Text>
        <Text small light center color = "#FFFFFF">Share your thoughts and experiences</Text>
	  </TextContainer>
	  <Container>
        <Content>
          <Row>
            <Textarea 
              ref={textInRef}
              placeholder={"Share your thoughts here..."}
              autoCorrect={false}
              onChangeText={val => setPostTxt(val)}
              multiline={true}
              numberOfLines={5}
              maxLenght={256} />
          </Row>
          <Row>
            <InlineItems style={{}}>
              <PostImages 
                data={postImages} 
                onRemove={(index) => setPostImages(postImages => [...postImages.slice(0, index), ...postImages.slice(index+1)])} 
              />
              {postImages.length < 5 &&
                <AddImage onPress={addImage}>
                  <Ionicons name="ios-add" size={24} color="#73788b" />
                  <Text center>Add Image</Text>
                </AddImage>
              }
            </InlineItems>
          </Row>
          <Row style={{marginBottom: 30}}>
            {isLoading?
              <Button><Loading /></Button>
            :
              <Button onPress={onSavePost}>
                <Text bold center color="#ffffff">Publish Post</Text>
              </Button>
            }
          </Row>
        </Content>
        <StatusBar barStyle="light-content" />
      </Container>
	</MainContainer>
    </KeyboardAwareScrollView>
  );
};



const MainContainer = styled.View`
  
  background-color: #FFFFFF;
  width: 100%
  height: 100%
`;


const Container = styled.View`
  
  background-color: #FFFFFF;
  width: 100%
  height: 70%
`;

const TextContainer = styled.View`
  padding-top: 64px
  background-color: #9370DB;
  width: 100%
  height:30%
  `;


const Content = styled.ScrollView`
  padding: 20px 10px;
  margin: 10px;
  margin-top: 20px;
  background-color: #fff;
`;

const Row = styled.View`
  margin-top: 20px;
`

const Textarea = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  min-height: 100px
`

const Button = styled.TouchableOpacity`
  margin: 0 32px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #9370DB;
  border-radius: 6px;
`
const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: "#ffffff",
  size: "small",
}))``;

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

const StatusBar = styled.StatusBar``;
