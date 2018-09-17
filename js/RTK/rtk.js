'use strict'
import {Color} from './Color'
import {Display} from './Display'
import {RTK_ASCII} from './ASCII'
import {Map} from './Map'
import {Rect} from './Rect'
/**
 * @namespace Top-level RTK namespace
 */
export const RTK = {
   _context: {},
   _data: {},
   _dirty: false, /* false = nothing, true = all, object = dirty cells */
   _options: {},
   /* Directional constants. Ordering is important! */
   DIRS: {
     "4": [
       [ 0, -1],
       [ 1,  0],
       [ 0,  1],
       [-1,  0]
     ],
     "8": [
       [ 0, -1],
       [ 1, -1],
       [ 1,  0],
       [ 1,  1],
       [ 0,  1],
       [-1,  1],
       [-1,  0],
       [-1, -1]
     ],
     "6": [
       [-1, -1],
       [ 1, -1],
       [ 2,  0],
       [ 1,  1],
       [-1,  1],
       [-2,  0]
     ]
   },
   Color,
   Display,
   Map,
   RTK_ASCII,
   Rect,
}
 //display is the screenview coordinates of the, "camera" on the map
