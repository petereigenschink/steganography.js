describe('steganography.js', function(){

  describe('Encode/Decode consistency', function(){
    function encodeDecode(cb, config) {
      var img = document.createElement('img');
      img.onload = function() {
        var msg = readJSON('json/message.json');
        var dataURL = steg.encode(msg, img, config);
        var readImg = document.createElement('img');
        readImg.onload = function() {
          var readMsg = steg.decode(readImg, config);
          cb(msg, readMsg);
        };
        readImg.src=dataURL;
      };
      img.src = 'base/img/tshirts-20.jpg';
    }

    it('is given using default config', function (done) {
      encodeDecode(function(msg, readMsg) {
        expect(readMsg).toEqual(msg);
        done();
      });
    });
  });

  describe('Encode', function(){
    it('is defined', function () {
      expect(steg.encode).not.toBeUndefined();
    });
  });

  describe('Decode', function(){
    it('is defined', function () {
      expect(steg.decode).not.toBeUndefined();
    });
  });

  describe('Capacity', function(){
    it('is defined', function () {
      expect(steg.getHidingCapacity).not.toBeUndefined();
    });
  });

  describe('Config', function(){
    it('is defined', function () {
      expect(steg.config).not.toBeUndefined();
    });
  });

});