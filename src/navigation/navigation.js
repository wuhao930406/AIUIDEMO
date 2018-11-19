/**
 * Created by kurosaki on 2018/9/3.import {TabNav} from "./RootPage";
 */

import React from 'react';
import {createStackNavigator} from 'react-navigation';

import { AiTransfer,ChangeTheme,HomePage,AiSearch } from '../container'
import { Header } from '../components'
import {
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import StackViewStyleInterpolator from "react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator";

const styles = StyleSheet.create({
    icon: {
        width: 16,
        height: 16,
    },
});
let {height,width} =  Dimensions.get('window');

const AppNavigator = createStackNavigator({
        HomePage: {
            screen: HomePage,
            navigationOptions: ({navigation}) => ({
                header: null
            })
        },
        ChangeTheme: {
            screen: ChangeTheme,
            navigationOptions: ({navigation}) => ({
                header: null
            })
        },
        AiSearch: {
            screen: AiSearch,
            navigationOptions: ({navigation}) => ({
                header: null
            })
        },
    },
    {
        initialRouteName: 'HomePage',
        headerMode: 'screen',
        mode:"modal",
        transitionConfig:()=>({
            screenInterpolator:StackViewStyleInterpolator.forHorizontal,
        }),
    });

export default AppNavigator;

