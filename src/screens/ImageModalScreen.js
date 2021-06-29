import React from "react";
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons";

export default ImageModalScreen = (props) => {

  return (
    <Container>
      <Header>
        <BackButton onPress={() => props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </BackButton>
      </Header>
      {props.route && props.route.params && props.route.params.imageUrl &&
        <ImageView source={{ uri: props.route.params.imageUrl}} />
      }
      <StatusBar />
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  background-color: #ebecf3;
  padding-top: 64px;
  justify-content: center;
  align-items: center
`
const StatusBar = styled.StatusBar``;

const Header = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100px;
  justify-content: flex-end;
`

const BackButton = styled.TouchableOpacity`
  margin: 0 32px;
  height: 48px;
  border-radius: 6px;
`

const ImageView = styled.Image`
  width: 80%;
  height: 80%;
  resize-mode: contain;
`