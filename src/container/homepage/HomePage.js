/**
 * Created by kurosaki on 2018/11/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableHighlight,
    ImageBackground,
    Dimensions,
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { themeRuler } from '../../components'
let {height,width} =  Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        display:"flex",
        width:width,
        height:height,
        overflow:"hidden",
        justifyContent:"space-around",
        alignItems:"center"
    },
    head:{
        width:122,
        height:122,
        alignSelf:"center",
        borderRadius:600,
        marginTop:28
    },
    text:{
        color:"#ffffff",
        fontSize:18,
        textAlign:"center"
    }
})

class HomePage extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            ifshow:false,
            togAnim:new Animated.Value(0),//初始化动画值
            togAnim1:new Animated.Value(0),//初始化动画值
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        Animated.timing(                  // 随时间变化而执行动画
            this.state.togAnim,            // 动画中的变量值
            {
                toValue: 100,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
            }
        ).start();                        // 开始执行动画
        Animated.timing(                  // 随时间变化而执行动画
            this.state.togAnim1,            // 动画中的变量值
            {
                toValue: 120,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
            }
        ).start();                        // 开始执行动画

    }


    /*------------btn fn--------------*/
    jumpUrl(key){
        this.props.navigation.navigate(key);
    }

    shouldComponentUpdate(nextProps){
        if(this.props.appTheme != nextProps.appTheme){
            return true
        }
    }


    render() {
        let { ifshow,togAnim1,togAnim }=this.state;
        let theme = this.props.appTheme;

        return (
            <ImageBackground
                style={styles.container}
                source={require('../../assets/images/bg.png')}
                resizeMode='cover'>
                <Image style={styles.head} source={theme=="danger"?require('../../assets/images/logodanger.png'):theme=="war"?require("../../assets/images/logowarning.png"):require('../../assets/images/logo.png')}>
                </Image>
                <Text style={styles.text}>
                    请选择你要使用的功能!
                </Text>
                <Animated.View style={{alignSelf:"flex-start",height:togAnim}} >
                    <TouchableOpacity onPress={()=>this.jumpUrl('ChangeTheme')}>
                            <Image style={{width:100,height:100,marginLeft:60}} source={require('../../assets/images/icon01.png')}></Image>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{alignSelf:"flex-end",height:togAnim1,marginBottom:44}} >
                    <TouchableOpacity onPress={()=>this.jumpUrl('AiSearch')}>
                            <Image style={{width:120,height:120,marginRight:60}} source={require('../../assets/images/icon02.png')}></Image>
                    </TouchableOpacity>
                </Animated.View>
            </ImageBackground>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        appTheme: state.appTheme,
    }
}
HomePage = connect(mapStateToProps)(HomePage)

export default HomePage