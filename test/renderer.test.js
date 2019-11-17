import Renderer from '../src/renderer'
import { expect } from 'chai'

describe('Renderer', function() {
  describe('new renderer', function() {
    it('should have webgl context', function() {
      const canvas = document.createElement('canvas')
      document.body.append(canvas)
      let renderer = new Renderer(canvas)
      expect(typeof renderer.gl === 'object')
    })
  })
})
