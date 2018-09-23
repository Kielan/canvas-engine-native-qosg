import { Navigation } from 'react-native-navigation'
import * as types from './constants/actionTypes'

export const levelScreen = () => Navigation.setRoot({
	root: {
		stack: {
			children: [
				{ component: {
					name: types.LEVEL_SCREEN,
				} }
			]
		}
	}
})
