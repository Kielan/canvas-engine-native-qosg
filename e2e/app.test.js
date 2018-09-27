'use strict'
import {RTK} from '../js/RTK/qosgcontrol'

describe('Describe the object state of the compiled glob', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it(':RTK: is an object', async () => {
    expect(RTK).not.toBe().toBeUndefined()
    expect(RTK).not.toBe().toBeFalsy()
    expect(RTK).not.toBe().toBeNull()
  })
  it(':RTK: is an object that has the Display property', async () => {
    expect(new RTK.Display()).toBeInstanceOf(RTK.Display)
  })

})
