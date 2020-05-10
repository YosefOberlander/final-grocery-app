import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActionSheetIOS,
    ActivityIndicator, AsyncStorage, Alert, Platform
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SearchBar, ListItem, CheckBox, Button } from "react-native-elements";
import { baseUrl, del } from "../helpers/api";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import _ from 'lodash'
import prompt from 'react-native-prompt-android';
import BottomSheet from "react-native-bottomsheet";
import axios from "axios";
import {NavigationEvents} from "react-navigation";

let _self = null;

class Items extends Component {
    static navigationOptions = ({ navigation }) => {
        var createListMode = false;
        var headerRight = null;
        var headerLeft = null;
        var _selfThis = navigation.state.params == undefined ? null : navigation.state.params.self;

        if (_selfThis == null) {
            createListMode = false;
        } else {
            createListMode = _selfThis.state.createListMode;
        }

        if (createListMode == false) {
            headerRight = (
                <AntDesignIcon
                    name="plus"
                    size={21}
                    style={{padding: 10, color: '#8A8A8F'}}
                    onPress={() => _self.handleNewItemNavigate()}
                />
            ),
                headerLeft = (
                    <AntDesignIcon
                        name="sync"
                        size={18}
                        style={{padding: 10, paddingLeft: 15, color: '#8A8A8F'}}
                        onPress={() => _self.fetchItems()}
                    />
                )
        } else {
            headerRight = (
                <TouchableOpacity onPress={() => _self._onOpenActionSheet()}>
                    <Text style={{padding: 10, color: '#0263F9', fontSize: 17}}>Done</Text>
                </TouchableOpacity>
            ),
                headerLeft = (
                    <TouchableOpacity onPress={() => _self.handleCancelList()}>
                        <Text style={{padding: 10, color: '#0263F9', fontSize: 17}}>Cancel</Text>
                    </TouchableOpacity>
                )
        }


        return {headerRight, headerLeft}
    };

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            items: [],
            itemsArray: [],
            createListMode: false,
            selectedItems: [],
            refreshing: false,
            loading: true,
            token: null
        };
    }
    updateSearch = search => {

        this.setState({
            searchTerm: search
        });

        const newData = this.state.itemsArray.filter(item => {
            let itemData;
            if (item.store !== null && item.store !== 'undefined') {
                itemData = `${item.name.toUpperCase()} ${item.store.toUpperCase()}`;
            } else {
                itemData = `${item.name.toUpperCase()}`;
            }
            const textData = search.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        this.setState({ items: newData });
    };

     _getToken = ()  => {
        AsyncStorage.getItem("token")
            .then((token) => {
                this.setState({
                    token: token
                }, () => {
                    this.fetchItems();
                })
            })
    };

    fetchItems = () => {
        this.setState({
            items: [],
            itemsArray: []
        });

        // return;
        axios({
            method: 'GET',
            url: 'https://beatrize.dev/grocery_public/api/fetchItems',
            headers:{
                Accept: 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            },
        })
            .then((res) => {
                if (res.data.success) {
                    let ApiItems = res.data.items;
                    this.setState({
                        items: res.data.items,
                        itemsArray: res.data.items,
                        loading: false
                    });

                }
            })
            .catch((err) => {
                // Alert.alert(err);
                // console.log(err.response);
            })
    }

    handleNewItemNavigate() {
        this.props.navigation.navigate('NewItem', {
            callFetchItems: this.fetchItems.bind(this)
        })
    };

    handleItemClick(id, item_name, item) {
        this.props.navigation.navigate('ViewItem', {
            id: id,
            item_name: item_name,
            item: item,
            callFetchItems: this.fetchItems.bind(this)
        })
    }

    componentDidMount() {
        this._getToken();
        _self = this;
    }

    handleCancelList = () => {
        this.setState({
            createListMode: false,
            selectedItems: []
        }, () => {
            this.props.navigation.setParams({ self: this })
        })

    }

    handleItemLongHold = () => {
        if (this.state.createListMode) {
            this.setState({
                createListMode: false
            }, () => {
                this.props.navigation.setParams({ self: this })
            })
        } else {
            this.setState({
                createListMode: true
            }, () => {
                this.props.navigation.setParams({ self: this })
            })
        }
    }

    findItemInCheckedItemsArray = (id) => {

        const isIn = this.state.selectedItems.find((item) => {
            return item.id == id 
        })

        return isIn == undefined ? false : true;
    }

    handleItemChecked = (id) => {

        if (this.findItemInCheckedItemsArray(id)) {

            const isIn = this.state.selectedItems.find((item) => {
                return item.id == id
            })
            let index = _.findIndex(this.state.selectedItems, isIn);

            let array = [...this.state.selectedItems];
            array.splice(index, 1)
            this.setState({
                selectedItems: array
            })

        } else {
            this.setState({
                selectedItems: this.state.selectedItems.concat({
                    id: id
                })
            })
        }

    }

    handleCreateListClick = () => {
        prompt(
            'Title your list',
            null,
            [
            {text: 'Cancel', onPress: () => this.handleCancelList(), style: 'cancel'},
            {text: 'OK', onPress: title => this.createList(title)},
            ],
            {
                cancelable: false,
            }
        );
    }

    createList = (title) => {
        let items = this.state.selectedItems;
        let itemIds = [];

        for (let i = 0; i < items.length; i++) {
           itemIds.push(items[i].id)
        }

        let tempObj = {
            title: title,
            itemIds: itemIds
        };

        axios({
            method: 'POST',
            url: 'https://beatrize.dev/grocery_public/api/createList',
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
            data: tempObj
            })
            .then((res) => {
                if (res.data.success && res.data.created) {
                    this.setState({
                        createListMode: false,
                        selectedItems: []
                    }, () => {
                        this.props.navigation.setParams({ self: this })
                        this.props.navigation.navigate('Lists');
                    })
                }
            })
            .catch((err) => {
                
            })
    }

    deleteSelectedItems = () => {
        let tempObj = {
            ids: this.state.selectedItems
        };
        axios({
            method: 'DELETE',
            url: 'https://beatrize.dev/grocery_public/api/deleteItems',
            headers:{
            Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
            data: tempObj
        })
            .then((res) => {
                if (res.data.success && res.data.deleted) {
                    this.handleCancelList();
                    this.fetchItems();
                }
            })
            .catch((err) => {
                
            })
    }

    _onOpenActionSheet = () => {

        if (this.state.selectedItems.length === 0) {
            this.handleCancelList();
            return;
        } 

        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['Cancel', 'Delete Item(s)', 'Create List'],
                  destructiveButtonIndex: 1,
                  cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                  if (buttonIndex === 1) {
                      this.deleteSelectedItems();
                  } else if (buttonIndex === 0) {
                      this.handleCancelList();
                  } else {
                      this.handleCreateListClick();
                  }
                },
              );
        } else if (Platform.OS == "android") {
            // alert('not supported on android!');
            // return;
            BottomSheet.showBottomSheetWithOptions({
                options: ['Delete Item(s)', 'Create List', 'Cancel'],
                title: 'Demo Bottom Sheet',
                cancelButtonIndex: 2,
              }, (value) => {
                if (value === 0) {
                    this.deleteSelectedItems();
                } else if (value === 1) {
                    this.handleCreateListClick();
                } else if ( value === 2) {
                    this.handleCancelList();
                }
              });
        }
      };

    render() {

        const { searchTerm } = this.state;

        if (this.state.loading) {
            return (<ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}/>)
        }

        return (
            <ScrollView>
                <View style={styles.container}>

                    <SearchBar
                        placeholder="Search For Items..."
                        onChangeText={this.updateSearch}
                        value={searchTerm}
                        lightTheme
                        round
                        showCancel
                    />
                    
                    <View>                 
                        {
                            this.state.items.map((l, i) => (
                                <ListItem
                                    key={i}
                                    title={l.name}
                                    subtitle={'Preferred Store - ' +  l.store}
                                    bottomDivider
                                    chevron
                                    onPress={this.state.createListMode == true ? () => this.handleItemChecked(l.id) : () => this.handleItemClick(l.id, l.name, l)}
                                    onLongPress={() => this.handleItemLongHold()}
                                    leftElement={
                                        this.state.createListMode == true ?

                                            <CheckBox 
                                                containerStyle={{ padding: 0, margin: 0}}
                                                onPress={() => this.handleItemChecked(l.id)}
                                                checked={this.findItemInCheckedItemsArray(l.id)}
                                                iconType='material-community'
                                                checkedIcon='check-circle-outline'
                                                uncheckedIcon='checkbox-blank-circle-outline'
                                            /> 
                                            
                                        : null 
                                    }
                                />
                            ))
                        }
                    </View>

                </View>

                <NavigationEvents onDidFocus={() => this.fetchItems()}></NavigationEvents>

            </ScrollView>
        );
    }
}
export default Items;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});