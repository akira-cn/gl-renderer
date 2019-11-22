import {expect} from 'chai';
import Renderer from '../src/renderer';

describe('Renderer', () => {
  describe('new renderer', () => {
    it('should have webgl context', () => {
      const canvas = document.createElement('canvas');
      document.body.append(canvas);
      const renderer = new Renderer(canvas);
      expect(typeof renderer.gl === 'object');
    });
  });
});
