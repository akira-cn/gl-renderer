describe('helpers', function() {
  var assert = chai.assert
  describe('pointsToBuffers', function() {
    it('should be ok', function() {
      let foo = 'bar'
      assert.typeOf(foo, 'string')
      assert.equal(foo, 'bar')
      assert.lengthOf(foo, 3)
    })
    it('should not ok', function() {
      let foo = 'bar'
      assert.lengthOf(foo, 4)
    })
  })
})
