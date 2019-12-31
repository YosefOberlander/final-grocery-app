import axios from 'axios';
import { AsyncStorage } from 'react-native';
let isDevMode = false;
let AppleSim = false;
let AndroidSim = false;

export let baseUrl;

if (isDevMode && AppleSim) {
    // baseUrl = 'http://2a593f62.ngrok.io/api';
    baseUrl = 'http://127.0.0.1:8000/api';
} else if (isDevMode && AndroidSim) {
    baseUrl = 'http://10.0.2.2:8000/api';
} else {
    baseUrl = 'https://beatrize.dev/grocery_public/api';
}

export function get(url, token) {
    return axios({
        method: 'GET',
        url: baseUrl + url,
        headers:{
            Accept: 'application/json',
                     'Authorization': "Bearer " + token,
        },
    })
}

export function post(url, payload, token) {
    return axios({
        method: 'POST',
        url: baseUrl + url,
        data: payload,
        headers:{
            Accept: 'application/json',
                     'Authorization': "Bearer " + token,
        },
    })
}

export function patch(url, token) {
    return axios({
        method: 'PATCH',
        url: baseUrl + url,
        headers:{
            Accept: 'application/json',
                     'Authorization': "Bearer " + token,
        },
    })
}

export function patchWithData(url, payload, token) {
    return axios({
        method: 'PATCH',
        url: baseUrl + url,
        data: payload,
        headers:{
            Accept: 'application/json',
                     'Authorization': "Bearer " + token,
        },
    })
}

export function del(url, payload, token) {
    return axios({
        method: 'DELETE',
        url: baseUrl + url,
        data: payload,
        headers: {
            Accept: 'application/json',
                        'Authorization': "Bearer " + token,
        }
    })
}