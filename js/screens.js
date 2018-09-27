'use strict'
import { StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { HomeScreen } from './screenviews/Home'
import { Game } from './Game/Game'
//import { TopBar } from './screenviews/TopBar'
import * as types from './constants/actionTypes'

//store, Provider
export function registerScreens(store, Provider) {
	Navigation.registerComponent(types.HOME_SCREEN, () => HomeScreen, Provider, store)
	Navigation.registerComponent(types.LEVEL_SCREEN, () => Game, Provider, store)
}

export const startApp = () => {
	StatusBar.setBarStyle('dark-content', true)

  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'ROOT',
        children: [
          {
            component: {
              name: types.HOME_SCREEN,
              options: {
                bottomTab: {
                  fontSize: 12,
                  text: 'Sign In',
                }
              }
            },
          }
        ],
      },
    },
  })
}
