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

    _handleLogout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('AuthLoading')
    }

    _checkLogin = async () => {
        const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
        // const setToExpireAt = await AsyncStorage.getItem('setToExpireAt');
        // token = await AsyncStorage.getItem('token');
        

        this.props.navigation.navigate(loggedInStatus !== '1' ? 'Auth' : 'App');

        /*
        let now = new Date();

        if (setToExpireAt < now.toLocaleTimeString()) {
            this._handleLogout();
        }
        */

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