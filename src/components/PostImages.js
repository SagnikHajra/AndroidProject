import React, { useRef, useState } from 'react'
import styled from "styled-components";
import ActionSheet from "react-native-actions-sheet";
import { Entypo, Ionicons } from "@expo/vector-icons";

import Text from './Text'

const PostImages = (props) => {
  const { data, onRemove, onViewImage } = props
  const optionsRef = useRef(null)
  const [currImageIndex, setCurrImageIndex] = useState(null)

  const removePostImage = () => {
    if(currImageIndex !== null)
      onRemove(currImageIndex)
    
      optionsRef.current?.hide()
  }

  const viewPostImage = () => {
    if(currImageIndex !== null) {
      onViewImage(currImageIndex)
    }
    optionsRef.current?.hide()
  }

  const onASOpen = (index) => {
    setCurrImageIndex(index)
    optionsRef.current?.setModalVisible()
  }

  const onASClose = () => {
    setCurrImageIndex(null)
  }

  return (
    <>
      {
        data.map((postImg, index) => (
          <ImageView key={`postimg-${index}`} onPress={() => onASOpen(index)}>
            <PostImage source={{ uri: postImg }} />
          </ImageView>
        ))
      }
      <ActionSheet 
        ref={optionsRef} 
        closeOnPressBack={true}
        onClose={onASClose}>
        <ActionListView>
            <ActionListViewItem onPress={viewPostImage}>
                <Entypo name="eye" size={18} color="#73788b" />
                <Text medium style={{marginLeft: 20}}>View</Text>
            </ActionListViewItem>
            <ActionListViewItem onPress={removePostImage}>
                <Entypo name="trash" size={18} color="#73788b" />
                <Text medium style={{marginLeft: 20}}>Delete</Text>
            </ActionListViewItem>
        </ActionListView>
    </ActionSheet>
    </>
  )
}

export default PostImages

const ImageView = styled.TouchableOpacity`
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px;
  height: 100px;
  align-self: center;
  justify-content: center;
  align-items: center;
  margin-right: 10px
  margin-bottom: 10px;
  overflow: hidden;
`
const PostImage = styled.Image`
    flex: 1;
    width: 98px;
`;

const ActionListView = styled.View`
    background-color: #ffffff;
    padding: 25px 10px;
`;

const ActionListViewItem = styled.TouchableOpacity`
    padding: 10px 20px;
    flex-direction: row;
`;
