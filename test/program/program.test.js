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

  describe('createProgram', () => {
    it('default fragment shader and default vertex shader', () => {
      const program = renderer.createProgram(fragShader, vertShader);
      assert.instanceOf(program, WebGLProgram);
      assert.hasAllKeys(program.shaderText, ['vertexShader', 'fragmentShader']);
      assert.hasAllKeys(program.uniforms, ['u_customUniform']);
    });

    it('fragment shader with texture and vertex shader', () => {
      const program = renderer.createProgram(textureFragShader, textureVertShader);
      assert.instanceOf(program, WebGLProgram);
      assert.isTrue(program._enableTextures);
      assert.hasAllKeys(program.shaderText, ['vertexShader', 'fragmentShader']);
      assert.hasAllKeys(program.uniforms, ['u_texture']);
    });

    it('null fragment shader and null vertex shader', () => {
      const program = renderer.createProgram(null, null);
      assert.instanceOf(program, WebGLProgram);
      assert.hasAllKeys(program.shaderText, ['vertexShader', 'fragmentShader']);
      assert.isEmpty(program.uniforms);
    });
  });

  describe('useProgram', () => {
    it('use Program with attr options', () => {
      const program = renderer.createProgram(textureFragShader, textureVertShader);
      assert.instanceOf(program, WebGLProgram);
      renderer.useProgram(program, {
        a_customVector4: {
          key: 'acv4',
          type: 'FLOAT',
          normalize: true,
        },
      });
      assert.isTrue(renderer.enableTextures);
      assert.deepStrictEqual(renderer.program, program);
    });
  });

  describe('deleteProgram', () => {
    it('it will delete program after use another program', () => {
      const program = renderer.createProgram(null, null);
      assert.instanceOf(program, WebGLProgram);
      renderer.useProgram(program);
      assert.deepStrictEqual(program, renderer.program);
      renderer.deleteProgram(program);
      assert.equal(renderer.program, null);
      assert.equal(renderer.programs.indexOf(program), -1);
    });

    it('it will delete unused program', () => {
      const program = renderer.createProgram(null, null);
      assert.instanceOf(program, WebGLProgram);
      assert.equal(renderer.program, null);
      renderer.deleteProgram(program);
      assert.equal(renderer.programs.indexOf(program), -1);
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