describe('steganography.js', function(){
  it('Encode/decode message equality', function (done) {
    var img = document.createElement('img');
    img.onload = function() {
      var msg = readJSON('json/message.json');
      var dataURL = stego.encode(msg, img);
      var readImg = document.createElement('img');
      readImg.onload = function() {
        var readMsg = stego.decode(readImg);
        expect(readMsg).toEqual(msg);
        done();
      };
      readImg.src=dataURL;
    };
    img.src = 'base/img/tshirts-20.jpg';
  });
});