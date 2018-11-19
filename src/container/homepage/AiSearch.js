/**
 * Created by kurosaki on 2018/11/9.
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
    Platform,
    ScrollView,
    TouchableNativeFeedback,
    TouchableOpacity,
    TextInput,
    NativeEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import Button from "react-native-button";
import { themeRuler,HttpUtils } from '../../components';
import { Recognizer, Synthesizer, SpeechConstant } from "react-native-speech-iflytek";

let {height,width} =  Dimensions.get('window');

const styles = StyleSheet.create({
    containers: {
        flex: 1,
    },
    container: {
        flex: 1,
        width:width,
        height:height,
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 24,
    },
    row:{
        width:width-48,
        flexDirection:"row",
        justifyContent: "space-between",
        alignItems: "center",
        height:100
    },
    result: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    recordBtn: {
        height: 34,
        fontSize: 16,
        textAlign: "center",
        textAlignVertical: "center",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#ccc"
    },
    containerStyle: {
        borderRadius:120
    }
})

class AiSearch extends Component<Props> {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            Synthesizer.init("57c7c5b0");
            Recognizer.init("57c7c5b0");
        } else if (Platform.OS === 'ios') {
            Synthesizer.init("59a4161e");
            Recognizer.init("59a4161e");
        }
        this.state = {
            theme:props.appTheme,
            title:"",
            text: "",
            ifshow:true,
            recordBtnText: "长按说话",
            togAnim:new Animated.Value(0),//初始化动画值
            togAnims:new Animated.Value(-100),//初始化动画值
            chartData:[]


        };
        this.onRecordStart = this.onRecordStart.bind(this);//开始
        this.onRecordEnd = this.onRecordEnd.bind(this);//结束
        this.onRecordCancel = this.onRecordCancel.bind(this);//取消
        this.onRecognizerResult = this.onRecognizerResult.bind(this);//结果
        this.onRecognizerError = this.onRecognizerError.bind(this);//error
        this.onRecognizerVolumeChanged = this.onRecognizerVolumeChanged.bind(this);
        this.onSyntheBtnPress = this.onSyntheBtnPress.bind(this);//按钮
        this.onIsSpeakingBtnPress = this.onIsSpeakingBtnPress.bind(this);//说话按钮
        this.onResumeBtnPress = this.onResumeBtnPress.bind(this);//resume

        this.scrollView = '';

        this.animated = Animated.timing(                  // 随时间变化而执行动画
            this.state.togAnim,            // 动画中的变量值
            {
                toValue: 1.2,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
            }
        )

        this.animatedstop = Animated.timing(                  // 随时间变化而执行动画
            this.state.togAnim,            // 动画中的变量值
            {
                toValue: 0,                   // 透明度最终变为1，即完全不透明
                duration: 1000,              // 让动画持续一段时间
            }
        )

    }

    componentDidMount(){
        const recognizerEventEmitter = new NativeEventEmitter(Recognizer);
        this.eventa = recognizerEventEmitter.addListener('onRecognizerResult', this.onRecognizerResult)
        this.eventb = recognizerEventEmitter.addListener('onRecognizerError', this.onRecognizerError)
        this.eventc = recognizerEventEmitter.addListener('onRecognizerVolumeChanged',this.onRecognizerVolumeChanged)
        const synthesizerEventEmitter = new NativeEventEmitter(Synthesizer);
        this.eventd = synthesizerEventEmitter.addListener('onSynthesizerSpeakCompletedEvent', this.onSynthesizerSpeakCompletedEvent);
        this.evente = synthesizerEventEmitter.addListener('onSynthesizerBufferCompletedEvent', this.onSynthesizerBufferCompletedEvent);
        Animated.spring(                  // 随时间变化而执行动画
            this.state.togAnims,            // 动画中的变量值
            {
                toValue: 0,                   // 透明度最终变为1，即完全不透明
                friction: 4,    //弹跳系数
                tension: 4,             // 让动画持续一段时间
            }
        ).start();
        let title = "HELLO.",text = "有什么可以帮到您？";
        this.fillText(title,"title");
        this.fillText(text,"text");



    }
    fillText(str,key){
        let arr = str.split(''),i = 0,strs='';
        let t = setInterval(()=>{
            if(i>arr.length-1){
                clearInterval(t);
            }else{
                strs += arr[i];
                if(key=="title"){
                    this.setState({
                        title:strs
                    });
                }else{
                    this.setState({
                        text:strs
                    });
                }
                i++;
            }
        },100)


    }



    componentWillUnmount() {
        this.eventa && this.eventa.remove();
        this.eventa = null;
        this.eventb && this.eventb.remove();
        this.eventb = null;
        this.eventc && this.eventc.remove();
        this.eventc = null;
        this.eventd && this.eventd.remove();
        this.eventd = null;
        this.evente && this.evente.remove();
        this.evente = null;
        this.onPauseBtnPress();
    }

    genData(text){
        let url = "http://47.98.230.51:4399/agent",
            data = {
                keyword:text
            }
        HttpUtils.post(url,data).then((res) => {
            if(res.code=="0"){
                let text;
                if(typeof res.data[0].intent.answer == "undefined"){
                    text = "妈卖批，老子不知道！"
                }else {
                    text = res.data[0].intent.answer.text
                }

                let newchart = this.state.chartData.map((item,i)=>{
                    if(i==this.state.chartData.length-1){
                        item.value = text
                    }
                    return item
                })
                this.setState({
                    chartData: newchart
                });
                setTimeout(()=>{
                    if(this.state.ifshow){
                        this.onSyntheBtnPress(text)
                    }else{

                    }
                },100)
            }else{
                alert("获取失败")
            }

        }).catch((error)=>{
        })
    }

    onRecordStart() {
        this.setState({ recordBtnText: "松开停止" });
        Recognizer.start();
        this.state.togAnim.setValue(0.1);
        this.animated.start();
    }

    onRecordEnd() {
        this.setState({ recordBtnText: "长按说话" });
        Recognizer.stop();
        this.animatedstop.start();
    }

    onRecordCancel(evt) {
        // setTimeout(() => {
        //   Recognizer.cancel();
        // }, 500);
    }

    onRecognizerResult(e) {
        if (!e.isLast) {
            return;
        }
        let newchart = this.state.chartData;
        newchart.push({
            question:e.result,
            value:"loading..."
        })

        this.setState({
            chartData: newchart,
            title:"AIUI."
        });
        this.scrollView.scrollToEnd();
        setTimeout(()=>{this.genData(e.result)},400)



    }

    onRecognizerError(result) {
        if (result.errorCode !== 0) {
            //alert(JSON.stringify(result));
        }
    }

    onRecognizerVolumeChanged() {

    }

    async onSyntheBtnPress(text) {
        Synthesizer.start(text);
    }

    async onPauseBtnPress() {
        Synthesizer.pause();
    }

    onResumeBtnPress() {
        Synthesizer.resume();
    }

    async onIsSpeakingBtnPress() {
        let isSpeaking = await Synthesizer.isSpeaking();
        //alert(isSpeaking);
    }

    onSynthesizerSpeakCompletedEvent(result) {
        //alert('onSynthesizerSpeakCompletedEvent\n\n' + JSON.stringify(result));
    }

    onSynthesizerBufferCompletedEvent(result) {
        // alert('onSynthesizerBufferCompletedEvent\n\n' + JSON.stringify(result));
    }


    ChangeText(text){
        if(text.indexOf("主题") != -1){
            if(text.indexOf("红色") != -1){
                this.setState({
                    theme:"danger"
                });
            }
            if(text.indexOf("黄色") != -1){
                this.setState({
                    theme:"war"
                });
            }
            if(text.indexOf("蓝色") !=-1 || text.indexOf("默认") != -1){
                this.setState({
                    theme:"default"
                });
            }
        }
        this.setState({
            text,
            title:"AIUI."
        });

    }

    goBack(){
        let text = this.state.text;
        if(text.indexOf("主题") != -1){
            if(text.indexOf("红色") != -1){
                this.props.onSwitchRem("danger");
            }
            if(text.indexOf("黄色") != -1){
                this.props.onSwitchRem("war");
            }
            if(text.indexOf("蓝色") !=-1 || text.indexOf("默认") != -1){
                this.props.onSwitchRem("default");
            }
        }
        setTimeout(()=>{
            this.props.navigation.goBack();
        },100)

    }
    ifSpeak(){
        if(this.state.ifshow){
            this.setState({
                ifshow:false
            });
            this.onPauseBtnPress()
        }else{
            this.setState({
                ifshow:true
            })
            this.onResumeBtnPress()

        }
    }


    render() {
        let {theme,togAnim,togAnims,title,ifshow,chartData}=this.state;


        return (
            <ImageBackground
                style={styles.containers}
                source={require('../../assets/images/bgdarks.png')}
                resizeMode='cover'>
                <View style={styles.container} onStartShouldSetResponder={() => true}>
                    <View style={{width:width-48,overflow:"hidden"}}>
                        <Text style={{color:"#fff",fontSize:60,whiteSpace:"nowrap"}}>
                            {title}
                        </Text>
                        {
                            chartData.length==0?
                            <Text style={{color:"#fff",fontSize:24}}>
                                {this.state.text}
                            </Text>:
                            <View style={{height:0,display:"none"}}></View>

                        }
                    </View>

                    <ScrollView
                        ref={scrollView => {
                if(scrollView !== null){
                  this.scrollView = scrollView;
                }}}
                    style={{width:width-48,flex:1}}>
                        {
                            chartData.map((item,i)=>{
                                return(
                                    <View key={i} style={{marginTop:12}}>
                                        <Text style={{color:"#fff",fontSize:24,marginBottom:8,textAlign:"right"}}>{item.question}</Text>
                                        <Text style={{color:"#fff",fontSize:18,textAlign:"left"}}>{item.value}</Text>
                                    </View>
                                )
                            })
                        }
                        <View style={{height:70,width:width-48}}></View>
                    </ScrollView>





                    <Animated.View style={[styles.row,{marginBottom:togAnims}]}>
                        <TouchableOpacity style={[styles.containerStyle,{width:44,height:44}]} onPress={()=>this.ifSpeak()}>
                            <Image style={{width:44,height:44}} source={ifshow?require('../../assets/images/voiceicon.png'):require('../../assets/images/texticon.png')}>
                            </Image>
                        </TouchableOpacity>
                        <Button
                            containerStyle={[styles.containerStyle,{backgroundColor:"transparent",width:88,height:88,position:"relative",overflow:"visible"}]}
                            onPress={this.onRecordEnd}
                            onPressIn={this.onRecordStart}
                            activeOpacity={0.8}
                            onResponderTerminationRequest={() => true}
                            onResponderTerminate={this.onRecordCancel}
                        >
                            <Image style={{
                        position:"absolute",
                        left:0,
                        right:0,
                        top:0,
                        bottom:0,
                        margin:"auto",
                        zIndex:1000,
                        width:88,
                        height:88}}
                                   source={
                        theme=="danger"?require('../../assets/images/bgvoicedan.png'):theme=="war"?require("../../assets/images/bgvoicewar.png"):require('../../assets/images/bgvoice.png')}>
                            </Image>
                            <Animated.View style={{
                        position:"absolute",
                        left:0,
                        right:0,
                        top:0,
                        bottom:0,
                        margin:"auto",
                        zIndex:0,
                        width:88,
                        height:88,
                        borderRadius:160,
                        backgroundColor:"rgba(255,255,255,0.5)",
                        transform:[{scale:togAnim}]}}>

                            </Animated.View>

                        </Button>

                        <TouchableOpacity style={[styles.containerStyle,{width:44,height:44}]} onPress={()=>this.goBack()}>
                            <Image style={{width:44,height:44}} source={require('../../assets/images/backicon.png')}>
                            </Image>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ImageBackground>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        appTheme: state.appTheme,
    }
}
const mapDispatchToProps = ( dispatch ) => {
    return {
        onSwitchRem: (key) => {
            dispatch({type:'CHANGE_THEME',appTheme:key})
        }
    }
}

AiSearch = connect(mapStateToProps,mapDispatchToProps)(AiSearch);

export default AiSearch