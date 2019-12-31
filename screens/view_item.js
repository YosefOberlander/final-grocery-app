import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator, AsyncStorage,
} from "react-native";
import { Input, Image } from "react-native-elements";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from "react-native-gesture-handler";
// import ImagePicker from 'react-native-image-picker';
import { baseUrl } from "../helpers/api";
import axios from "axios";

let _self = null;

class ViewItem extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableOpacity onPress={() => _self.updateItem()}>
                <Text style={{ padding: 10, color: '#0263F9', fontSize: 17 }}>Done</Text>
            </TouchableOpacity>
        )
    })

    state = {
        item: {},
        image: null,
        isImageUploaded: false,
        imageUrl: null,
        didUserUploadNewImage: false,
        errors: null,
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

    updateItemName = (e) => {

        if (this.state.item.item_name != "") {
            this.state.errors = null
        }
        
        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.name = e;
            return {item}
        })
    }

    UpdatePreferredStore = (e) => {
        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.store = e;
            return {item}
        })
    }

    updateItemPrice = (e) => {
        this.setState(prevState => {
            let item = Object.assign({}, prevState.item);
            item.price = e;
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
        const options = {
            // noData: true
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                const source = 'data:image/jpeg;base64,' + response.data;
                this.setState({
                    image: response,
                    isImageUploaded: true,
                    imageUrl : source,
                    didUserUploadNewImage: true
                })
                
            }
        })
    }

    updateItem() {
        let tempObject = {
            item: this.state.item,
            image: this.state.image,
            didUserUploadNewImage: this.state.didUserUploadNewImage
        }
        // '/updateItem/' + this.props.navigation.state.params.id, tempObject
        axios({
            method: 'POST',
            url: 'https://beatrize.dev/grocery_public/api/updateItem/' + this.props.navigation.state.params.id, tempObject,
            headers:{
                Accept: 'application/json',
                'Authorization': "Bearer " + this.state.token,
            },
            data: tempObject
        })
            .then((res) => {
                if (res.data.updated && res.data.success) {
                    this.props.navigation.navigate('Items')
                }
            })
            .catch((err) => {
                if (err.response.status === 422) {
                    this.setState({
                        errors: err.response.data.errors
                    })
                }
            })
    }

    componentWillMount() {
        const item = this.props.navigation.state.params.item;
        this.setState({
            item: item,
            isImageUploaded: item.image == null ? false : true,
            image: item.image,
            imageUrl: item.image != null ? `${baseUrl}/getImage/${item.image.file_name}` : null
        });
    }

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        params.callFetchItems();
    }

    componentDidMount() {
        this._getToken();
        _self = this;
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>

                    {/*
                        <TouchableOpacity onPress={this.handleChoseImage}>
                        {this.state.isImageUploaded ? (
                            <Image
                                source={{ uri: this.state.imageUrl }}
                                PlaceholderContent={<ActivityIndicator />}
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
                        value={this.state.item.name}
                        errorMessage={this.state.errors ? this.state.errors.item_name[0] : ''}
                    />

                    <Input
                        placeholder='Preferred Store'
                        inputContainerStyle={styles.input}
                        keyboardType="default"
                        value={this.state.item.store}
                        onChangeText={this.UpdatePreferredStore}
                    />

                    <Input
                        placeholder='Item Price'
                        inputContainerStyle={styles.input}
                        keyboardType="numbers-and-punctuation"
                        value={this.state.item.price}
                        onChangeText={this.updateItemPrice}
                    />

                    <Input
                        placeholder='Normal Buying Qty'
                        inputContainerStyle={styles.input}
                        keyboardType="number-pad"
                        value={this.state.item.normal_buying_qty}
                        onChangeText={this.updateNormalBuyingQty}
                    />

                </View>
            </ScrollView>
        );
    }
}
export default ViewItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    input: {
        marginBottom: 5
    }
});