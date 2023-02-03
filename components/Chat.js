import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Chat extends React.Component {
    componentDidMount(){
        let name = this.props.route.params.name; // OR ...
        this.props.navigation.setOptions({ title: name });
    }

    render() {

        return (
            <View style={styles.container}>
            {/* Rest of the UI */}
            </View>
        );
    };
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#151515',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });