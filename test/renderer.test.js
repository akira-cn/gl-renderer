import {assert} from 'chai';
import Renderer from '../src/renderer';

describe('Renderer', () => {
  describe('new renderer', () => {
    it('should be webgl context', () => {
      const canvas = document.createElement('canvas');
      document.body.append(canvas);
      const renderer = new Renderer(canvas);
      assert.instanceOf(renderer.gl, WebGLRenderingContext);
    });

    it('should be webgl2 context', () => {
      const canvas = document.createElement('canvas');
      document.body.append(canvas);
      const renderer = new Renderer(canvas, {webgl2: true});
      assert.isTrue(renderer.options.webgl2);
      assert.isTrue(renderer.isWebGL2);
      assert.instanceOf(renderer.gl, WebGL2RenderingContext);
    });
  });
});
