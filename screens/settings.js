import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    AsyncStorage
} from "react-native";
import { ListItem } from "react-native-elements";
import prompt from 'react-native-prompt-android';
import axios from "axios";

class Settings extends Component {

    state = {
        accountSettings: [
            {
                title: 'Notifications',
                reverseColor: '#FF2D55',
                icon: 'notifications',
                type: 'MaterialIcons'
            },
        ],
        ChangePasswordListItem: [
            {
                title: 'Change Password',
                reverseColor: '#4CD964',
                icon: 'lock',
                type: 'SimpleLineIcons'
            },
        ],
        logoutListItem: [
            {
                title: 'Sign Out',
                reverseColor: '#9013FE',
                icon: 'logout',
                type: 'material-community',
            },
        ],
        moreOptions: [
            {title: 'Enable Push Notifications'},
        ],
        neverSignOut: [
            {title: 'Never Sign Out'},
        ],
        ChangePasswordHasError: false,
        ChangePasswordError: null,
        user: "",
        userSettings: "",
        token: null
    };

    _getToken = ()  => {
        AsyncStorage.getItem("token")
            .then((token) => {
                this.setState({
                    token: token
                }, () => {
                    AsyncStorage.getItem("user")
                        .then((user) => {
                            this.setState({
                                user: JSON.parse(user)
                            }, () => {
                                this.getUserSettings(this.state.user.id)
                            })
                        })
                });
            })
    };

    _handleLogout = async () => {
        axios({
            method: 'GET',
            url: 'https://beatrize.dev/grocery_public/api/logout',
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
        })
            .then((res) => {
                if (res.data.logout) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('AuthLoading')
                }
            })
            .catch((err) => {
                if (err.response.status === 500 && err.response.data.error === true) {
                    alert('There was a problem logging you out. Please try again');
                }
            })
    }

    _handleChangePassword = () => {
        prompt(
            'Old Password',
            this.state.ChangePasswordHasError ? this.state.ChangePasswordError : null,
            [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: password => this._changePassword(password)},
            ],
            {
                cancelable: false,
                type: 'secure-text',
            }
        );
    }

    _changePassword = (password) => {

        AsyncStorage.getItem("token")
            .then((token) => {

                let tempObject = {
                    password: password,
                    token: token
                };
                // changePassword
                axios({
                    method: 'POST',
                    url: 'https://beatrize.dev/grocery_public/api/changePassword',
                    headers:{
                        Accept: 'application/json',
                        'Authorization': "Bearer " + this.state.token,
                    },
                    data: tempObject
                })
                    .then((res) => {
                        if (res.data.passwordDoesNotMatch) {
                            this.setState({
                                ChangePasswordHasError: true,
                                ChangePasswordError: 'Your old password does not match.'
                            }, () => {
                                if (this.state.ChangePasswordHasError) {
                                    this._handleChangePassword();
                                }
                            })
                        } else if (res.data.success && res.data.updated) {
                            alert('Your password has Successfully been updated.');
                        }
                    })
                    .catch((err) => {
                        console.log(err.response);
                    })

            })
    }

    getUserSettings(user_id) {
        axios({
            method: 'GET',
            url: 'https://beatrize.dev/grocery_public/api/getSettings/' + user_id,
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
        })
            .then((res) => {
                if (res.data.success) {
                    this.setState({
                        userSettings: res.data.settings
                    })
                }
            })
            .catch((err) => {
                console.log(err.response);
            })
    }

    _handleSettingsUpdates(neverLogoutValue) {
        this.setState(prevState => {
            let userSettings = Object.assign({}, prevState.userSettings);
            userSettings.never_logout = neverLogoutValue;
            return {userSettings}
        }, () => {
            // /updateSettings/${this.state.user.id}`, this.state.userSettings
            axios({
                method: 'POST',
                url: `https://beatrize.dev/grocery_public/api/updateSettings/${this.state.user.id}`,
                data: this.state.userSettings
            })
                .then((res) => {
                    if (res.data.success && res.data.updated) {
                        this.setState({
                            userSettings: res.data.settings
                        }, () => {
                            if (this.state.userSettings.never_logout == 1) {
                                alert('You have to logout and then login for the never logout to be enabled.')
                            }
                        })
                    }
                })
                .catch((err) => {
                    console.log(err.response)
                })  
        })
    }

    componentWillMount() {
        this._getToken();
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.container}>
                    
                        <View style={{ display: 'flex', paddingTop: 20, paddingLeft: 10, paddingBottom: 20, width: null, borderBottomColor: '#EFEFF4', borderBottomWidth: 1}}>
                                    
                                <View style={{ paddingLeft: 20 }}>
                                    <Text style={{ color: 'black', fontSize: 28 }}>Hi {this.state.user.name}!</Text>
                                </View>
            
                        </View>

                        <View style={{ marginTop: 20, height: 224, width: null, marginBottom: 20 }}>
                            <Text style={{ color: 'black', fontSize: 17, marginTop: 10, paddingLeft: 10 }}>Account</Text>
                            
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.ChangePasswordListItem.map((l, i) => (
                                        <ListItem
                                            key={i}
                                            title={l.title}
                                            leftIcon={{ name: l.icon, type: l.type, color: l.reverseColor, reverseColor: 'white', reverse: true, size: 15 }}
                                            containerStyle={{ padding: 0, margin: 0, paddingRight: 15 }}
                                            onPress={() => this._handleChangePassword()}
                                            bottomDivider
                                            chevron
                                        />
                                    ))
                                }
                                {
                                    this.state.accountSettings.map((l, i) => (
                                        <ListItem
                                            key={i}
                                            title={l.title}
                                            leftIcon={{ name: l.icon, type: l.type, color: l.reverseColor, reverseColor: 'white', reverse: true, size: 15 }}
                                            containerStyle={{ padding: 0, margin: 0, paddingRight: 15 }}
                                            bottomDivider
                                            chevron
                                        />
                                    ))
                                }
                                {
                                    this.state.logoutListItem.map((l, i) => (
                                        <ListItem
                                            key={i}
                                            title={l.title}
                                            leftIcon={{ name: l.icon, type: l.type, color: l.reverseColor, reverseColor: 'white', reverse: true, size: 15 }}
                                            containerStyle={{ padding: 0, margin: 0, paddingRight: 15 }}
                                            onPress={() => this._handleLogout()}
                                            bottomDivider
                                            chevron
                                        />
                                    ))
                                }
                        </View>

                    </View>

                        <View style={{ marginTop: 20, height: 179, width: null, paddingLeft: 10 }}>
                            <Text style={{ color: 'black', fontSize:17 }}>More Options</Text>
        
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.neverSignOut.map((l, i) => (
                                        <ListItem 
                                            key={i}
                                            title={l.title}
                                            switch={
                                                {
                                                    value: false,
                                                    // onValueChange: (neverLogoutValue) => this._handleSettingsUpdates(neverLogoutValue)
                                                }
                                            }
                                            containerStyle={{ padding: 0, margin: 0, paddingRight: 15}}
                                            bottomDivider
                                        />
                                    ))
                                }
                            </View>

                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});