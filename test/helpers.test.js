import { assert } from 'chai'
import DEFAULT_VERT from '../src/default_vert.glsl'
import DEFAULT_FRAG from '../src/default_frag.glsl'
import {
  pointsToBuffer,
  loadImage,
  setupWebGL,
  createProgram
} from '../src/helpers.js'

describe('helpers', function() {
  /**
   * pointsToBuffer
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

  describe('invalid params pointsToBuffer', function() {
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

  /**
   * loadImage
   * - 有效等价类
   *  1. src image1, useImageBitmap = true, have Image Class, return bitmap1
   *  2. src image2, useImageBitmap = false, have Image Class, return image2
   *  3. src image3, useImageBitmap = true, no Image Class, return bitmap3
   *  4. src image3, useImageBitmap = false, no Image Class, return bitmap3
   * - 无效等价类
   *  1. src not image, useImageBitmap = true
   *  2. src image, useImageBitmap not boolean
   */
  const image1Src = 'https://p0.ssl.qhimg.com/t01c0a41994a9aabd82.png'
  const image2Src = 'https://p5.ssl.qhimg.com/t01f47a319aebf27174.png'
  const image3Src = 'https://p3.ssl.qhimg.com/t010ded517024020e10.png'
  const image4Src = 'https://p0.ssl.qhimg.com/t011ee12f7af0ddeedc.png'
  const image5Src = 'https://p0.ssl.qhimg.com/t01c9a9db93c80f018c.png'
  describe('Image Class', function() {
    it('image1 useImageBitmap', async function() {
      const image = await loadImage(image1Src)
      assert.instanceOf(image, ImageBitmap)
      const cachedImage = await loadImage(image1Src)
      assert.strictEqual(image, cachedImage)
    })

    it('image2 do not useImageBitmap', async function() {
      const image = await loadImage(image2Src, false)
      assert.instanceOf(image, Image)
      const imageCached = await loadImage(image2Src, false)
      assert.strictEqual(image, imageCached)
    })
  })

  describe('fetch API', function() {
    let Image = window.Image
    before(function() {
      window.Image = null
    })
    it('image3 useImageBitmap', async function() {
      const image = await loadImage(image3Src)
      assert.instanceOf(image, ImageBitmap)
      const imageCached = await loadImage(image3Src)
      assert.deepEqual(image, imageCached)
    })

    it('image4 do not use imageBitmap', async function() {
      const image = await loadImage(image4Src, false)
      assert.instanceOf(image, ImageBitmap)
      assert.notInstanceOf(image, Image)
    })
    after(function() {
      window.Image = Image
    })
  })

  describe('invalid params loadImage', function() {
    it('not image url', function() {
      function fn() {
        return loadImage('xxxx')
      }
      assert.throws(fn, TypeError, 'src must be an image url')
    })

    it('useImageBitmap with truely value', async function() {
      const image = await loadImage(image5Src, 'true')
      assert.instanceOf(image, ImageBitmap)
    })
  })

  /**
   * setupWebGL
   * - 有效等价类
   *  1. canvas have 3d context, opt_attribs undefined
   *  2. canvas do not have 3d context, opt_attribs undefined
   * - 无效等价类
   *  1. any other value
   */
  describe('setupWebGL', function() {
    it('canvas have 3d context', function() {
      const canvas = document.createElement('canvas')
      const context = setupWebGL(canvas)
      assert.instanceOf(context, WebGLRenderingContext)
    })

    it('canvas do not have 3d context', function() {
      const canvas = {}
      const contexts = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl']
      canvas.getContext = function(context) {
        if (contexts.includes(context)) {
          return null
        }
      }
      function fn() {
        return setupWebGL(canvas)
      }
      assert.throws(fn, Error, "Sorry, your browser doesn't support WebGL.")
    })

    it('not canvas instance', function() {
      function fn() {
        return setupWebGL()
      }
      assert.throws(fn, Error, "Sorry, your browser doesn't support WebGL.")
    })
  })

  /**
   * createProgram
   * - 有效等价类
   *  1. gl context, vertex, fragment
   * - 无效等价类
   *  1. not gl context, vertex, fragment
   *  2. gl context, vertex error, fragment
   *  3. gl context, vertex, fragment error
   */
  describe('createProgram', function() {
    it('gl context with vertex and fragment shader', function() {
      const canvas = document.createElement('canvas')
      const gl = setupWebGL(canvas)
      const program = createProgram(gl, DEFAULT_VERT, DEFAULT_FRAG)
      assert.instanceOf(program, WebGLProgram)
    })

    it('not gl context', function() {
      function fn() {
        return createProgram()
      }
      assert.throws(
        fn,
        TypeError,
        "Cannot read property 'createShader' of undefined"
      )
    })

    it('gl context with invalid vertex', function() {
      const canvas = document.createElement('canvas')
      const gl = setupWebGL(canvas)
      const result = createProgram(gl, '', DEFAULT_FRAG)
      assert.equal(result, -1)
    })

    it('gl context with invalid fragment', function() {
      const canvas = document.createElement('canvas')
      const gl = setupWebGL(canvas)
      const result = createProgram(gl, DEFAULT_VERT, '')
      assert.equal(result, -1)
    })
  })
})
