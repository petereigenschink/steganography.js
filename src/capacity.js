Cover.prototype.getHidingCapacity = function (image, options) {
  options = options || {};
  var config = this.config;

  var width = options.width || image.width || image.naturalWidth,
    height = options.height || image.height || image.naturalHeight,
    t = options.t || config.t,
    codeUnitSize = options.codeUnitSize || config.codeUnitSize;
  return t * width * height / codeUnitSize >> 0;
};
