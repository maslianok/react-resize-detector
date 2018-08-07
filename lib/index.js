'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withResizeDetector = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.throttle');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isarray');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.isfunction');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var listMode = { debounce: _lodash2.default, throttle: _lodash4.default };

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
  if (!(0, _lodash6.default)(children)) return [children];
  return children;
}

var ResizeDetector = function (_PureComponent) {
  _inherits(ResizeDetector, _PureComponent);

  function ResizeDetector(props) {
    _classCallCheck(this, ResizeDetector);

    var _this = _possibleConstructorReturn(this, (ResizeDetector.__proto__ || Object.getPrototypeOf(ResizeDetector)).call(this, props));

    _this.getElement = function () {
      var resizableElementId = _this.props.resizableElementId;


      var otherElement = resizableElementId && document.getElementById(resizableElementId);
      var parentElement = _this.el && _this.el.parentElement;

      var resizableElement = otherElement || parentElement;

      return resizableElement;
    };

    _this.createResizeObserver = function (entries) {
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
        if (!_this.skipOnMount && (notifyWidth || notifyHeight)) {
          onResize(width, height);
          _this.setState({ width: width, height: height });
        }
        _this.skipOnMount = false;
      });
    };

    _this.handleRenderProp = function () {
      var _this$state = _this.state,
          width = _this$state.width,
          height = _this$state.height;
      var render = _this.props.render;

      if (render && typeof render === 'function') {
        return (0, _react.cloneElement)(render({ width: width, height: height }), { key: 'render' });
      }

      return undefined;
    };

    _this.renderChildren = function () {
      var _this$state2 = _this.state,
          width = _this$state2.width,
          height = _this$state2.height;
      var children = _this.props.children;

      return convertChildrenToArray(children).filter(function (child) {
        return !!child;
      }).map(function (child, key) {
        if ((0, _lodash8.default)(child)) return (0, _react.cloneElement)(child(width, height), { key: key });
        if ((0, _react.isValidElement)(child)) return (0, _react.cloneElement)(child, { width: width, height: height, key: key });
        return child;
      });
    };

    var skipOnMount = props.skipOnMount,
        refreshMode = props.refreshMode,
        refreshRate = props.refreshRate;


    _this.skipOnMount = skipOnMount;

    _this.state = {
      width: undefined,
      height: undefined
    };

    var resizeObserver = listMode[refreshMode] && listMode[refreshMode](_this.createResizeObserver, refreshRate) || _this.createResizeObserver;

    _this.ro = new _resizeObserverPolyfill2.default(resizeObserver);
    return _this;
  }

  _createClass(ResizeDetector, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var resizableElement = this.getElement();
      if (resizableElement) this.ro.observe(resizableElement);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var resizableElement = this.getElement();
      if (resizableElement) this.ro.unobserve(resizableElement);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return [_react2.default.createElement('div', {
        key: 'resize-detector',
        style: styles,
        ref: function ref(el) {
          _this2.el = el;
        }
      }), this.handleRenderProp()].concat(_toConsumableArray(this.renderChildren()));
    }
  }]);

  return ResizeDetector;
}(_react.PureComponent);

ResizeDetector.propTypes = {
  handleWidth: _propTypes2.default.bool,
  handleHeight: _propTypes2.default.bool,
  skipOnMount: _propTypes2.default.bool,
  refreshRate: _propTypes2.default.number,
  refreshMode: _propTypes2.default.string,
  resizableElementId: _propTypes2.default.string,
  onResize: _propTypes2.default.func,
  render: _propTypes2.default.func,
  children: _propTypes2.default.any // eslint-disable-line react/forbid-prop-types
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  resizableElementId: '',
  onResize: function onResize(e) {
    return e;
  },
  render: undefined,
  children: null
};

var withResizeDetector = exports.withResizeDetector = function withResizeDetector(WrappedComponent) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { handleWidth: true, handleHeight: true };
  return (
    // eslint-disable-next-line
    function (_Component) {
      _inherits(ResizeDetectorHOC, _Component);

      function ResizeDetectorHOC() {
        _classCallCheck(this, ResizeDetectorHOC);

        return _possibleConstructorReturn(this, (ResizeDetectorHOC.__proto__ || Object.getPrototypeOf(ResizeDetectorHOC)).apply(this, arguments));
      }

      _createClass(ResizeDetectorHOC, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            ResizeDetector,
            props,
            _react2.default.createElement(WrappedComponent, this.props)
          );
        }
      }]);

      return ResizeDetectorHOC;
    }(_react.Component)
  );
};

exports.default = ResizeDetector;