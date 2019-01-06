"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.withResizeDetector = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _throttle = _interopRequireDefault(require("lodash/throttle"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var listMode = {
  debounce: _debounce.default,
  throttle: _throttle.default
};
var styles = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  display: 'none'
};
/**
 * detect component's children and convert them to array
 * @param {*} children - component's children
 */

function convertChildrenToArray(children) {
  if (!children) return [];
  if (!Array.isArray(children)) return [children];
  return children;
}

var ResizeDetector =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ResizeDetector, _PureComponent);

  function ResizeDetector(props) {
    var _this;

    _classCallCheck(this, ResizeDetector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResizeDetector).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getElement", function () {
      var resizableElementId = _this.props.resizableElementId;
      var otherElement = resizableElementId && document.getElementById(resizableElementId);
      var parentElement = _this.el && _this.el.parentElement;
      var resizableElement = otherElement || parentElement;
      return resizableElement;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "createResizeHandler", function (entries) {
      var _this$props = _this.props,
          handleWidth = _this$props.handleWidth,
          handleHeight = _this$props.handleHeight,
          onResize = _this$props.onResize;
      entries.forEach(function (entry) {
        var _entry$contentRect = entry.contentRect,
            width = _entry$contentRect.width,
            height = _entry$contentRect.height;
        var notifyWidth = handleWidth && _this.state.width !== width;
        var notifyHeight = handleHeight && _this.state.height !== height;

        if (!_this.skipOnMount && (notifyWidth || notifyHeight) && typeof window !== 'undefined') {
          _this.animationFrameID = window.requestAnimationFrame(function () {
            onResize(width, height);

            _this.setState({
              width: width,
              height: height
            });
          });
        }

        _this.skipOnMount = false;
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleRenderProp", function () {
      var _this$state = _this.state,
          width = _this$state.width,
          height = _this$state.height;
      var render = _this.props.render;

      if (render && typeof render === 'function') {
        return (0, _react.cloneElement)(render({
          width: width,
          height: height
        }), {
          key: 'render'
        });
      }

      return undefined;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renderChildren", function () {
      var _this$state2 = _this.state,
          width = _this$state2.width,
          height = _this$state2.height;
      var children = _this.props.children;
      return convertChildrenToArray(children).filter(function (child) {
        return !!child;
      }).map(function (child, key) {
        if ((0, _isFunction.default)(child)) return (0, _react.cloneElement)(child(width, height), {
          key: key
        });
        if ((0, _react.isValidElement)(child)) return (0, _react.cloneElement)(child, {
          width: width,
          height: height,
          key: key
        });
        return child;
      });
    });

    var skipOnMount = props.skipOnMount,
        refreshMode = props.refreshMode,
        refreshRate = props.refreshRate,
        refreshOptions = props.refreshOptions;
    _this.state = {
      width: undefined,
      height: undefined
    };
    _this.skipOnMount = skipOnMount;
    _this.animationFrameID = null;
    _this.resizeHandler = listMode[refreshMode] ? listMode[refreshMode](_this.createResizeHandler, refreshRate, refreshOptions) : _this.createResizeHandler;
    _this.ro = new _resizeObserverPolyfill.default(_this.resizeHandler);
    return _this;
  }

  _createClass(ResizeDetector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var resizableElement = this.getElement();
      if (resizableElement) this.ro.observe(resizableElement);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var resizableElement = this.getElement();
      if (resizableElement) this.ro.unobserve(resizableElement);

      if (typeof window !== 'undefined' && this.animationFrameID) {
        window.cancelAnimationFrame(this.animationFrameID);
      }

      if (this.resizeHandler && this.resizeHandler.cancel) {
        // cancel debounced handler
        this.resizeHandler.cancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var nodeType = this.props.nodeType;
      var resizeDetector = (0, _react.createElement)(nodeType, {
        key: 'resize-detector',
        style: styles,
        ref: function ref(el) {
          _this2.el = el;
        }
      });
      return [resizeDetector, this.handleRenderProp()].concat(_toConsumableArray(this.renderChildren()));
    }
  }]);

  return ResizeDetector;
}(_react.PureComponent);

ResizeDetector.propTypes = {
  handleWidth: _propTypes.default.bool,
  handleHeight: _propTypes.default.bool,
  skipOnMount: _propTypes.default.bool,
  refreshRate: _propTypes.default.number,
  refreshMode: _propTypes.default.string,
  refreshOptions: _propTypes.default.shape({
    leading: _propTypes.default.bool,
    trailing: _propTypes.default.bool
  }),
  resizableElementId: _propTypes.default.string,
  onResize: _propTypes.default.func,
  render: _propTypes.default.func,
  children: _propTypes.default.any,
  // eslint-disable-line react/forbid-prop-types
  nodeType: _propTypes.default.node // eslint-disable-line react/forbid-prop-types

};
ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  resizableElementId: '',
  onResize: function onResize(e) {
    return e;
  },
  render: undefined,
  children: null,
  nodeType: 'div'
};

var withResizeDetector = function withResizeDetector(WrappedComponent) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    handleWidth: true,
    handleHeight: true
  };
  return (
    /*#__PURE__*/
    // eslint-disable-next-line
    function (_Component) {
      _inherits(ResizeDetectorHOC, _Component);

      function ResizeDetectorHOC() {
        _classCallCheck(this, ResizeDetectorHOC);

        return _possibleConstructorReturn(this, _getPrototypeOf(ResizeDetectorHOC).apply(this, arguments));
      }

      _createClass(ResizeDetectorHOC, [{
        key: "render",
        value: function render() {
          return _react.default.createElement(ResizeDetector, props, _react.default.createElement(WrappedComponent, this.props));
        }
      }]);

      return ResizeDetectorHOC;
    }(_react.Component)
  );
};

exports.withResizeDetector = withResizeDetector;
var _default = ResizeDetector;
exports.default = _default;