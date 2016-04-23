describe('steganography.js', function(){
  var resources = {
    json: {
      utf8: 'json/utf8.json'
    },
    img: {
      cover: 'base/img/cover.jpg'
    }
  }


  describe('Encode/Decode consistency', function(){
    function encodeDecode(cb, config) {
      var img = new Image();
      img.onload = function() {
        var msg = readJSON(resources.json.utf8);
        var dataURL = steg.encode(msg, img, config);
        var readImg = new Image();
        readImg.onload = function() {
          var readMsg = steg.decode(readImg, config);
          cb(msg, readMsg);
        };
        readImg.src=dataURL;
      };
      img.src = resources.img.cover;
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

    it('works with URL', function(done) {
      var img = new Image();
      img.onload = function() {
        var msg = readJSON(resources.json.utf8);
        var dataURLWithImgCover = steg.encode(msg, img);
        var dataURLWithURLCover = steg.encode(msg, resources.img.cover);
        expect(dataURLWithURLCover).toEqual(dataURLWithImgCover);
        done();
      };
      img.src = resources.img.cover;
    });

    it('works with base 64 data URL', function(done) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var msg = readJSON(resources.json.utf8);
        var dataURLWithImgCover = steg.encode(msg, img);
        var dataURLWithDataURLCover = steg.encode(msg, canvas.toDataURL());
        expect(dataURLWithDataURLCover).toEqual(dataURLWithImgCover);
        done();
      };
      img.src = resources.img.cover;
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