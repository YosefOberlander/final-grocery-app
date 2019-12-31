import React, { Component } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Login from "../auth/login";
import AuthLoading from "../auth/login_loading"

import Items from "../screens/items";
import Lists from "../screens/lists";
import Settings from "../screens/settings";

import NewItem from "../screens/add_new_item";
import ViewItem from "../screens/view_item";

import ViewList from "../screens/view_list";

const ItemsStack = createStackNavigator({
    Items: {
        screen: Items,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: 'Items',
            }
        }
    },
    NewItem: {
        screen: NewItem,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: 'New Item'
            }
        }
    },
    ViewItem: {
        screen: ViewItem,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: `${navigation.state.params.item_name.toUpperCase()}`
            }
        }
    }
});

const ListsStacks = createStackNavigator({
    Lists: {
        screen: Lists,
        navigationOptions: ({ navigation }) => {
            return {
                title: 'Lists'
            }
        }
    },
    ViewList: {
        screen: ViewList,
        navigationOptions: ({ navigation }) => {
            return {
                title: `${navigation.state.params.list_title.toUpperCase()}`
            }
        }
    }
});

const BottomNavigator = createBottomTabNavigator({
    Items: {
        screen: ItemsStack
    },
    Lists: {
        screen: ListsStacks
    },
    Settings: {
        screen: Settings
    }
});

const AuthLoadingStack = createStackNavigator({
    AuthLoading: {
        screen: AuthLoading,
        navigationOptions: ({ navigation }) => {
            return {
                header: null
            }
        }
    }
});

const AuthStack = createStackNavigator({
    Auth: {
        screen: Login,
        navigationOptions: ({ navigation }) => {
            return {
                header: null
            }
        }
    }
})

export const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingStack,
            App: BottomNavigator,
            Auth: AuthStack
        }, {
            initialRouteName: 'AuthLoading'
        }
    )
);
