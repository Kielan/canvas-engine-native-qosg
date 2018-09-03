import React, {Component} from 'react'
import {Animated, findNodeHandle, TouchableWithoutFeedback, View, StyleSheet, Platform, NativeModules} from 'react-native'
import {GCanvasView} from 'react-native-gcanvas'
import {enable, GImage, ReactNativeBridge} from 'gcanvas.js/src/index.js'
import GestureRecognizer, {swipeDirections} from '../components/GestureView'
import {Arena} from '../RTK/rtk'
const AnimatedGestureRecognizer = Animated.createAnimatedComponent(GestureRecognizer)


export class Game extends Component {
  constructor(props) {
    super(props)
    display = null
  }
  componentDidMount() {
  //  ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
    ReactNativeBridge.Platform = Platform;
    var ref = this.refs.canvas_holder
    var canvas_tag = findNodeHandle(ref)
    var el = { ref:""+canvas_tag, style:{width:414, height:376}}
    ref = enable(el, {bridge: ReactNativeBridge})
    var ctx = ref.getContext('2d')
    //rect
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, 100, 100)
    //rect
    ctx.fillStyle = 'black'
    ctx.fillRect(100, 100, 100, 100)
    ctx.fillRect(25, 205, 414-50, 5)

    //circle
    ctx.arc(200, 315, 100, 0, Math.PI * 2, true)
    ctx.fill()

    var image = new GImage()
    image.onload = function(){
      ctx.drawImage(image, 150, 0)
      ctx.drawImage(image, 150, 450)
    }

  }
  init() {
    this.display = new ROT.Display()
    document.body.appendChild(this.display.getContainer())
  }
  _generateMap() {
    var digger = new ROT.Map.Digger()

    var digCallback = function(x, y, value) {
        if (value) { return; } /* do not store walls */

        var key = x+","+y
        this.map[key] = "."
    }
    digger.create(digCallback.bind(this))
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
  renderGame = () => {
//    if (!this.state.ready) { return }
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    }
    var generatedMap = new Arena(3, 3)
    console.log('game rendergame = () =>', generatedMap)
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
        <GCanvasView ref='canvas_holder' style={styles.gcanvas}>
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
    backgroundColor: '#FF000030'
  },
})
