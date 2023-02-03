import React from 'react';
import { ImageBackground, StyleSheet, View, TextInput, Button } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };

  }

 
  render() {
    const image = {uri: "../assets/Background Image.png"}

    return (
      //main view for start screen
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      
        <TextInput
         style={styles.textInput}
         onChangeText={(name) => this.setState({name})}
         value={this.state.name}
         placeholder='Your Name...?'
       />
        <Button style={{color: 'red'}}
          title="Go to chat!"
          onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
        />
        </ImageBackground>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    font: 'trebuchet',
    flex: 1,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    height: 40, 
    borderColor: '#FFA500', 
    borderWidth: 1,
    color: 'white',
  }

  
});