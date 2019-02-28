"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _propTypes = require("prop-types");

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _utils = require("../lib/utils");

var _Reference = _interopRequireDefault(require("./Reference"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ResizeDetector =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ResizeDetector, _PureComponent);

  function ResizeDetector(props) {
    var _this;

    _classCallCheck(this, ResizeDetector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResizeDetector).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "cancelHandler", function () {
      var shouldCancel = !!(_this.resizeHandler && _this.resizeHandler.cancel);

      if (shouldCancel) {
        // cancel debounced handler
        _this.resizeHandler.cancel();

        _this.resizeHandler = null;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "rafClean", function () {
      var shouldClean = !!(_this.raf && _this.raf.cancel);

      if (shouldClean) {
        _this.raf.cancel();

        _this.raf = null;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toggleObserver", function (isOn) {
      var element = _this.getElement();

      if (!element) return;
      var type = isOn ? 'observe' : 'unobserve';
      var isValid = !!_this.resizeObserver[type];
      if (!isValid) return;

      _this.resizeObserver[type](element);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getElement", function () {
      var querySelector = _this.props.querySelector;
      var isHaveWindow = (0, _utils.checkIsHaveWindow)();
      if (!isHaveWindow) return null;
      var selectedElement = querySelector && document.querySelector(querySelector); // eslint-disable-next-line react/no-find-dom-node

      var currentElement = (0, _reactDom.findDOMNode)(_this.element);
      var parentElement = currentElement && currentElement.parentElement;
      var element = selectedElement || parentElement;
      return element;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "createUpdater", function () {
      _this.rafClean();

      _this.raf = (0, _rafSchd.default)(function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        var onResize = _this.props.onResize;

        if ((0, _utils.isFunction)(onResize)) {
          onResize(width, height);
        }

        if (!_this.unmounted) {
          _this.setState({
            width: width,
            height: height
          });
        }
      });
      return _this.raf;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "createResizeHandler", function (entries) {
      var _this$state = _this.state,
          widthCurrent = _this$state.width,
          heightCurrent = _this$state.height;
      var _this$props = _this.props,
          handleWidth = _this$props.handleWidth,
          handleHeight = _this$props.handleHeight;

      var updater = _this.createUpdater();

      entries.forEach(function (entry) {
        var _ref2 = entry && entry.contentRect || {},
            width = _ref2.width,
            height = _ref2.height;

        var isWidthChanged = handleWidth && widthCurrent !== width;
        var isHeightChanged = handleHeight && heightCurrent !== height;
        var isSizeChanged = isWidthChanged || isHeightChanged;
        var isHaveWindow = (0, _utils.checkIsHaveWindow)();
        var shouldSetSize = !_this.skipOnMount && isSizeChanged && isHaveWindow;

        if (shouldSetSize) {
          updater({
            width: width,
            height: height
          });
        }

        _this.skipOnMount = false;
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onRef", function (el) {
      _this.element = el;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getComponent", function () {
      var _this$state2 = _this.state,
          width = _this$state2.width,
          height = _this$state2.height;
      var _this$props2 = _this.props,
          render = _this$props2.render,
          children = _this$props2.children;
      var childProps = {
        width: width,
        height: height
      };
      var isRenderProps = (0, _utils.isFunction)(render);
      var isFunctional = (0, _utils.isFunction)(children);
      var isComponent = (0, _react.isValidElement)(children);
      var component;

      if (!component && isRenderProps) {
        component = (0, _react.cloneElement)(render(childProps), {
          key: 'resize-detector'
        });
      }

      if (!component && isFunctional) {
        component = (0, _react.cloneElement)(children(childProps));
      }

      if (!component && isComponent) {
        component = (0, _react.cloneElement)(children, childProps);
      }

      return component;
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
    _this.raf = null;
    _this.element = null;
    _this.unmounted = false;
    var handle = (0, _utils.getHandle)(refreshMode);
    _this.resizeHandler = handle ? handle(_this.createResizeHandler, refreshRate, refreshOptions) : _this.createResizeHandler;
    _this.resizeObserver = new _resizeObserverPolyfill.default(_this.resizeHandler);
    return _this;
  }

  _createClass(ResizeDetector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.toggleObserver(true);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.toggleObserver(false);
      this.rafClean();
      this.cancelHandler();
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      var component = this.getComponent();
      return _react.default.createElement(_Reference.default, {
        ref: this.onRef
      }, component || _react.default.createElement("div", null));
    }
  }]);

  return ResizeDetector;
}(_react.PureComponent);

ResizeDetector.propTypes = {
  handleWidth: _propTypes.bool,
  handleHeight: _propTypes.bool,
  skipOnMount: _propTypes.bool,
  refreshRate: _propTypes.number,
  refreshMode: _propTypes.string,
  refreshOptions: (0, _propTypes.shape)({
    leading: _propTypes.bool,
    trailing: _propTypes.bool
  }),
  querySelector: _propTypes.string,
  onResize: _propTypes.func,
  render: _propTypes.func,
  children: _propTypes.any // eslint-disable-line react/forbid-prop-types

};
ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  querySelector: null,
  onResize: null,
  render: undefined,
  children: null
};
var _default = ResizeDetector;
exports.default = _default;