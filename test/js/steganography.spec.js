describe('steganography.js', function(){

  var _mock;

  /*
   * HELPER FUNCTIONS
   */
  function doSomething() {
    // do something
  }

  /*
   * TESTS
   */
  describe('Basic tests', function(){

    beforeEach(function () {
      JsMock.watch(function () {
        _mock = JsMock.mock("aMock");
      });
    });
    afterEach(function () {
      JsMock.assertWatched();
    });

    /*
     * TESTS
     */
    it("Message equality", function () {
      //steganography.js.myFunc();
    });
  });
});