import React, { Component } from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import {AppContainer} from "./router/router";
import codePush from 'react-native-code-push';
import Toast from 'react-native-simple-toast';

class App extends Component {

  codePushDownloadDidProgress(progress) {
    Toast.show(progress.receivedBytes + " of " + progress.totalBytes + " received.", Toast.SHORT);
    // console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
  }

  render() {
    return (
        <AppContainer />
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: true
};

export default codePush(codePushOptions)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
