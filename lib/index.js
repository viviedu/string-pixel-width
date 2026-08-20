'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.deburr');

var _lodash2 = _interopRequireDefault(_lodash);

var _widthsMap = require('./widthsMap');

var _widthsMap2 = _interopRequireDefault(_widthsMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settingsDefaults = { font: 'Arial', size: 100 };

// East Asian Wide and Fullwidth code point ranges, which occupy a full em
var fullWidthRanges = [[0x1100, 0x115F], [0x2E80, 0x303E], [0x3041, 0x33FF], [0x3400, 0x4DBF], [0x4E00, 0x9FFF], [0xA000, 0xA4CF], [0xAC00, 0xD7A3], [0xF900, 0xFAFF], [0xFE30, 0xFE6B], [0xFF01, 0xFF60], [0xFFE0, 0xFFE6]];
var fullWidths = [100, 100, 100, 100];

var isFullWidth = function isFullWidth(char) {
  var code = char.charCodeAt(0);
  return fullWidthRanges.some(function (range) {
    return code >= range[0] && code <= range[1];
  });
};

var getWidth = function getWidth(string, settings) {
  var sett = _extends({}, settingsDefaults, settings);
  var font = sett.font.toLowerCase();
  var size = sett.size;
  var variant = 0 + (sett.bold ? 1 : 0) + (sett.italic ? 2 : 0);
  var available = Object.keys(_widthsMap2.default);
  if (available.indexOf(font) === -1) {
    throw new Error('This font is not supported. Supported fonts are: ' + available.join(', '));
  }
  var totalWidth = 0;
  (0, _lodash2.default)(string).split('').forEach(function (char) {
    if (/[\x00-\x1F]/.test(char)) {
      // non-printable character
      return true;
    }
    // full width chars are one em, otherwise use the width of 'x' as fallback for unregistered char
    var fallback = isFullWidth(char) ? fullWidths : _widthsMap2.default[font].x;
    var widths = _widthsMap2.default[font][char] || fallback;
    var width = widths[variant];
    totalWidth += width;
    return true;
  });
  return totalWidth * (size / 100);
};

exports.default = getWidth;
module.exports = exports['default'];