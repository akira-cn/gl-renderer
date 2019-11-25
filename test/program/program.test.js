import {assert} from 'chai';
import Renderer from '../../src/renderer';

import fragShader from './default_frag.glsl';
import vertShader from './default_vert.glsl';
import textureFragShader from './texture_frag.glsl';
import textureVertShader from './texture_vert.glsl';

describe('Program', () => {
  let canvas;
  let renderer;
  beforeEach(() => {
    canvas = document.createElement('canvas');
    renderer = new Renderer(canvas);
  });
  /**
   * createProgram
   * - fragmentShader and vertexShader
   * - fragmentShader enable texture and vertexShader
   * - null fragmentShader and null vertexShader
   */
  describe('createProgram', () => {
    it('default fragment shader and default vertex shader', () => {
      const program = renderer.createProgram(fragShader, vertShader);
      assert.instanceOf(program, WebGLProgram);
      assert.hasAllKeys(program.shaderText, ['vertexShader', 'fragmentShader']);
      assert.hasAllKeys(program._buffers, ['a_customMartix3', 'a_customVec3', 'verticesBuffer', 'cellsBuffer']);
      assert.hasAllKeys(program._attribute, ['a_customMartix3', 'a_customVec3']);
      assert.hasAllKeys(program.uniforms, ['u_customUniform']);
    });

    it('fragment shader with texture and vertex shader', () => {
      const program = renderer.createProgram(textureFragShader, textureVertShader);
      assert.instanceOf(program, WebGLProgram);
      assert.isTrue(program._enableTextures);
      assert.hasAllKeys(program.shaderText, ['vertexShader', 'fragmentShader']);
      assert.hasAllKeys(program._buffers, ['verticesBuffer', 'cellsBuffer', 'texCoordBuffer']);
      assert.isEmpty(program._attribute);
      assert.hasAllKeys(program.uniforms, ['u_texture']);
    });

    it('null fragment shader and null vertex shader', () => {
      const program = renderer.createProgram(null, null);
      assert.instanceOf(program, WebGLProgram);
      assert.isEmpty(program.uniforms);
      assert.hasAllKeys(program.shaderText, ['vertexShader', 'fragmentShader']);
      assert.hasAllKeys(program._buffers, ['verticesBuffer', 'cellsBuffer']);
    });
  });

  describe('useProgram', () => {

  });

  describe('deleteProgram', () => {
    it('it will delete program after use another program', () => {
      const program = renderer.createProgram(null, null);
      assert.instanceOf(program, WebGLProgram);
      renderer.useProgram(program);
      assert.deepStrictEqual(program, renderer.program);

      const program2 = renderer.createProgram(textureFragShader, textureVertShader);
      assert.instanceOf(program2, WebGLProgram);
      renderer.useProgram(program2);
      assert.deepStrictEqual(program2, renderer.program);
      renderer.deleteProgram(program2);
      assert.isEmpty(program2._buffers);
    });

    it('it will delete unused program', () => {
      const program = renderer.createProgram(null, null);
      assert.instanceOf(program, WebGLProgram);
      assert.equal(renderer.program, null);
      assert.hasAllKeys(program._buffers, ['verticesBuffer', 'cellsBuffer']);
      renderer.deleteProgram(program);
      assert.isEmpty(program._buffers);
    });
  });

  describe('getProgram', () => {
    it('it will return a program', () => {
      const program = renderer.createProgram(null, null);
      renderer.useProgram(program);
      assert.deepStrictEqual(program, renderer.program);
    });

    it('it will return null', () => {
      assert.equal(renderer.program, null);
    });
  });
});