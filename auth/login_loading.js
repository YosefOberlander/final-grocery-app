import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
    AsyncStorage
} from "react-native";

class AuthLoading extends Component {

    constructor(props) {
        super(props);

        this._checkLogin();

    }

    _checkLogin = async () => {
        const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
        this.props.navigation.navigate(loggedInStatus != '1' ? 'Auth' : 'App');
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
export default AuthLoading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});