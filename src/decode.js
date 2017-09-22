Cover.prototype.decode = function(image, options) {
  // Handle image url
  if(image.length) {
    image = util.loadImg(image);
  } else if(image.src) {
    image = util.loadImg(image.src);
  } else if(!(image instanceof HTMLImageElement)) {
    throw new Error('IllegalInput: The input image is neither an URL string nor an image.');
  }

  options = options || {};
  var config = this.config;

  var t = options.t || config.t,
    threshold = options.threshold || config.threshold,
    codeUnitSize = options.codeUnitSize || config.codeUnitSize,
    prime = util.findNextPrime(Math.pow(2, t)),
    args = options.args || config.args,
    messageCompleted = options.messageCompleted || config.messageCompleted;

  if(!t || t < 1 || t > 7) throw new Error('IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8');

  var shadowCanvas = document.createElement('canvas'),
    shadowCtx = shadowCanvas.getContext('2d');

  shadowCanvas.style.display = 'none';
  shadowCanvas.width = options.width || image.width;
  shadowCanvas.height = options.width || image.height;
  if(options.height && options.width) {
    shadowCtx.drawImage(image, 0, 0, options.width, options.height );
  } else {
    shadowCtx.drawImage(image, 0, 0);
  }

  var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
    data = imageData.data,
    modMessage = [],
    q;

  var i, k, done;
  if (threshold === 1) {
    for(i=3, done=false; !done && i<data.length && !done; i+=4) {
      done = messageCompleted(data, i, threshold);
      if(!done) modMessage.push(data[i]-(255-prime+1));
    }
  } else {
    /*for(k = 0, done=false; !done; k+=1) {
      q = [];
      for(i=(k*threshold*4)+3; i<(k+1)*threshold*4 && i<data.length && !done; i+=4) {
        done = messageCompleted(data,i,threshold);
        if(!done) q.push(data[i]-(255-prime+1)); // at Array index (i-((k*threshold*4)+3))/4
      }
      if(q.length === 0) continue;
      // Calculate the coefficients which are the same for any order of the variable, but different for each argument
      // i.e. for args[0] coeff=q[0]*(args[1]-args[2])*(args[1]-args[3])*...(args[1]-args[threshold-1])*...*(args[threshold-1]-args[1])*...*(args[threshold-1]-args[threshold-2])
      var variableCoefficients = (function(i) {
        if(i >= q.length) return [];
        return [q[i]*
        util.product(function(j) {
        if(j !== i) {
          return util.product(function(l) {
          if(l !== j) return (args(j) - args(l));
          }, q.length);
        }
        }, q.length)].concat(arguments.callee(i+1));
      }(0));
      // Calculate the coefficients which are different for each order of the variable and for each argument
      // i.e. for order=0 and args[0] coeff=args[1]*args[2]*...*args[threshold-1]
      var orderVariableCoefficients = function(order, varIndex) {
        var workingArgs = util.createArrayFromArgs(args,varIndex,q.length), maxRec = q.length - (order+1);
        return (function(startIndex, endIndex, recDepth) {
        var recall = arguments.callee;
        return util.sum(function(i) {
          if(recDepth < maxRec)
          return workingArgs[i]*recall(i+1,startIndex+order+2,recDepth+1);
        }, endIndex, {"start": startIndex, "defValue": 1});
        }(0,order+1,0));
      };
      // Calculate the common denominator of the whole term
      var commonDenominator = util.product(function(i) {
        return util.product(function(j) {
        if(j !== i) return (args(i) - args(j));
        }, q.length);
      }, q.length);

      for(i = 0; i < q.length; i+=1) {
        modMessage.push((((Math.pow(-1,q.length-(i+1))*util.sum(function(j) {
        return orderVariableCoefficients(i,j)*
        variableCoefficients[j];
        }, q.length))%prime)+prime)%prime); // ?divide by commonDenominator?
      }
    }
  */}

  var message = "", charCode = 0, bitCount = 0, mask = Math.pow(2, codeUnitSize)-1;
  for(i = 0; i < modMessage.length; i+=1) {
    charCode += modMessage[i] << bitCount;
    bitCount += t;
    if(bitCount >= codeUnitSize) {
      message += String.fromCharCode(charCode & mask);
      bitCount %= codeUnitSize;
      charCode = modMessage[i] >> (t-bitCount);
    }
  }
  if(charCode !== 0) message += String.fromCharCode(charCode & mask);

  return message;
};
