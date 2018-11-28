/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { findNodeHandle, NativeModules, Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import { Display } from 'rot-js';
import {
  GCanvasView,
} from 'react-native-gcanvas';
import { enable, ReactNativeBridge, Image as GImage } from 'gcanvas.js/src/index.js';
import { QOSG } from './js/QOSG';

ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
ReactNativeBridge.Platform = Platform;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  onPressHandle = () => {
    console.log(">>>>>>>>onPressHandle...start")

    var ref = this.refs.canvas_holder;

    var canvas_tag = findNodeHandle(ref);
    // var canvas_tag = "2";
    var el = { ref:""+canvas_tag, style:{width:414, height:376}};

    ref = enable(el, {bridge: ReactNativeBridge});
    var ctx = ref.getContext('2d');

    QOSG.init(ctx)
    QOSG.switchScreen(QOSG.Screen.PlayScreen);

    //var ctx = ref.getContext('2d');
    //rect
    //ctx.fillStyle = 'green';
    //ctx.fillRect(0, 0, 100, 100);

    //rect
    //ctx.fillStyle = 'black';
    //ctx.fillRect(100, 100, 100, 100);
    //ctx.fillRect(25, 205, 414-50, 5);

    //circle
    //ctx.arc(200, 315, 100, 0, Math.PI * 2, true);
    //ctx.fill();

//    var image = new GImage();
//    image.onload = function(){
//      ctx.drawImage(image, 150, 0);
//      ctx.drawImage(image, 150, 450);
//    }
//    image.src = '//gw.alicdn.com/tfs/TB1KwRTlh6I8KJjy0FgXXXXzVXa-225-75.png';

    console.log(">>>>>>>>onPressHandle...end")
  };
  render() {
    //let display = new Display({width:40, height:9, layout:"term"});
    //display.draw(5,  4, "@");
    //display.draw(15, 4, "%", "#0f0");          // foreground color
    //display.draw(25, 4, "#", "#f00", "#009");
    //console.log('just log the display boi', display)
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
          <Text style={styles.instructions}>To get started, edit App.js</Text>
        </View>
        <View style={{flex: 3}}>
        <TouchableHighlight onPress={this.onPressHandle} style={{flex: 1, width: 414, height :700}}>
          <GCanvasView ref='canvas_holder' style={styles.gcanvas}>
          </GCanvasView>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
  gcanvas: {
    flex: 1,
//    backgroundColor: '#FF000030',
    width: 414,
    height :700,
  }
});
