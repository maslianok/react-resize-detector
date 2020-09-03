function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { PureComponent, isValidElement, cloneElement, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import rafSchd from 'raf-schd';
import { getHandle, isFunction, isSSR, isDOMElement } from "../lib/utils";

var ResizeDetector = /*#__PURE__*/function (_PureComponent) {
  _inherits(ResizeDetector, _PureComponent);

  var _super = _createSuper(ResizeDetector);

  function ResizeDetector(props) {
    var _this;

    _classCallCheck(this, ResizeDetector);

    _this = _super.call(this, props);

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

    _defineProperty(_assertThisInitialized(_this), "attachObserver", function () {
      var targetRef = _this.props.targetRef;

      if (targetRef && targetRef.current) {
        _this.targetRef.current = targetRef.current;
      }

      var element = _this.getElement();

      if (!element) {
        // can't find element to observe
        return;
      }

      if (_this.observableElement && _this.observableElement === element) {
        // element is already observed
        return;
      }

      _this.observableElement = element;

      _this.resizeObserver.observe(element);
    });

    _defineProperty(_assertThisInitialized(_this), "getElement", function () {
      var _this$props = _this.props,
          querySelector = _this$props.querySelector,
          targetDomEl = _this$props.targetDomEl;
      if (isSSR()) return undefined; // in case we pass a querySelector

      if (querySelector) return document.querySelector(querySelector); // in case we pass a DOM element

      if (targetDomEl && isDOMElement(targetDomEl)) return targetDomEl; // in case we pass a React ref using React.createRef()

      if (_this.targetRef && isDOMElement(_this.targetRef.current)) return _this.targetRef.current; // the worse case when we don't receive any information from the parent and the library doesn't add any wrappers
      // we have to use a deprecated `findDOMNode` method in order to find a DOM element to attach to
      // eslint-disable-next-line react/no-find-dom-node

      var currentElement = findDOMNode(_assertThisInitialized(_this));
      if (!currentElement) return undefined;

      var renderType = _this.getRenderType();

      switch (renderType) {
        case 'renderProp':
          return currentElement;

        case 'childFunction':
          return currentElement;

        case 'child':
          return currentElement;

        case 'childArray':
          return currentElement;

        default:
          return currentElement.parentElement;
      }
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

    _defineProperty(_assertThisInitialized(_this), "getRenderType", function () {
      var _this$props3 = _this.props,
          render = _this$props3.render,
          children = _this$props3.children;

      if (isFunction(render)) {
        // DEPRECATED. Use `Child Function Pattern` instead
        return 'renderProp';
      }

      if (isFunction(children)) {
        return 'childFunction';
      }

      if ( /*#__PURE__*/isValidElement(children)) {
        return 'child';
      }

      if (Array.isArray(children)) {
        // DEPRECATED. Wrap children with a single parent
        return 'childArray';
      } // DEPRECATED. Use `Child Function Pattern` instead


      return 'parent';
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
    _this.unmounted = false;
    _this.targetRef = /*#__PURE__*/createRef();
    _this.observableElement = null;
    var handle = getHandle(refreshMode);
    _this.resizeHandler = handle ? handle(_this.createResizeHandler, refreshRate, refreshOptions) : _this.createResizeHandler;
    _this.resizeObserver = new ResizeObserver(_this.resizeHandler);
    return _this;
  }

  _createClass(ResizeDetector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.attachObserver();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.attachObserver();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.resizeObserver.disconnect();
      this.rafClean();
      this.cancelHandler();
      this.unmounted = true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          render = _this$props4.render,
          children = _this$props4.children,
          WrapperTag = _this$props4.nodeType;
      var _this$state2 = this.state,
          width = _this$state2.width,
          height = _this$state2.height;
      var childProps = {
        width: width,
        height: height,
        targetRef: this.targetRef
      };
      var renderType = this.getRenderType();

      switch (renderType) {
        case 'renderProp':
          return render(childProps);

        case 'childFunction':
          return children(childProps);

        case 'child':
          // @TODO bug prone logic
          if (typeof children.type === 'string') {
            // child is a native DOM elements such as div, span etc
            var targetRef = childProps.targetRef,
                nativeProps = _objectWithoutProperties(childProps, ["targetRef"]);

            return /*#__PURE__*/cloneElement(children, nativeProps);
          } // class or functional component otherwise


          return /*#__PURE__*/cloneElement(children, childProps);

        case 'childArray':
          return children.map(function (el) {
            return !!el && /*#__PURE__*/cloneElement(el, childProps);
          });

        default:
          return /*#__PURE__*/React.createElement(WrapperTag, null);
      }
    }
  }]);

  return ResizeDetector;
}(PureComponent);

ResizeDetector.defaultProps = {
  handleWidth: true,
  handleHeight: true,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  querySelector: null,
  targetDomEl: null,
  targetRef: null,
  onResize: null,
  render: undefined,
  children: null,
  nodeType: 'div'
};
export default ResizeDetector;