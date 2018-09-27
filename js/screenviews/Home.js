'use strict'
import React, { Component } from 'react'
import { TouchableHighlight, TouchableOpacity, TextInput, Text, View } from 'react-native'
import { levelScreen } from '../navigations'

class HomeScreen extends Component {
  constructor(props) {
    super()
  }
  _startGame = () => {
    console.log(this.props.actions)
    levelScreen()
  }
  render() {
    return (
      <View style={{ padding: 20, flexDirection: 'column' }}>
        <TouchableOpacity buttonColor={'black'} textColor="white" onPress={this._startGame}>
        <Text>START GAME</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export { HomeScreen }
