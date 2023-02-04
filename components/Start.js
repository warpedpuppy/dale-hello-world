import { CurrentRenderContext } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

const backgroundColors = {
  black: { backgroundColor: "#090C08" },
  purple: { backgroundColor: "#474056" },
  grey: { backgroundColor: "#d8d1d8" },
  green: { backgroundColor: "#94ae89" },
}

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: "" };

  }

 
  render() {
const {black, purple, grey, green} = backgroundColors;
    return (
      //main view for start screen
      <View style={styles.container}>
        <ImageBackground source={require("../assets/BackgroundImage.png")} style={styles.image}>
      
        <Text style={styles.title}>
          Chat App
          </Text>
          <View style={styles.box}>
        <TextInput
         style={styles.textInput}
         onChangeText={(name) => this.setState({name})}
         value={this.state.name}
         placeholder='  Your Name  '
       />
       <View>
        <Text style={styles.colorText}>Choose a background color</Text>
        <View style={[styles.colors, styles.colorBox]}>
          <TouchableOpacity style=
          {[styles.color,
          purple,
        this.state.color === purple.backgroundColor ? styles.colorSelected : {}, ]} 
        onPress={() =>
          this.setState({ color: purple.backgroundColor })
        } />
         <TouchableOpacity style=
          {[styles.color,
          black,
        this.state.color === black.backgroundColor ? styles.colorSelected : {}, ]} onPress={() =>
          this.setState({ color: black.backgroundColor })
        } />
         <TouchableOpacity style=
          {[styles.color,
          green,
        this.state.color === green.backgroundColor ? styles.colorSelected : {}, ]} 
        onPress={() =>
          this.setState({ color: green.backgroundColor })
        } />
         <TouchableOpacity style=
          {[styles.color,
          grey,
        this.state.color === grey.backgroundColor ? styles.colorSelected : {}, ]} 
        onPress={() =>
          this.setState({ color: grey.backgroundColor })
        } />
        </View>
       </View>
       <TouchableOpacity
               style={styles.button}
               title="Start Chatting"
               onPress={() =>
                 this.props.navigation.navigate("Chat", {
                   name: this.state.name,
                   color: this.state.color,
                 })
               }
             >
              <Text style={styles.buttonText}>Chat!</Text>
              </TouchableOpacity>
        </View>
        </ImageBackground>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
  },
  //background image
  image: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    resizeMode: "cover",
  },
  //chat app title
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
  },
  //box holding chat app info
  box: {
    backgroundColor: "#fff",
    width: "88%",
    alignItems: "center",
    height: "44%",
    justifyContent: "space-evenly",
    opacity: '75%',
  },
  colors: {
    flexDirection: "row",
  },

  button: {
    fontSize: '16',
    fontWeight: '300',
    fontColor: '#ffffff',
    buttonColor: '#757083',
  },
  color: {
    borderRadius: 15,
    width: 30,
    height: 30,
    marginTop: 20,
    marginRight: 22,
  },
  colorSelected: {
    borderStyle: "solid",
    borderWidth: 5,
    borderColor: "#5f5f5f",
    
  },
  textInput: {
    height: 40, 
    fontSize: '16',
    fontWeight: '300',
    fontColor: '#757083',
    opacity: '50%',
    borderColor: '#999999', 
    borderWidth: 1,
    color: 'black',
  },
  colorBox: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
  },
  button: {
    height: 50,
    width: "50%",
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  colorText: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 75,
  }


  
});