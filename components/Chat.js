import React from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: "",
      user: {},
    };
    // if (!firebase.apps.length) {
    //   firebase.initializeApp(firebaseConfig);
    // }
    // const firebaseConfig = {
    //   apiKey: "AIzaSyAHi1wCLcVwD4N1vLC59MThCugZaytXT9Q",
    //   authDomain: "hello-world-8932e.firebaseapp.com",
    //   projectId: "hello-world-8932e",
    //   storageBucket: "hello-world-8932e.appspot.com",
    //   messagingSenderId: "12408759444",
    //   appId: "1:12408759444:web:e2121e2f62c2210a6b4081",
    // };

    firebase.initializeApp({
      apiKey: "AIzaSyAHi1wCLcVwD4N1vLC59MThCugZaytXT9Q",
      authDomain: "hello-world-8932e.firebaseapp.com",
      projectId: "hello-world-8932e",
      storageBucket: "hello-world-8932e.appspot.com",
      messagingSenderId: "12408759444",
      appId: "1:12408759444:web:e2121e2f62c2210a6b4081",
    });

    this.referenceChatMessages = firebase.firestore().collection("messages");
    // .where("uid", "==", this.state.uid);
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        loggedInText: "Hello There",
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  //sends new message along with old messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
      this.setState({
        messages,
      });
    });
  };

  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
    });
  };

  //makes users' message bubble the color black
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* if the user is using an android device, 
    this makes it so their keyboard dowsn't hide the chat field */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});

// run it with expo check the errors
// somethign with uid
// keep checkin other codes i guess
