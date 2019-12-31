import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator, AsyncStorage
} from "react-native";
import { Input, Image } from "react-native-elements";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from "react-native-gesture-handler";
// import ImagePicker from 'react-native-image-picker';
import axios from "axios";

let _self = null;

class NewItem extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableOpacity onPress={() => _self.addNewItem()}>
                <Text style={{ padding: 10, color: '#0263F9', fontSize: 17 }}>Done</Text>
            </TouchableOpacity>
        )
    })

    state = {
        item: {
            item_name: "",
            preferred_store: "",
            item_price: "",
            normal_buying_qty: ""
        },
        image: null,
        isImageSelected: false,
        imageUrl: null,
        errors: null,
        isProcessing: false,
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

    addNewItem() {
        this.setState({ isProcessing: true });

        if (this.state.isProcessing == true && this.state.errors == null) {
            return;
        }
        
        let tempObject  = {
            item: this.state.item,
            image: this.state.image
        }

        axios({
            method: 'POST',
            url: 'https://beatrize.dev/grocery_public/api/createNewItem',
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
            data: tempObject
        })
            .then((res) => {
                if (res.data.created && res.data.success) {
                    this.props.navigation.navigate('Items')
                    this.setState({ isProcessing: false })
                }
            })
            .catch((err) => {
                if (err.response.status === 422) {
                    this.setState({
                        errors: err.response.data.errors,
                        isProcessing: false
                    })
                }
            })
    }


    updateItemName = (e) => {

        if (this.state.item.item_name != "") {
            this.state.errors = null
        }

        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.item_name = e;
            return {item}
        })
    }

    UpdatePreferredStore = (e) => {
        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.preferred_store = e;
            return {item}
        })
    }

    updateItemPrice = (e) => {
        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.item_price = e;
            return {item}
        })
    }

    updateNormalBuyingQty = (e) => {
        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.normal_buying_qty = e;
            return {item}
        })
    }

    handleChoseImage = () => {
        /*
        <Image
                                source={{ url: image.data }}
                                style={{ height: 200, width: 100 + '%', marginBottom: 25 }}
                            />
                            */
        const options = {
            // noData: true
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                console.log(response);
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    image: response,
                    isImageSelected: true,
                    imageUrl: source
                })
            }
        })
    }

    componentDidMount() {
        this._getToken();
        _self = this;
    }


    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        params.callFetchItems();
    }
    

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>

                    {/* 
                        <TouchableOpacity onPress={this.handleChoseImage}>
                        {this.state.isImageSelected ? (
                            <Image
                                source={this.state.imageUrl}
                                placeholderContent={<ActivityIndicator />}
                                style={{ height: 200, width: 100 + '%', marginBottom: 25 }}
                            />
                        ) : (
                            <View style={{ height: 200, borderColor: '#0087F7', borderWidth: 2, borderStyle: 'dashed', backgroundColor: '#E8E9EC', justifyContent: 'center', alignItems: 'center', marginBottom: 25 }}>
                                <Text style={{ color: '#0087F7', fontSize: 17 }}>Click here to upload a item picture.</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    */}

                    <Input
                        placeholder='Item Name'
                        inputContainerStyle={styles.input}
                        keyboardType="default"
                        onChangeText={this.updateItemName}
                        errorMessage={this.state.errors ? "The item name cannot be empty" : ''}
                    />

                    <Input
                        placeholder='Preferred Store'
                        inputContainerStyle={styles.input}
                        keyboardType="default"
                        onChangeText={this.UpdatePreferredStore}
                    />

                    <Input
                        placeholder='Item Price'
                        inputContainerStyle={styles.input}
                        keyboardType="numbers-and-punctuation"
                        onChangeText={this.updateItemPrice}
                    />

                    <Input
                        placeholder='Normal Buying Qty'
                        inputContainerStyle={styles.input}
                        keyboardType="number-pad"
                        onChangeText={this.updateNormalBuyingQty}
                    />

                </View>
            </ScrollView>
        );
    }
}
export default NewItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    input: {
        marginBottom: 5
    }
});