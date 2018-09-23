import React, {Component} from 'react'
import {Animated, findNodeHandle, TouchableWithoutFeedback, TouchableHighlight, View, StyleSheet, Platform, NativeModules} from 'react-native'
import {GCanvasView} from 'react-native-gcanvas'
import { TweenMax } from 'gsap'
import {enable, Image as GImage, ReactNativeBridge} from 'gcanvas.js/src/index.js'
import GestureRecognizer, {swipeDirections} from '../components/GestureView'
//import { RTK } from '../RTK/rtk'
import { qosgcontrol as RTK } from '../RTK/qosgcontrol'
console.log('Game.js import, ', RTK)

const AnimatedGestureRecognizer = Animated.createAnimatedComponent(GestureRecognizer)
import State from '../state'
var displayLevelOptions = {
  width: 120,
  height: 120,
  transpose: false,
  layout: "rect",
  fontSize: 15,
  spacing: 1,
  border: 0,
  forceSquareRatio: false,
  fontFamily: "monospace",
  fontStyle: "",
  fg: "#ccc",
  bg: "#000",
  tileWidth: 32,
  tileHeight: 32,
  tileMap: {},
  tileSet: null,
  tileColorize: false,
  termColor: "xterm"
}

ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule
ReactNativeBridge.Platform = Platform

export class Game extends Component {
  constructor(props) {
    super(props)
    display = null
  }
  componentDidMount() {
//    ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
//    ReactNativeBridge.Platform = Platform;
//    var ref = this.refs.canvas_holder
//    var canvas_tag = findNodeHandle(ref)
//    var el = { ref:""+canvas_tag, style:{width:414, height:376}}
//    ref = enable(el, {bridge: ReactNativeBridge})
//    var ctx = ref.getContext('2d')
    //rect
//    ctx.fillStyle = 'green'
//    ctx.fillRect(0, 0, 100, 100)
    //rect
//    ctx.fillStyle = 'black'
//    ctx.fillRect(100, 100, 100, 100)
//    ctx.fillRect(25, 205, 414-50, 5)

    //circle
//    ctx.arc(200, 315, 100, 0, Math.PI * 2, true)
//    ctx.fill()

//    var image = new GImage()
//    image.onload = function(){
//      ctx.drawImage(image, 150, 0)
//      ctx.drawImage(image, 150, 450)
//    }
//    this.init()
//    this._display = new RTK.Display({width: 80, height: 24}, this.refs.canvas_holder_ref)
  }
  onPressHandle = () => {
    var ref = this.refs.canvas_holder_ref
//    var canvas_tag = findNodeHandle(ref)
//    var el = { ref:""+canvas_tag, style:{width:414, height:376}}
//    ref = enable(el, {bridge: ReactNativeBridge})
  //  var ctx = ref.getContext('2d')
    //rect
//    ctx.fillStyle = 'green'
//    ctx.fillRect(0, 0, 100, 100)
  //  ctx.fill()
    this.display = new RTK.Display({options: {width: 300, height: 700}}, this.refs.canvas_holder_ref)
    this.map = new RTK.Map.Arena({width: 300, height: 700})
  //  this._map = new RTK.Map(map)
//    this.display.drawText(1,2, "Press [Enter] to start!")
    console.log('finish compute with dataset', this.display.getContainer())
  }
  moveWithDirection = direction => {
    if (this.gameState != State.Game.playing) {
      return
    }

    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections

    this._hero.ridingOn = null

    if (!this.initialPosition) {
      this.initialPosition = this._hero.position
      this.targetPosition = this.initialPosition
    }
  }
  beginMoveWithDirection = direction => {
    if (this.gameState != State.Game.playing) { return; }
    TweenMax.to(this._hero.scale, 0.2, {
      x: 1.2,
      y: 0.75,
      z: 1,
      // ease: Bounce.easeOut,
    })
  }
  onSwipe = (gestureName, gestureState) => this.moveWithDirection(gestureName)
  renderGame = () => {
//    if (!this.state.ready) { return }
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    }

    return (
      <TouchableHighlight style={{width: 300, height: 400, flex: 1}} onPress={this.onPressHandle}>
        <GCanvasView ref='canvas_holder_ref' style={{width: 300, height: 400}}>
        </GCanvasView>
      </TouchableHighlight>
    )
  //  console.log('game rendergame = () => RTK.Map', RTK.Map)
  //  var generatedMap = new RTK.Map.Arena(3, 3)
    //backgroundColor: 'yellow'
//    return (
//      <AnimatedGestureRecognizer
//        onResponderGrant={_ => {
//          this.beginMoveWithDirection()
//        }}
//        onSwipe={(direction, state) => this.onSwipe(direction, state)}
//        config={config}
      //   style={{
      //     flex: 1,
      //   }}
      // >
      // <TouchableWithoutFeedback
      //   onPressIn={_ => {
      //     this.beginMoveWithDirection()
      //   }}
    //     style={{ flex: 1 }}
    //     onPress={_ => {
    //       this.onSwipe(swipeDirections.SWIPE_UP, {})
    //     }}>
    //     {<View
    //       style={{ width: 200, height: 200 }}
    //     >
    //     <GCanvasView ref='canvas_holder_ref' style={styles.gcanvas}>
    //     </GCanvasView>
    //     </View>}
    //   </TouchableWithoutFeedback>
    // </AnimatedGestureRecognizer>
//    )
  }
  render() {
    let Game = {}
    Game.map = {}

//    Game._generateMap = function() {
//        var arenaMap = new Arena()
//        var mapCallback = function(x, y, value) {
//            if (value) { return } /* do not store walls */
//            var key = x+","+y
//            this.map[key] = "."
//        }
//        arenaMap.create(mapCallback.bind(this));
//    }
//    Game._drawWholeMap = function() {
//      for (var key in this.map) {
//          var parts = key.split(",")
//          var x = parseInt(parts[0])
//          var y = parseInt(parts[1])
//          this.display.draw(x, y, this.map[key])
//      }
//    }
    //backgroundColor: '#6dceea'
    return (
      <View style={[{ flex: 1 }]}>
        {this.renderGame()}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  gcanvas: {
    top: 10,
    width: 314,
    height: 250,
//    backgroundColor: 'red'
//    backgroundColor: '#FF000030'
  },
})
