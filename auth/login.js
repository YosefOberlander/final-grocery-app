import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    AsyncStorage
} from "react-native";
import { Input, Button } from "react-native-elements";
import axios from "axios";
// import { baseUrl } from "../helpers/api";
import _ from 'lodash';

// const AppleBaseUrl = 'https://beatrize.dev/grocery_public/api';
// const AppleBaseUrl = 'http://127.0.0.1:8000/api';
// const AndroidBaseUrl = 'http://10.0.2.2:8000/api';
const baseUrl = 'https://beatrize.dev/grocery_public/api';

class Login extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            email: '',
            password: ''
        }

    }

    _login = async () => {
        return axios({
            method: 'POST',
            url: baseUrl + '/login',
            data: this.state
        }).then((res) => {
            if (res.data.success) {
                AsyncStorage.setItem("token", res.data.token);
                // AsyncStorage.setItem("token_expires", res.data.expires);
                AsyncStorage.setItem("isLoggedIn", '1')
                AsyncStorage.setItem("user", JSON.stringify(res.data.user));
                
                /*
                if (_.isEmpty(res.data.expires)) {
                    AsyncStorage.setItem('setToExpireAt', 'never');
                } else {
                    let minutes = Math.floor(res.data.expires / 60);

                    let now = new Date();
                    now.setMinutes(now.getMinutes() + minutes);
                    now = new Date(now);

                    AsyncStorage.setItem('setToExpireAt', now.toLocaleTimeString());
                }
                */

                if (AsyncStorage.getItem("token") !== null || AsyncStorage.getItem("token") !== undefined) {
                    this.props.navigation.navigate('App')
                }

            }
        })
        .catch((err) => {
            if (err.response.data.error) {
                this.setState({
                    loginErrorMessage: err.response.data.error
                })
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.input}>
                    <Input label="Email Address" textContentType="emailAddress" autoCompleteType="email" autoCapitalize="none" onChangeText={(e) => this.setState({ email: e })} errorMessage={this.state.loginErrorMessage ? this.state.loginErrorMessage : '' } />
                </View>

                <View style={styles.input}>
                    <Input label="Password" textContentType="password" autoCompleteType="password" autoCapitalize="none" secureTextEntry={true} onChangeText={(e) => this.setState({ password: e })} />
                </View>

                <View>
                    <Button
                        style={styles.button}
                        title="Login"
                        onPress={() => this._login()}
                    />
                </View>

            </View>
        );
    }
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'stretch',
        marginLeft: 15,
        marginRight: 15
   },
   input: {
       marginBottom: 15
   },
   button: {
       marginTop: 15,
       backgroundColor: '#4d7cfe'
   },
});