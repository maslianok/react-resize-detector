function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { useEffect, useState, useRef } from 'react';
import rafSchd from 'raf-schd';
import { getRefreshScheduler, isFunction, isSSR } from "./lib/utils";

var createAsyncNotifier = function createAsyncNotifier(onResize, setSize) {
  return (// eslint-disable-next-line implicit-arrow-linebreak
    rafSchd(function (_ref) {
      var width = _ref.width,
          height = _ref.height;

      if (isFunction(onResize)) {
        onResize(width, height);
      }

      setSize({
        width: width,
        height: height
      });
    })
  );
};

function useResizeDetector() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _props$skipOnMount = props.skipOnMount,
      skipOnMount = _props$skipOnMount === void 0 ? false : _props$skipOnMount,
      refreshMode = props.refreshMode,
      refreshRate = props.refreshRate,
      refreshOptions = props.refreshOptions,
      _props$handleWidth = props.handleWidth,
      handleWidth = _props$handleWidth === void 0 ? true : _props$handleWidth,
      _props$handleHeight = props.handleHeight,
      handleHeight = _props$handleHeight === void 0 ? true : _props$handleHeight,
      onResize = props.onResize;
  var skipResize = useRef(null);
  var ref = useRef(null);
  var resizeHandler = useRef(null);
  var onResizeCallback = useRef(onResize);
  useEffect(function () {
    if (skipResize.current === null) {
      skipResize.current = skipOnMount;
    }
  }, [skipOnMount]);

  var _useState = useState({
    width: undefined,
    height: undefined
  }),
      _useState2 = _slicedToArray(_useState, 2),
      size = _useState2[0],
      setSize = _useState2[1];

  useEffect(function () {
    var notifyResizeAsync = createAsyncNotifier(onResizeCallback.current, setSize);

    var createResizeHandler = function createResizeHandler(entries) {
      if (!handleWidth && !handleHeight) return;
      entries.forEach(function (entry) {
        var _ref2 = entry && entry.contentRect || {},
            width = _ref2.width,
            height = _ref2.height;

        var shouldSetSize = !skipResize.current && !isSSR();

        if (shouldSetSize) {
          notifyResizeAsync({
            width: width,
            height: height
          });
        }

        skipResize.current = false;
      });
    };

    var refreshScheduler = getRefreshScheduler(refreshMode);
    resizeHandler.current = refreshScheduler ? refreshScheduler(createResizeHandler, refreshRate, refreshOptions) : createResizeHandler;
    var resizeObserver = new ResizeObserver(resizeHandler.current);
    resizeObserver.observe(ref.current);
    return function () {
      resizeObserver.disconnect();
      notifyResizeAsync.cancel();

      if (resizeHandler.current && resizeHandler.current.cancel) {
        resizeHandler.current.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResizeCallback]);
  return _objectSpread({
    ref: ref
  }, size);
}

export default useResizeDetector;