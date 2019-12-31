import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet, AsyncStorage
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ListItem, Input, CheckBox } from "react-native-elements";
import { patch, patchWithData } from "../helpers/api";
import _ from 'lodash';
import axios from "axios";

let _self = null;

class ViewList extends Component {

    state = {
        list: [],
        listItems: [],
        token: null
    };

    _getToken = ()  => {
        AsyncStorage.getItem("token")
            .then((token) => {
                this.setState({
                    token: token
                });
            })
    };

    setStateFromProps = () => {
        this.setState({
            list: this.props.navigation.getParam('list'),
            listItems: this.props.navigation.state.params.list.items
        });
    };

    handleItemCompletedStatus(id, l) {
        axios({
            method: 'PATCH',
            url: 'https://beatrize.dev/grocery_public/api/updateItemCompletedStatus/' + id,
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
        })
            .then((res) => {
                if (res.data.success && res.data.updated) {

                    let index = _.findIndex(this.state.listItems, l)
                    

                    let stateCopy = Object.assign({}, this.state);
                    stateCopy.listItems = stateCopy.listItems.slice();   
                    stateCopy.listItems[index] = Object.assign({}, stateCopy.listItems[index]);
                    
                    if (stateCopy.listItems[index].pivot.completed == 1) {
                        stateCopy.listItems[index].pivot.completed = 0
                    } else {
                        stateCopy.listItems[index].pivot.completed = 1
                    }

                    this.setState(stateCopy);

                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    
    handleItemBuyingQty(l, id, e) {

        let index = _.findIndex(this.state.listItems, l)
                    

        let stateCopy = Object.assign({}, this.state);
        stateCopy.listItems = stateCopy.listItems.slice();   
        stateCopy.listItems[index] = Object.assign({}, stateCopy.listItems[index]);
        stateCopy.listItems[index].pivot.qty = e
        this.setState(stateCopy);
    }

    fetchItems = () => {
        console.log(this.state.list.id);
    }

    componentWillMount() {
        this._getToken();
        _self = this;
        this.setStateFromProps();
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    {
                        this.state.listItems.map((l, i) => (
                            <ListItem
                                key={i}
                                title={l.name}
                                bottomDivider
                                leftElement={
                                    <CheckBox
                                        containerStyle={{ padding: 0, margin: 0 }}
                                        iconType='material-community'
                                        checkedIcon='check-circle-outline'
                                        uncheckedIcon='checkbox-blank-circle-outline'
                                        checked={l.pivot.completed == 0 ? false : true}
                                        onPress={() => this.handleItemCompletedStatus(l.pivot.id, l)}
                                    />
                                }
                                rightElement={
                                    <Input
                                        inputStyle={{ width: 45 }}
                                        containerStyle={{ width: 45 }}
                                        value={l.pivot.qty.toString()}
                                        onChangeText={(e) => this.handleItemBuyingQty(l, l.pivot.id, e)}
                                        keyboardType="number-pad"
                                    />
                                }
                            />
                        ))
                    }

                </View>
            </ScrollView>
        );
    }
}
export default ViewList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});