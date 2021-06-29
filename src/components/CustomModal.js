import React from "react";
import styled from "styled-components/native";

import Text from './Text'

const CustomModal = (props) => (
  <DropdownModal 
    visible={props.visible} 
    transparent 
    animationType={'slide'}
  >
      <ModalContainer style={props.styles.modalOverlay} onPress={props.dismissModal} activeOpacity={1} >
          <ModalWrapper>
            <ModalMain style={props.styles.modalMain}>
              {props.title && <ModalHeader><Text medium>{props.title}</Text></ModalHeader>}
              {props.children}
            </ModalMain>
          </ModalWrapper>
      </ModalContainer>
  </DropdownModal>
)

export default CustomModal

const DropdownModal = styled.Modal`
`;

const ModalContainer = styled.TouchableOpacity`
    flex: 1;
    padding: 20px;
    justify-content: center;
`;
const ModalWrapper = styled.TouchableWithoutFeedback`
`;
const ModalHeader = styled.View`
    padding: 15px 10px;
    align-items: center;
`;
const ModalMain = styled.View`
    padding: 10px;
`;