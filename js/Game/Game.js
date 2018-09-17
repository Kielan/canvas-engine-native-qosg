import React, {Component} from 'react'
import {Animated, findNodeHandle, TouchableWithoutFeedback, View, StyleSheet, Platform, NativeModules} from 'react-native'
import {GCanvasView} from 'react-native-gcanvas'
import { TweenMax } from 'gsap'
import {enable, Image as GImage, ReactNativeBridge} from 'gcanvas.js/src/index.js'
import GestureRecognizer, {swipeDirections} from '../components/GestureView'
import { RTK } from '../RTK/rtk'
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
    this.init()
  }
  init() {
    console.log('init step 1')
    this.display = new RTK.Display(displayLevelOptions, this.refs.canvas_holder_ref)
    console.log('init step 2')
    var container = this.display.getContainer()
    var foreground, background, colors;
    for (var i = 0; i < 15; i++) {
      // Calculate the foreground color, getting progressively darker
      // and the background color, getting progressively lighter.
      foreground = new RTK.Color.toRGB([255 - (i*20),
                                    255 - (i*20),
                                    255 - (i*20)]);
      background = new RTK.Color.toRGB([i*20, i*20, i*20]);
      // Create the color format specifier.
      colors = "%c{" + foreground + "}%b{" + background + "}";
      // Draw the text two columns in and at the row specified
      // by i
      this.display.drawText(2, i, colors + "Hello, world!");
    }
  }
  _generateMap() {
    var digger = new RTK.Map.Arena()

//    var digCallback = function(x, y, value) {
//        if (value) { return; } /* do not store walls */

//        var key = x+","+y
//        this.map[key] = "."
//    }
//    digger.create(digCallback.bind(this))
  }
  moveWithDirection = direction => {
    if (this.gameState != State.Game.playing) {
      return;
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
  //  console.log('game rendergame = () => RTK.Map', RTK.Map)
    var generatedMap = new RTK.Map.Arena(3, 3)
    return (
      <AnimatedGestureRecognizer
        onResponderGrant={_ => {
          this.beginMoveWithDirection()
        }}
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        config={config}
        style={{
          flex: 1,
        }}
      >
      <TouchableWithoutFeedback
        onPressIn={_ => {
          this.beginMoveWithDirection()
        }}
        style={{ flex: 1 }}
        onPress={_ => {
          this.onSwipe(swipeDirections.SWIPE_UP, {})
        }}>
        {<View
          style={{ width: 100, height: 100 }}
        >
        <GCanvasView ref='canvas_holder_ref' style={styles.gcanvas}>
        </GCanvasView>
        </View>}
      </TouchableWithoutFeedback>
    </AnimatedGestureRecognizer>
    )
  }
  render() {
    let Game = {}
    Game.map = {}
    Game._generateMap = function() {
        var arenaMap = new Arena()
        var mapCallback = function(x, y, value) {
            if (value) { return } /* do not store walls */
            var key = x+","+y
            this.map[key] = "."
        }
        arenaMap.create(mapCallback.bind(this));
    }
    Game._drawWholeMap = function() {
      for (var key in this.map) {
          var parts = key.split(",")
          var x = parseInt(parts[0])
          var y = parseInt(parts[1])
          this.display.draw(x, y, this.map[key])
      }
    }
    return (
      <View style={[{ flex: 1, backgroundColor: '#6dceea' }, this.props.style]}>
        {this.renderGame()}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  gcanvas: {
    top: 20,
    width: 414,
    height :700,
//    backgroundColor: 'red'
//    backgroundColor: '#FF000030'
  },
})
