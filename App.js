import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/core/store/store';
import AppNavigator from "./src/navigation/navigation"


export default class App extends Component<Props> {
  render() {
    return (
        <Provider store={store}>
          <AppNavigator></AppNavigator>
        </Provider>

    );
  }
}

