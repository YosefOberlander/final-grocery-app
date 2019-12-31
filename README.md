<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">React Native Grocery List</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> The app allows you to create grocery lists.
    <br> 
</p>

## 📝 Table of Contents

- [Deployment](#deployment)
- [TODO](#todo_list)

## 🚀 Deployment <a name = "deployment"></a>

If you receive any error running the app on IOS or Android Try The Following.

Make sure React Native Gesture Handler is installed and linked.
To install `npm install --save react-native-gesture-handler` and then make sure to link it `react-native link react-native-gesture-handler`
GitHub link `https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html`;

Make sure React Native Reanimated is installed and linked.
To install `npm install react-native-reanimated` and then make sure to link it `react-native link react-native-reanimated`
GitHub link `https://github.com/kmagiera/react-native-reanimated`

Make sure React Native Screens is installed and linked.
To install `npm install react-native-screens` and then make sure to link it `react-native link react-native-screens`
GitHub link `https://github.com/kmagiera/react-native-screens`

If you get the following error `Fatal Exception: java.lang.IllegalStateException: Native module RNDeviceModule tried to override RNDeviceModule for module name RNDeviceInfo. If this was your intention, set canOverrideExistingModule=true` go to `MainApplication.java` and look for any lines or function what are listed twice.
GitHub link to similar issue `https://github.com/react-native-community/react-native-device-info/issues/243`

If you get the following error `react-native-image-picker: NativeModule.ImagePickerManager is null. To fix this issue try these steps` make sure React Native Image Picker is installed and linked.
To install `npm install react-native-image-picker` and then make sure to link it `react-native link react-native-image-picker`
GitHub link `https://github.com/react-native-community/react-native-image-picker` and link to issue `https://github.com/react-native-community/react-native-image-picker/issues/1146` New issue with expo was fixed by downgrading to v0.28.0 see github issue `https://github.com/react-native-community/react-native-image-picker/issues/1146`


If you get an error regarding react-native-prompt-android make sure it's installed `npm i react-native-prompt-android --save` and then make sure it's linked `react-native link react-native-prompt-android`

## ⛏️ TODO List For Version 1.0 <a name = "todo_list"></a>

  - [ ] Frontend
    - [x] Create functions so the user can add images to the product.
    - [x] Fix bug where image is not displayed when uploading on android.
    - [x] Possible error for android - make sure asyncStorage is set to a string.
    - [x] Add function to create items for when a user clicks done disable the button so they won't be able to add the item more than one.
    - [x] Change keyword type for item buying price in add items.
    - [x] Add activity loaded for images in items, view item, and add item.
    - [x] Fix issue where token is invalid after loggin. - This issue should be resolved.
    - [ ] Create Android and IOS icons for ther apps.

    <hr />

  - [x] Backend
    - [x] local change in UpdateItem change from array values to $request->input() values
    - [x] local change fix mysql error for email fields `https://medium.com/laravel-news/the-simple-guide-to-deploy-laravel-5-application-on-shared-hosting-1a8d0aee923e#.m81xhkjt2`
    - [x] local change allow image_id in items migration to be nullable.
    - [x] <strong>Important</strong> place all routes in middleware.
    - [x] fix issue with uploading images, when a new picture is taken there is no file name, if there is no file name then create one else just leave the original filename.
    - [x] create settings migration and enable stay logged in.
    - [x] Add function for changing password.
    - [x] <strong>Important</strong> find away to disable users from viewing the application on the web.


## ⛏️ TODO List For Version 2.0

  - [ ] Create push notifications.
    - [ ] Create notification for adding new lists.
    - [ ] Create notification when the list is completed.

  - [ ] Add pulldown refresh for items and lists.
  - [ ] Create backend function to calculate if the list is completed.
  - [ ] Find solutions for making all api requests in one file. currently we have to call the function
  getToken() in every screen/component and set the token in the state. the ideal solution would be to have
  the getToken() function once in api.js and make all request there.
  - [ ] Migrate from npm to Yarn
  - [ ] Fix issue where the user will have to close and reopen the app if the email or password is incorrect.
  - [ ] Remove AsyncStorage from react-native and use react-native-community package.
  - [ ] Remove usage from componentWillMount().