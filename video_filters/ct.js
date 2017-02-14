(function() {
  var CanvasInput, Events,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CanvasInput = (function() {

    CanvasInput.inputs = [];

    function CanvasInput(options) {
      var handler, x, y,
        _this = this;
      x = options.x || 0;
      y = options.y || 0;
      this.placeholder = options.placeholder || '';
      this.value = this.placeholder;
      this.width = options.width || 150;
      this.height = options.height || 30;
      this.fontSize = options.fontSize || 12;
      this.padding = options.padding || 5;
      this.onSubmit = options.onSubmit || function() {};
      this.center = options.center || false;
      this.wasOver = false;
      this.ctx = this.canvas.getContext('2d');
      this.canvasWidth = this.canvas.width || parseInt(this.canvas.style.width);
      this.canvasHeight = this.canvas.height || parseInt(this.canvas.style.height);
      this.xPos = x === 'center' ? this.canvasWidth / 2 - this.width / 2 : x + 1;
      this.yPos = (y - this.height / 2) + 1;
      if (typeof this.defaultBackgroundColor === 'undefined') {
        this.defaultBackgroundColor = this.ctx.createLinearGradient(this.xPos, this.yPos, this.xPos, this.yPos + this.height);
        this.defaultBackgroundColor.addColorStop(0, "#d5d5d5");
        this.defaultBackgroundColor.addColorStop(1, "#eee");
      }
      this.defaultFontColor || (this.defaultFontColor = '#000');
      this.defaultStrokeColor || (this.defaultStrokeColor = '#444');
      this.inputIndex = CanvasInput.inputs.push(this) - 1;
      this.refresh();
      this.handleClick = handler = function(e) {
        e || (e = window.event);
        return _this.click(e);
      };
      Events.addEvent('click', handler, false, false, this.canvas);
    }

    CanvasInput.prototype.destroy = function() {
      return Events.removeEvent('click', this.handleClick, false, this.canvas);
    };

    CanvasInput.prototype.click = function(e) {
      var x, y;
      x = e.offsetX || e.clientX;
      y = e.offsetY || e.clientY;
      if (this.inBox(x, y)) {
        return this.focus();
      } else {
        return this.unfocus();
      }
    };

    CanvasInput.prototype.inBox = function(x, y) {
      return x >= this.xPos && x <= this.xPos + this.width && y >= this.yPos && y <= this.yPos + this.height;
    };

    CanvasInput.prototype.focus = function() {};

    CanvasInput.prototype.unfocus = function() {};

    CanvasInput.prototype.refresh = function() {
      var cursorOffset, offset, ratio, text, textWidth;
      this.ctx.fillStyle = this.focused ? 'black' : this.defaultStrokeColor;
      this.ctx.fillRect(this.xPos - 1, this.yPos - 1, this.width + 2, this.height + 2);
      this.ctx.fillStyle = this.focused ? '#efefef' : this.defaultBackgroundColor;
      this.ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
      this.ctx.fillStyle = this.defaultFontColor;
      this.ctx.font = this.fontSize + 'px "Helvetica Neue", "HelveticaNeue", Helvetica, Arial, "Lucida Grande", sans-serif';
      text = this.type === 'password' && this.value !== this.placeholder ? this.value.replace(/./g, '\u25CF') : this.value;
      textWidth = this.ctx.measureText(text).width;
      offset = this.padding;
      if ((ratio = textWidth / (this.width - this.padding - 3)) > 1) {
        text = text.substr(-1 * Math.floor(text.length / ratio));
      } else if (this.center) {
        offset = this.width / 2 - textWidth / 2;
      }
      this.ctx.fillText(text, this.xPos + offset, this.yPos + this.height / 2 + this.fontSize / 2);
      if (this.cursorOn) {
        this.ctx.fillStyle = this.defaultFontColor;
        cursorOffset = this.ctx.measureText(text.substring(0, this.cursorPos)).width;
        if (this.center) {
          cursorOffset += offset - this.padding;
        }
        return this.ctx.fillRect(this.xPos + this.padding + cursorOffset, this.yPos + this.padding, 1, this.height - 2 * this.padding);
      }
    };

    return CanvasInput;

  })();

  this.CanvasText = (function(_super) {

    __extends(CanvasText, _super);

    function CanvasText(canvas, options) {
      var handler,
        _this = this;
      this.canvas = canvas;
      this.type || (this.type = 'text');
      this.cursorPos = 0;
      this.handleKey = handler = function(e) {
        e || (e = window.event);
        return _this.keyDown(e);
      };
      Events.addEvent('keydown', handler, false, false);
      this.handleMouse = handler = function(e) {
        e || (e = window.event);
        return _this.mouseMove(e);
      };
      Events.addEvent('mousemove', handler, false, false, this.canvas);
      CanvasText.__super__.constructor.call(this, options);
    }

    CanvasText.prototype.destroy = function() {
      Events.removeEvent('click', this.handleClick, false, this.canvas);
      return Events.removeEvent('keydown', this.handleKey, false);
    };

    CanvasText.prototype.focus = function() {
      var input, isMobile,
        _this = this;
      if (this.focused) {
        return;
      }
      this.focused = true;
      this.cursorInterval = setInterval(function() {
        _this.cursorOn = !_this.cursorOn;
        return _this.refresh();
      }, 500);
      isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
      if (typeof CocoonJS !== 'undefined' && CocoonJS.Keyboard && CocoonJS.Keyboard.available) {
        CocoonJS.Keyboard.Types.TEXT();
      } else if (isMobile && document && document.createElement && (input = document.createElement('input'))) {
        input.type = 'text';
        input.style.opacity = 0;
        input.style.position = 'absolute';
        input.style.top = this.yPos + 'px';
        input.style.left = this.xPos + 'px';
        input.style.width = input.style.height = 0;
        document.body.appendChild(input);
        input.focus();
      } else if (isMobile) {
        this.value = prompt(this.placeholder) || '';
      }
      if (this.value === this.placeholder) {
        this.value = '';
      }
      return this.refresh();
    };

    CanvasText.prototype.unfocus = function() {
      this.focused = false;
      clearInterval(this.cursorInterval);
      this.cursorOn = false;
      if (this.value === '') {
        this.value = this.placeholder;
      }
      return this.refresh();
    };

    CanvasText.prototype.mouseMove = function(e) {
      var x, y;
      x = e.offsetX || e.clientX;
      y = e.offsetY || e.clientY;
      if (this.inBox(x, y) && this.canvas.style) {
        this.canvas.style.cursor = 'text';
        return this.wasOver = true;
      } else if (this.wasOver && this.canvas.style) {
        this.canvas.style.cursor = 'default';
        return this.wasOver = false;
      }
    };

    CanvasText.prototype.keyDown = function(e) {
      var cursorVal, input, key, obj, _i, _len, _ref;
      if (this.focused) {
        e.preventDefault();
        cursorVal = true;
        if (e.which === 8) {
          if (this.cursorPos > 0) {
            this.value = this.value.substr(0, this.cursorPos - 1) + this.value.substr(this.cursorPos, this.value.length);
            this.cursorPos--;
          }
        }
        if (e.which === 46) {
          if (this.cursorPos < this.value.length) {
            this.value = this.value.substr(0, this.cursorPos) + this.value.substr(this.cursorPos + 1, this.value.length);
          }
        } else if (e.which === 37) {
          this.cursorPos--;
        } else if (e.which === 39) {
          this.cursorPos++;
        } else if (e.which === 13) {
          _ref = CanvasInput.inputs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            input = _ref[_i];
            if (input.type === 'submit') {
              cursorVal = false;
              this.unfocus();
              input.focus();
              break;
            }
          }
        } else if (e.which === 9) {
          cursorVal = false;
          this.unfocus();
          if (obj = CanvasInput.inputs[this.inputIndex + 1]) {
            setTimeout((function() {
              return obj.focus();
            }), 1);
          }
        } else if (key = this.mapKeyPressToActualCharacter(e.shiftKey, e.which)) {
          this.value += key;
          this.cursorPos++;
        }
        this.cursorOn = cursorVal;
        return this.refresh();
      }
    };

    CanvasText.prototype.mapKeyPressToActualCharacter = function(isShiftKey, characterCode) {
      var character, characterMap;
      if (characterCode === 27 || characterCode === 8 || characterCode === 9 || characterCode === 20 || characterCode === 16 || characterCode === 17 || characterCode === 91 || characterCode === 13 || characterCode === 92 || characterCode === 18) {
        return false;
      }
      if (typeof isShiftKey !== "boolean" || typeof characterCode !== "number") {
        return false;
      }
      characterMap = [];
      characterMap[192] = "~";
      characterMap[49] = "!";
      characterMap[50] = "@";
      characterMap[51] = "#";
      characterMap[52] = "$";
      characterMap[53] = "%";
      characterMap[54] = "^";
      characterMap[55] = "&";
      characterMap[56] = "*";
      characterMap[57] = "(";
      characterMap[48] = ")";
      characterMap[109] = "_";
      characterMap[107] = "+";
      characterMap[219] = "{";
      characterMap[221] = "}";
      characterMap[220] = "|";
      characterMap[59] = ":";
      characterMap[222] = "\"";
      characterMap[188] = "<";
      characterMap[190] = ">";
      characterMap[187] = "+";
      characterMap[191] = "?";
      characterMap[32] = " ";
      character = "";
      if (isShiftKey) {
        if (characterCode >= 65 && characterCode <= 90) {
          character = String.fromCharCode(characterCode);
        } else {
          character = characterMap[characterCode];
        }
      } else {
        if (characterCode >= 65 && characterCode <= 90) {
          character = String.fromCharCode(characterCode).toLowerCase();
        } else {
          if (characterCode === 188) {
            character = ',';
          } else if (characterCode === 190) {
            character = '.';
          } else {
            character = String.fromCharCode(characterCode);
          }
        }
      }
      return character;
    };

    return CanvasText;

  })(CanvasInput);

  this.CanvasPassword = (function(_super) {

    __extends(CanvasPassword, _super);

    function CanvasPassword(canvas, options) {
      this.canvas = canvas;
      this.type = 'password';
      CanvasPassword.__super__.constructor.call(this, this.canvas, options);
    }

    return CanvasPassword;

  })(this.CanvasText);

  this.CanvasSubmit = (function(_super) {

    __extends(CanvasSubmit, _super);

    function CanvasSubmit(canvas, options) {
      this.canvas = canvas;
      this.type = 'submit';
      options.center || (options.center = true);
      this.defaultBackgroundColor = '#666';
      this.defaultFontColor = '#fff';
      this.defaultStrokeColor = '#000';
      CanvasSubmit.__super__.constructor.call(this, options);
    }

    CanvasSubmit.prototype.focus = function() {
      return this.onSubmit();
    };

    return CanvasSubmit;

  })(CanvasInput);

  Events = (function() {

    function Events() {}

    Events.addEvent = function(type, listener, useObject, removeListener, obj) {
      var tmp,
        _this = this;
      if (useObject == null) {
        useObject = false;
      }
      if (removeListener == null) {
        removeListener = false;
      }
      if (obj == null) {
        obj = window;
      }
      if (removeListener) {
        tmp = listener;
        listener = function(event) {
          tmp(event);
          if (removeListener) {
            return _this.removeEvent(type, arguments.callee, useObject, obj);
          }
        };
      }
      if (obj.addEventListener) {
        return obj.addEventListener(type, listener, useObject);
      } else if (obj.attachEvent) {
        return obj.attachEvent('on' + type, listener, useObject);
      } else {
        return obj['on' + type] = listener;
      }
    };

    Events.removeEvent = function(type, listener, useObject, obj) {
      if (useObject == null) {
        useObject = false;
      }
      if (obj == null) {
        obj = window;
      }
      if (obj.removeEventListener) {
        return obj.removeEventListener(type, listener, useObject);
      } else if (obj.detachEvent) {
        return obj.detachEvent('on' + type, listener, useObject);
      } else {
        return obj['on' + type] = null;
      }
    };

    return Events;

  })();

}).call(this);