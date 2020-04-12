import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView, AsyncStorage
} from "react-native";
import { SearchBar, ListItem, CheckBox, Divider } from "react-native-elements";
import axios from "axios";
import {NavigationEvents} from "react-navigation";

class Lists extends Component {

    state = {
        searchTerm: "",
        lists: [],
        listsArray: [],
        completedList: [],
        uncompletedList: [],
        token: null
    }

    updateSearch = search => {
        this.setState({
            searchTerm: search
        });

        const newData = this.state.listsArray.filter(item => {
            const itemData = `${item.list_title.toUpperCase()}`;
            const textData = search.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        this.setState({ lists: newData });
    }

    _getToken = ()  => {
        AsyncStorage.getItem("token")
            .then((token) => {
                this.setState({
                    token: token
                }, () => {
                    this.fetchLists();
                })
            })
    };

    fetchLists = () => {

        this.setState({
            lists: [],
            listsArray: [],
            completedList: [],
            uncompletedList: []
        });

        axios({
            method: 'GET',
            url: 'https://beatrize.dev/grocery_public/api/fetchLists',
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
        })
            .then((res) => {
                if (res.data.success) {

                    this.setState({
                        lists: res.data.lists,
                        listsArray: res.data.lists
                    });

                    res.data.lists.forEach(elm => {

                        if (elm.completed != 0) {
                            this.setState({
                                completedList: this.state.completedList.concat(elm)
                            });
                        } else {
                            this.setState({
                                uncompletedList: this.state.uncompletedList.concat(elm)
                            });
                        }

                    });

                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleListClick = (id, list_title, list) => {
        this.props.navigation.navigate('ViewList', {
            id: id,
            list_title: list_title,
            list: list
        })
    }

    componentDidMount() {
        this._getToken()
    }

    render() {
        const {searchTerm} = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    
                    <SearchBar
                        placeholder="Search for an list..."
                        onChangeText={this.updateSearch}
                        value={searchTerm}
                        round
                        showCancel
                        lightTheme
                    />

                    <View style={{ height: 50, padding: 7, backgroundColor: '#DDE2E7', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 17 }}>Completed</Text>
                    </View>

                    <View>
                        {
                            this.state.completedList.map((l, i) => (
                                <ListItem
                                    key={i}
                                    title={l.list_title}
                                    subtitle={'Total Items - ' + l.items_count}
                                    bottomDivider
                                    chevron
                                    onPress={() => this.handleListClick(l.id, l.list_title, l)}
                                />
                            ))
                        }
                    </View>

                    <View style={{ height: 50, padding: 7, backgroundColor: '#DDE2E7', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 17 }}>Uncompleted</Text>
                    </View>

                    <View>
                        {
                            this.state.uncompletedList.map((l, i) => (
                                <ListItem
                                    key={i}
                                    title={l.list_title}
                                    subtitle={'Total Items - ' + l.items_count}
                                    bottomDivider
                                    chevron
                                    onPress={() => this.handleListClick(l.id, l.list_title, l)}
                                />
                            ))
                        }
                    </View>

                </View>

                <NavigationEvents onDidFocus={() => this.fetchLists()}></NavigationEvents>
            </ScrollView>
        );
    }
}
export default Lists;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});