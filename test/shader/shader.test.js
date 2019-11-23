import {assert} from 'chai';
import Renderer from '../../src/renderer';

// libs
import graphics from '../lib/graph.glsl';

import vertShader from './default_vert.glsl';
import fragShader from './default_frag.glsl';
import fragShaderWithLink from './frag_with_link.glsl';
import fragShaderWithLib from './frag_with_lib.glsl';

describe('Shader', () => {
  /**
   * load
   * - 有效等价类
   *  1. valid frag shader url
   *  2. valid frag shader url and valid vert shader url
   * - 无效等价类
   *  1. invalid frag shader url
   */
  describe('load shader', () => {
    // let canvas;
    // let renderer;
    // before(() => {
    //   canvas = document.createElement('canvas');
    //   Renderer.addLibs({graphics});
    //   renderer = new Renderer(canvas);
    // });
  });

  /**
   * async compile
   * - 有效等价类
   *  1. frag source code and vert source code
   *  2. frag source code
   *  3. null frag source code
   * - 无效等价类
   *  1. invalid shader source code
   *  2. frag source code with link lib and vert source code
   */
  describe('async compile', () => {
    let canvas;
    let renderer;
    before(() => {
      canvas = document.createElement('canvas');
      Renderer.addLibs({graphics});
      renderer = new Renderer(canvas);
    });

    it('frag source code and vert source code', async () => {
      const program = await renderer.compile(fragShader, vertShader);
      assert.instanceOf(program, WebGLProgram);
    });

    it('frag source code and null vert vert source code', async () => {
      const program = await renderer.compile(fragShaderWithLib);
      assert.instanceOf(program, WebGLProgram);
    });

    it('null frag source code and null vertex source code', async () => {
      const program = await renderer.compile();
      assert.instanceOf(program, WebGLProgram);
    });

    // it('invalid shader source code', async () => {
    //   const program = await renderer.compile('invalid srouce code');
    //   assert.equal(program, -1);
    // });

    it('frag source code with link lib and null vertex source code', async () => {
      const program = await renderer.compile(fragShaderWithLink);
      assert.instanceOf(program, WebGLProgram);
    });
  });

  /**
   * sync compile
   * - 有效等价类
   *  1. frag source code and vert source code
   *  2. frag source code
   *  3. null frag source code
   *  4. frag source code with link lib
   * - 无效等价类
   *  1. invalid shader source code
   */
  describe('sync compile', () => {
    let canvas;
    let renderer;
    before(() => {
      canvas = document.createElement('canvas');
      Renderer.addLibs({graphics});
      renderer = new Renderer(canvas);
    });

    it('frag source code and vert source code', () => {
      const program = renderer.compileSync(fragShader, vertShader);
      assert.instanceOf(program, WebGLProgram);
    });

    it('frag source code and null vert vert source code', () => {
      const program = renderer.compileSync(fragShaderWithLib);
      assert.instanceOf(program, WebGLProgram);
    });

    it('null frag source code and null vertex source code', () => {
      const program = renderer.compileSync();
      assert.instanceOf(program, WebGLProgram);
    });

    it('frag source code with link lib and null vertex source code', () => {
      function fn() {
        return renderer.compileSync(fragShaderWithLink);
      }
      assert.throws(fn, Error, 'Cannot load external links synchronously. Use compile instead of compileSync.');
    });

    // it('invalid shader source code', () => {
    //   const program = renderer.compileSync('invalid shader source code');
    //   assert.equal(program, -1);
    // });
  });
});