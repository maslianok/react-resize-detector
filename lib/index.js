"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "withResizeDetector", {
  enumerable: true,
  get: function get() {
    return _withResizeDetector["default"];
  }
});
exports["default"] = void 0;

var _ResizeDetector = _interopRequireDefault(require("./components/ResizeDetector"));

var _withResizeDetector = _interopRequireDefault(require("./hoc/withResizeDetector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _ResizeDetector["default"];
exports["default"] = _default;