import styled , { css } from "styled-components"

export const Container = styled.View`
  flex: 1;
  background-color: #ebecf3;
  padding-top: 64px;
`
export const Content = styled.View`
  padding: 20px 10px;
  margin: 10px;
  background-color: #fff;
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
`
export const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  padding: 20px;
`

export const HeaderGraphic = styled.View`
    position: absolute;
    width: 100%;
    top: -50px;
    z-index: -100;
`;

export const RightCircle = styled.View`
    background-color: #8022d9;
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 200px;
    right: -100px;
    top: -200px;
`;

export const LeftCircle = styled.View`
    background-color: #23a6d5;
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    left: -50px;
    top: -50px;
`;

export const Card = styled.View`
  padding: 20px 10px;
  margin: 10px;
  background-color: #fff;
`;

export const SearchForm = styled.View`
  padding: 20px 10px;
`
export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #cccccc;
  border-radius: 25px;
  height: 50px;
  background-color: #ffffff; 
  padding: 0 20px;
`
export const StatusBar = styled.StatusBar``;

export const Loading = styled.ActivityIndicator.attrs((props) => ({
  color: props.color || "#ffffff",
  size: "small",
}))``;

export const PeopleAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

export const Button = styled.TouchableOpacity`
  margin: 0 32px;
  height: 48px;
  align-items: center;
  justify-content: center;
  background-color: #8022d9;
  border-radius: 6px;
  ${props => props.secondary && css`
    background-color: #cccddd;
  `}
`

export const ButtonIcon = styled.TouchableOpacity`
  padding: 10px;
  height: 48px;
`;

export const FlexBoard = styled.View`
  flex-wrap: wrap;
  ${props => props.row && css`
    flex-direction: row;
  `}
`;

export const FlexItem = styled.View`
  width: 47%; 
  align-items: center;
  ${props => props.row && css`
    flex-direction: row;
    align-items: flex-start;
  `}
  ${props => props.card && css`
    border: 1px solid #eee;
    margin: 5px;
    padding: 10px;
  `}
`