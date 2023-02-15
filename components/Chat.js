import React from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInText: "",
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
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
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAHi1wCLcVwD4N1vLC59MThCugZaytXT9Q",
        authDomain: "hello-world-8932e.firebaseapp.com",
        projectId: "hello-world-8932e",
        storageBucket: "hello-world-8932e.appspot.com",
        messagingSenderId: "12408759444",
        appId: "1:12408759444:web:e2121e2f62c2210a6b4081",
      });
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //
  componentDidMount() {
    //sets user's name is header
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.getMessages();
    //checks to see if the user has internet connection or not
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");
      } else {
        this.setState({ isConnected: false });
        console.log("offline");
      }
    });

    // create a reference to the active user's documents
    this.referenceChatMessagesUser = firebase
      .firestore()
      .collection("messages")
      .where("uid", "==", this.state.uid);
    this.unsubscribe = this.referenceChatMessages.onSnapshot(
      this.onCollectionUpdate
    );

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // update user state with current user data
      this.setState({
        uid: user?.uid,
        messages: [],
      });
      // listen for collection changes for current user
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
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  //adds message to chat
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
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
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({
      messages,
    });
  };
  //makes users' message bubble the color black and the other users' grey
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#eee",
          },
        }}
      />
    );
  }
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }
  render() {
    let backgroundColor = this.props.route.params.color;
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
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
