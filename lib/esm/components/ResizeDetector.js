function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { PureComponent, isValidElement, cloneElement, createElement } from 'react';
import { findDOMNode } from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import rafSchd from 'raf-schd';
import { bool, number, string, shape, func, any, node } from 'prop-types';
import { getHandle, isFunction, isSSR, isDOMElement } from "../lib/utils";
import ChildWrapper from "./ChildWrapper";

var ResizeDetector =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(ResizeDetector, _PureComponent);

  function ResizeDetector(props) {
    var _this;

    _classCallCheck(this, ResizeDetector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResizeDetector).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "cancelHandler", function () {
      if (_this.resizeHandler && _this.resizeHandler.cancel) {
        // cancel debounced handler
        _this.resizeHandler.cancel();

        _this.resizeHandler = null;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "rafClean", function () {
      if (_this.raf && _this.raf.cancel) {
        _this.raf.cancel();

        _this.raf = null;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleObserver", function (type) {
      var element = _this.getElement();

      if (!element || !_this.resizeObserver[type]) return;

      _this.resizeObserver[type](element);
    });

    _defineProperty(_assertThisInitialized(_this), "getElement", function () {
      var _this$props = _this.props,
          querySelector = _this$props.querySelector,
          targetDomEl = _this$props.targetDomEl;
      if (isSSR()) return undefined;
      if (querySelector) return document.querySelector(querySelector);
      if (targetDomEl && isDOMElement(targetDomEl)) return targetDomEl; // eslint-disable-next-line react/no-find-dom-node

      var currentElement = _this.element && findDOMNode(_this.element);
      if (!currentElement) return undefined;
      return currentElement.parentElement;
    });

    _defineProperty(_assertThisInitialized(_this), "createUpdater", function () {
      _this.rafClean();

      _this.raf = rafSchd(function (_ref) {
        var width = _ref.width,
            height = _ref.height;
        var onResize = _this.props.onResize;

        if (isFunction(onResize)) {
          onResize(width, height);
        }

        _this.setState({
          width: width,
          height: height
        });
      });
      return _this.raf;
    });

    _defineProperty(_assertThisInitialized(_this), "createResizeHandler", function (entries) {
      var _this$state = _this.state,
          widthCurrent = _this$state.width,
          heightCurrent = _this$state.height;
      var _this$props2 = _this.props,
          handleWidth = _this$props2.handleWidth,
          handleHeight = _this$props2.handleHeight;
      if (!handleWidth && !handleHeight) return;

      var updater = _this.createUpdater();

      entries.forEach(function (entry) {
        var _ref2 = entry && entry.contentRect || {},
            width = _ref2.width,
            height = _ref2.height;

        var isWidthChanged = handleWidth && widthCurrent !== width;
        var isHeightChanged = handleHeight && heightCurrent !== height;
        var isSizeChanged = isWidthChanged || isHeightChanged;
        var shouldSetSize = !_this.skipOnMount && isSizeChanged && !isSSR();

        if (shouldSetSize) {
          updater({
            width: width,
            height: height
          });
        }

        _this.skipOnMount = false;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onRef", function (el) {
      _this.element = el;
    });

    _defineProperty(_assertThisInitialized(_this), "getRenderType", function () {
      var _this$props3 = _this.props,
          render = _this$props3.render,
          children = _this$props3.children;

      if (isFunction(render)) {
        return 'renderProp';
      }

      if (isFunction(children)) {
        return 'childFunction';
      }

      if (isValidElement(children)) {
        return 'child';
      }

      if (Array.isArray(children)) {
        return 'childArray';
      }

      return 'parent';
    });

    _defineProperty(_assertThisInitialized(_this), "getTargetComponent", function () {
      var _this$props4 = _this.props,
          render = _this$props4.render,
          children = _this$props4.children,
          nodeType = _this$props4.nodeType;
      var _this$state2 = _this.state,
          width = _this$state2.width,
          height = _this$state2.height;
      var childProps = {
        width: width,
        height: height
      };

      var renderType = _this.getRenderType();

      switch (renderType) {
        case 'renderProp':
          return cloneElement(render(childProps), {
            key: 'resize-detector'
          });

        case 'childFunction':
          return cloneElement(children(childProps));

        case 'child':
          return cloneElement(children, childProps);

        case 'childArray':
          return children.map(function (el) {
            return !!el && cloneElement(el, childProps);
          });

        default:
          return createElement(nodeType);
      }
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
    var handle = getHandle(refreshMode);
    _this.resizeHandler = handle ? handle(_this.createResizeHandler, refreshRate, refreshOptions) : _this.createResizeHandler;
    _this.resizeObserver = new ResizeObserver(_this.resizeHandler);
    return _this;
  }

  _createClass(ResizeDetector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.toggleObserver('observe');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.toggleObserver('unobserve');
      this.rafClean();
      this.cancelHandler();
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ChildWrapper, {
        ref: this.onRef
      }, this.getTargetComponent());
    }
  }]);

  return ResizeDetector;
}(PureComponent);

ResizeDetector.propTypes = {
  handleWidth: bool,
  handleHeight: bool,
  skipOnMount: bool,
  refreshRate: number,
  refreshMode: string,
  refreshOptions: shape({
    leading: bool,
    trailing: bool
  }),
  querySelector: string,
  targetDomEl: any,
  // eslint-disable-line react/forbid-prop-types
  onResize: func,
  render: func,
  children: any,
  // eslint-disable-line react/forbid-prop-types
  nodeType: node
};
ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  querySelector: null,
  targetDomEl: null,
  onResize: null,
  render: undefined,
  children: null,
  nodeType: 'div'
};
export default ResizeDetector;