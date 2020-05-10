import React, { Component } from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';
import {AppContainer} from "./router/router";
import codePush from 'react-native-code-push';
import Toast from 'react-native-simple-toast';

class App extends Component {

  codePushStatusDidChange(status) {
    switch(status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        // console.log("Checking for updates.");
        Toast.show('checking for updates', Toast.SHORT);
          // Alert.alert('checking for updates')
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        Toast.show('Downloading package.', Toast.LONG);
        // console.log("Downloading package.");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        Toast.show('Installing update.', Toast.LONG);
        // console.log("Installing update.");
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        Toast.show('Up-to-date.', Toast.SHORT);
        // console.log("Up-to-date.");
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        Toast.show('Update installed.', Toast.SHORT);
        // console.log("Update installed.");
        break;
    }
  }

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
  installMode: codePush.InstallMode.IMMEDIATE
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
