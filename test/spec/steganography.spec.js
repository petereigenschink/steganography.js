describe('steganography.js', function(){
  var resources = {
    json: {
      utf8: 'json/utf8.json'
    },
    img: {
      cover: 'base/img/cover.jpg'
    }
  }


  describe('Encode/Decode utf8 consistency', function(){
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

    it('is given for the message using default config', function (done) {
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

    it('conserves image quality', function (done) {
      var img = new Image();
      img.onload = function() {
        var [originalWidth, originalHeight] = [img.width, img.height];
        var msg = readJSON(resources.json.utf8);
        var dataURLWithImgCover = steg.encode(msg, img);

        var stegImg = new Image();
        stegImg.onload = function() {
          var [stegWidth, stegHeight] = [stegImg.width, stegImg.height];

          expect(originalWidth).toEqual(stegWidth);
          expect(originalHeight).toEqual(stegHeight);

          done();
        }
        stegImg.src = dataURLWithImgCover;
      };
      img.src = resources.img.cover;
    });

    it('conserves image quality with resized DOM element', function (done) {
      var img = new Image();
      img.style.width = '290px';
      img.style.height = 'auto';
      img.onload = function() {
        var [originalWidth, originalHeight] = [img.width, img.height];
        document.body.appendChild(img);
        var msg = readJSON(resources.json.utf8);
        var dataURLWithImgCover = steg.encode(msg, img);

        var stegImg = new Image();
        stegImg.onload = function() {
          var [stegWidth, stegHeight] = [stegImg.width, stegImg.height];

          expect(originalWidth).toEqual(stegWidth);
          expect(originalHeight).toEqual(stegHeight);

          done();
        }
        stegImg.src = dataURLWithImgCover;
      };
      img.src = resources.img.cover;
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

    xit('works with base 64 data URL', function(done) {
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

    it('throws an error for non-string, non-image objects', function() {
      expect(function() { steg.encode('Test', {}) }).toThrowError('IllegalInput: The input image is neither an URL string nor an image.');
    })
  });

  describe('Decode', function(){
    it('is defined', function () {
      expect(steg.decode).not.toBeUndefined();
    });

    it('throws an error for non-string, non-image objects', function() {
      expect(function() { steg.encode('Test', {}) }).toThrowError('IllegalInput: The input image is neither an URL string nor an image.');
    })
  });

  describe('Capacity', function(){
    it('is defined', function () {
      expect(steg.getHidingCapacity).not.toBeUndefined();
    });

    it('works with default settings', function(done) {
      var img = new Image();
      img.onload = function() {
        var capacity = steg.getHidingCapacity(img);
        expect(capacity).toEqual(18026)
        done();
      };
      img.src = resources.img.cover;
    });
  });

  describe('Config', function(){
    it('is defined', function () {
      expect(steg.config).not.toBeUndefined();
    });
  });

});
