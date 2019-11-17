import { assert } from 'chai'
import { pointsToBuffer, loadImage } from '../src/helpers.js'

/**
 * 等价类划分
 * - 有效等价类：
 *   1. points array, Type TypedArray, buffer not TypedArray
 *   2. points array，Type Float32Array, buffer undefined
 *   3. points array，Type Float32Array, buffer length 0
 *   4. points array，Type Float32Array, buffer length enough
 *   6. points array[array]，Type Float32Array, buffer undefined
 *   7. points array[array]，Type Float32Array, buffer length 0
 *   8. points array[array]，Type Float32Array, buffer length enough
 * - 无效等价类：
 *   1. points not array, Type undefined, buffer undefined
 *   2. points array, Type not TypedArray, buffer null
 */
describe('helpers', function() {
  describe('one dimensional pointsToBuffer', function() {
    it('buffer type not eq with Type', function() {
      let points = [1, 2, 3]
      function fn() {
        return pointsToBuffer(points, Float32Array, new Int8Array())
      }
      assert.throws(fn, TypeError, 'Wrong buffer type.')
    })

    it('default Type and null buffer', function() {
      let points = [1, 2, 3]
      let result = pointsToBuffer(points)
      assert.instanceOf(result, Float32Array)
      assert.deepEqual(result, new Float32Array(points))
    })

    it('default Type and 0 length buffer', function() {
      let points = [1, 2, 3]
      let buffer = new Float32Array()
      function fn() {
        return pointsToBuffer(points, Float32Array, buffer)
      }
      assert.throws(fn, RangeError, 'Source is too large')
    })

    it('default Type and enought length buffer', function() {
      let points = [1, 2, 3]
      let buffer = new Float32Array(3)
      let result = pointsToBuffer(points, Float32Array, buffer)
      assert.deepEqual(result, buffer)
    })

    it('points type eq Type', function() {
      let points = new Float32Array([1, 2, 3])
      let result = pointsToBuffer(points)
      assert.deepStrictEqual(points, result)
    })
  })

  describe('two demensional pointsToBuffer', function() {
    it('default Type and null buffer', function() {
      let points = [
        [1, 2],
        [3, 4]
      ]
      let result = pointsToBuffer(points)
      assert.instanceOf(result, Float32Array)
      assert.deepEqual(result, new Float32Array([1, 2, 3, 4]))
    })

    it('default Type and 0 length buffer', function() {
      let points = [
        [1, 2],
        [3, 4]
      ]
      let buffer = new Float32Array()
      function fn() {
        return pointsToBuffer(points, Float32Array, buffer)
      }
      assert.throws(fn, RangeError, 'Source is too large')
    })

    it('default Type and enought length buffer', function() {
      let points = [
        [1, 2],
        [3, 4]
      ]
      let buffer = new Float32Array(4)
      let result = pointsToBuffer(points, Float32Array, buffer)
      assert.instanceOf(result, Float32Array)
      assert.deepEqual(result, new Float32Array([1, 2, 3, 4]))
    })
  })

  describe('other test', function() {
    it('points not array', function() {
      let points = undefined
      function fn() {
        return pointsToBuffer(points)
      }
      assert.throws(fn, TypeError, 'points type must be array')
    })

    it('Type not TypedArray constructor', function() {
      let points = [1, 2, 3]
      function fn() {
        return pointsToBuffer(points, String)
      }
      assert.throws(fn, TypeError, 'Type must be one of the TypedArray')
    })
  })
})
