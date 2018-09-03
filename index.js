/** @format */
import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import App from './App'
import { registerScreens } from './js/screens'
import { configureStore } from './js/configureStore'

import * as types from './js/constants/actionTypes'

// Register screens
registerScreens(configureStore, Provider)

// Start application
Navigation.events().registerAppLaunchedListener(() => {

  Navigation.setRoot({
    root: {
      component: {
        name: types.HOME_SCREEN
      }
    },
  })
})
