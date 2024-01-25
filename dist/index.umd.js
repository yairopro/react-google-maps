(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
  (global = global || self, factory(global.reactGoogleMaps = {}, global.React, global.ReactDOM));
})(this, (function (exports, React, reactDom) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : String(i);
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var APILoadingStatus = {
    NOT_LOADED: 'NOT_LOADED',
    LOADING: 'LOADING',
    LOADED: 'LOADED',
    FAILED: 'FAILED',
    AUTH_FAILURE: 'AUTH_FAILURE'
  };

  var _iteratorSymbol$1 = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
  function _settle$1(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact$1) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }
          value = value.v;
        } else {
          value.o = _settle$1.bind(null, pact, state);
          return;
        }
      }
      if (value && value.then) {
        value.then(_settle$1.bind(null, pact, state), _settle$1.bind(null, pact, 2));
        return;
      }
      pact.s = state;
      pact.v = value;
      var observer = pact.o;
      if (observer) {
        observer(pact);
      }
    }
  }
  var _Pact$1 = /*#__PURE__*/function () {
    function _Pact() {}
    _Pact.prototype.then = function (onFulfilled, onRejected) {
      var result = new _Pact();
      var state = this.s;
      if (state) {
        var callback = state & 1 ? onFulfilled : onRejected;
        if (callback) {
          try {
            _settle$1(result, 1, callback(this.v));
          } catch (e) {
            _settle$1(result, 2, e);
          }
          return result;
        } else {
          return this;
        }
      }
      this.o = function (_this) {
        try {
          var value = _this.v;
          if (_this.s & 1) {
            _settle$1(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle$1(result, 1, onRejected(value));
          } else {
            _settle$1(result, 2, value);
          }
        } catch (e) {
          _settle$1(result, 2, e);
        }
      };
      return result;
    };
    return _Pact;
  }();
  function _isSettledPact$1(thenable) {
    return thenable instanceof _Pact$1 && thenable.s & 1;
  }
  function _forTo$1(array, body, check) {
    var i = -1,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);
          if (result && result.then) {
            if (_isSettledPact$1(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle$1.bind(null, pact = new _Pact$1(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle$1(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle$1(pact || (pact = new _Pact$1()), 2, e);
      }
    }
    _cycle();
    return pact;
  }
  var MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/js';
  /**
   * A GoogleMapsApiLoader to reliably load and unload the Google Maps JavaScript API.
   *
   * The actual loading and unloading is delayed into the microtask queue, to
   * allow using the API in an useEffect hook, without worrying about multiple API loads.
   */
  function _forOf$1(target, body, check) {
    if (typeof target[_iteratorSymbol$1] === "function") {
      var iterator = target[_iteratorSymbol$1](),
        step,
        pact,
        reject;
      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);
            if (result && result.then) {
              if (_isSettledPact$1(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle$1.bind(null, pact = new _Pact$1(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle$1(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle$1(pact || (pact = new _Pact$1()), 2, e);
        }
      }
      _cycle();
      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}
          return value;
        };
        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }
        _fixup();
      }
      return pact;
    }
    // No support for Symbol.iterator
    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    }
    // Handle live collections properly
    var values = [];
    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }
    return _forTo$1(values, function (i) {
      return body(values[i]);
    }, check);
  }
  var GoogleMapsApiLoader = /*#__PURE__*/function () {
    function GoogleMapsApiLoader() {}
    /**
     * Loads the Google Maps API with the specified parameters.
     * Since the Maps library can only be loaded once per page, this will
     * produce a warning when called multiple times with different
     * parameters.
     *
     * The returned promise resolves when loading completes
     * and rejects in case of an error or when the loading was aborted.
     */
    GoogleMapsApiLoader.load = function load(params, onLoadingStatusChange) {
      try {
        var _window$google;
        var _this = this;
        var libraries = params.libraries ? params.libraries.split(',') : [];
        var serializedParams = _this.serializeParams(params);
        // note: if google.maps.importLibrary was defined externally, the params
        //   will be ignored. If it was defined by a previous call to this
        //   method, we will check that the key and other parameters have not been
        //   changed in between calls.
        if (!((_window$google = window.google) != null && (_window$google = _window$google.maps) != null && _window$google.importLibrary)) {
          _this.serializedApiParams = serializedParams;
          _this.initImportLibrary(params, onLoadingStatusChange);
        } else {
          // if serializedApiParams isn't defined the library was loaded externally
          // and we can only assume that went alright.
          if (!_this.serializedApiParams) {
            _this.loadingStatus = APILoadingStatus.LOADED;
          }
          onLoadingStatusChange(_this.loadingStatus);
        }
        if (_this.serializedApiParams && _this.serializedApiParams !== serializedParams) {
          console.warn("The maps API has already been loaded with different " + "parameters and will not be loaded again. Refresh the page for " + "new values to have effect.");
        }
        var _temp = _forOf$1(['maps'].concat(libraries), function (lib) {
          return Promise.resolve(google.maps.importLibrary(lib)).then(function () {});
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    GoogleMapsApiLoader.serializeParams = function serializeParams(params) {
      return [params.v, params.key, params.language, params.region, params.authReferrerPolicy, params.solutionChannel].join('/');
    };
    GoogleMapsApiLoader.initImportLibrary = function initImportLibrary(params, onLoadingStatusChange) {
      var _this2 = this;
      if (!window.google) window.google = {};
      if (!window.google.maps) window.google.maps = {};
      if (window.google.maps['importLibrary']) {
        console.warn('initImportLibrary can only be called once.', params);
        return;
      }
      var apiPromise = null;
      var loadApi = function loadApi(library) {
        if (apiPromise) return apiPromise;
        apiPromise = new Promise(function (resolve, reject) {
          var _document$querySelect;
          var scriptElement = document.createElement('script');
          var urlParams = new URLSearchParams();
          for (var _i = 0, _Object$entries = Object.entries(params); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _Object$entries[_i],
              key = _Object$entries$_i[0],
              value = _Object$entries$_i[1];
            var urlParamName = key.replace(/[A-Z]/g, function (t) {
              return '_' + t[0].toLowerCase();
            });
            urlParams.set(urlParamName, value);
          }
          urlParams.set('libraries', library);
          urlParams.set('callback', '__googleMapsCallback__');
          scriptElement.src = MAPS_API_BASE_URL + "?" + urlParams.toString();
          window.__googleMapsCallback__ = function () {
            _this2.loadingStatus = APILoadingStatus.LOADED;
            onLoadingStatusChange(_this2.loadingStatus);
            resolve();
          };
          window.gm_authFailure = function () {
            _this2.loadingStatus = APILoadingStatus.AUTH_FAILURE;
            onLoadingStatusChange(_this2.loadingStatus);
          };
          scriptElement.onerror = function () {
            _this2.loadingStatus = APILoadingStatus.FAILED;
            onLoadingStatusChange(_this2.loadingStatus);
            reject(new Error('The Google Maps JavaScript API could not load.'));
          };
          scriptElement.nonce = ((_document$querySelect = document.querySelector('script[nonce]')) == null ? void 0 : _document$querySelect.nonce) || '';
          _this2.loadingStatus = APILoadingStatus.LOADING;
          onLoadingStatusChange(_this2.loadingStatus);
          document.head.append(scriptElement);
        });
        return apiPromise;
      };
      // for the first load, we declare an importLibrary function that will
      // be overwritten once the api is loaded.
      google.maps.importLibrary = function (libraryName) {
        return loadApi(libraryName).then(function () {
          return google.maps.importLibrary(libraryName);
        });
      };
    };
    return GoogleMapsApiLoader;
  }();
  GoogleMapsApiLoader.loadingStatus = APILoadingStatus.NOT_LOADED;
  GoogleMapsApiLoader.serializedApiParams = void 0;

  var _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }
          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }
      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }
      pact.s = state;
      pact.v = value;
      var observer = pact.o;
      if (observer) {
        observer(pact);
      }
    }
  }
  var _Pact = /*#__PURE__*/function () {
    function _Pact() {}
    _Pact.prototype.then = function (onFulfilled, onRejected) {
      var result = new _Pact();
      var state = this.s;
      if (state) {
        var callback = state & 1 ? onFulfilled : onRejected;
        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }
          return result;
        } else {
          return this;
        }
      }
      this.o = function (_this) {
        try {
          var value = _this.v;
          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };
      return result;
    };
    return _Pact;
  }();
  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }
  function _forTo(array, body, check) {
    var i = -1,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }
    _cycle();
    return pact;
  }
  var _excluded$4 = ["onLoad", "apiKey", "libraries"],
    _excluded2$1 = ["children"];
  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
        step,
        pact,
        reject;
      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);
            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }
      _cycle();
      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}
          return value;
        };
        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }
        _fixup();
      }
      return pact;
    }
    // No support for Symbol.iterator
    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    }
    // Handle live collections properly
    var values = [];
    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }
    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  } /**
     * local hook to set up the map-instance management context.
     */

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  var APIProviderContext = React__default["default"].createContext(null);
  function useMapInstances() {
    var _useState = React.useState({}),
      mapInstances = _useState[0],
      setMapInstances = _useState[1];
    var addMapInstance = function addMapInstance(mapInstance, id) {
      if (id === void 0) {
        id = 'default';
      }
      setMapInstances(function (instances) {
        var _extends2;
        return _extends({}, instances, (_extends2 = {}, _extends2[id] = mapInstance, _extends2));
      });
    };
    var removeMapInstance = function removeMapInstance(id) {
      if (id === void 0) {
        id = 'default';
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setMapInstances(function (_ref) {
        var remaining = _objectWithoutPropertiesLoose(_ref, [id].map(_toPropertyKey));
        return remaining;
      });
    };
    var clearMapInstances = function clearMapInstances() {
      setMapInstances({});
    };
    return {
      mapInstances: mapInstances,
      addMapInstance: addMapInstance,
      removeMapInstance: removeMapInstance,
      clearMapInstances: clearMapInstances
    };
  }
  /**
   * local hook to handle the loading of the maps API, returns the current loading status
   * @param props
   */
  function useGoogleMapsApiLoader(props) {
    var onLoad = props.onLoad,
      apiKey = props.apiKey,
      _props$libraries = props.libraries,
      libraries = _props$libraries === void 0 ? [] : _props$libraries,
      otherApiParams = _objectWithoutPropertiesLoose(props, _excluded$4);
    var _useState2 = React.useState(GoogleMapsApiLoader.loadingStatus),
      status = _useState2[0],
      setStatus = _useState2[1];
    var _useReducer = React.useReducer(function (loadedLibraries, action) {
        var _extends3;
        return _extends({}, loadedLibraries, (_extends3 = {}, _extends3[action.name] = action.value, _extends3));
      }, {}),
      loadedLibraries = _useReducer[0],
      addLoadedLibrary = _useReducer[1];
    var librariesString = React.useMemo(function () {
      return libraries == null ? void 0 : libraries.join(',');
    }, [libraries]);
    var serializedParams = React.useMemo(function () {
      return JSON.stringify(otherApiParams);
    }, [otherApiParams]);
    var importLibrary = React.useCallback(function (name) {
      try {
        var _google;
        if (loadedLibraries[name]) {
          return Promise.resolve(loadedLibraries[name]);
        }
        if (!((_google = google) != null && (_google = _google.maps) != null && _google.importLibrary)) {
          throw new Error('[api-provider-internal] importLibrary was called before ' + 'google.maps.importLibrary was defined.');
        }
        return Promise.resolve(window.google.maps.importLibrary(name)).then(function (res) {
          addLoadedLibrary({
            name: name,
            value: res
          });
          return res;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }, [loadedLibraries]);
    React.useEffect(function () {
      (function () {
        try {
          var _temp3 = _catch(function () {
            return Promise.resolve(GoogleMapsApiLoader.load(_extends({
              key: apiKey,
              libraries: librariesString
            }, otherApiParams), function (status) {
              return setStatus(status);
            })).then(function () {
              function _temp2() {
                if (onLoad) {
                  onLoad();
                }
              }
              var _temp = _forOf(['core', 'maps'].concat(libraries), function (name) {
                return Promise.resolve(importLibrary(name)).then(function () {});
              });
              return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
            });
          }, function (error) {
            console.error('<ApiProvider> failed to load Google Maps API', error);
          });
          return _temp3 && _temp3.then ? _temp3.then(function () {}) : void 0;
        } catch (e) {
          Promise.reject(e);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, librariesString, serializedParams]);
    return {
      status: status,
      loadedLibraries: loadedLibraries,
      importLibrary: importLibrary
    };
  }
  /**
   * Component to wrap the Google Maps React components and load the Google Maps JavaScript API
   */
  var APIProvider = function APIProvider(props) {
    var children = props.children,
      loaderProps = _objectWithoutPropertiesLoose(props, _excluded2$1);
    var _useMapInstances = useMapInstances(),
      mapInstances = _useMapInstances.mapInstances,
      addMapInstance = _useMapInstances.addMapInstance,
      removeMapInstance = _useMapInstances.removeMapInstance,
      clearMapInstances = _useMapInstances.clearMapInstances;
    var _useGoogleMapsApiLoad = useGoogleMapsApiLoader(loaderProps),
      status = _useGoogleMapsApiLoad.status,
      loadedLibraries = _useGoogleMapsApiLoad.loadedLibraries,
      importLibrary = _useGoogleMapsApiLoad.importLibrary;
    return /*#__PURE__*/React__default["default"].createElement(APIProviderContext.Provider, {
      value: {
        mapInstances: mapInstances,
        addMapInstance: addMapInstance,
        removeMapInstance: removeMapInstance,
        clearMapInstances: clearMapInstances,
        status: status,
        loadedLibraries: loadedLibraries,
        importLibrary: importLibrary
      }
    }, children);
  };

  function useApiLoadingStatus() {
    var _useContext;
    return ((_useContext = React.useContext(APIProviderContext)) == null ? void 0 : _useContext.status) || APILoadingStatus.NOT_LOADED;
  }

  /**
   * Hook to check if the Google Maps API is loaded
   */
  function useApiIsLoaded() {
    var status = useApiLoadingStatus();
    return status === APILoadingStatus.LOADED;
  }

  var shownMessages = new Set();
  function logErrorOnce() {
    var args = [].slice.call(arguments);
    var key = JSON.stringify(args);
    if (!shownMessages.has(key)) {
      var _console;
      shownMessages.add(key);
      (_console = console).error.apply(_console, args);
    }
  }

  function useCallbackRef() {
    var _useState = React.useState(null),
      el = _useState[0],
      setEl = _useState[1];
    var ref = React.useCallback(function (value) {
      return setEl(value);
    }, [setEl]);
    return [el, ref];
  }

  /**
   * Creates a mutable ref object to track the last known state of the map camera.
   * This is updated by `trackDispatchedEvent` and used in `useMapOptions`.
   */
  function useInternalCameraState() {
    return React.useRef({
      center: {
        lat: 0,
        lng: 0
      },
      heading: 0,
      tilt: 0,
      zoom: 0
    });
  }
  /**
   * Records camera data from the last event dispatched to the React application
   * in a mutable `IternalCameraStateRef`.
   * This data can then be used to prevent feeding these values back to the
   * map-instance when a typical "controlled component" setup (state variable is
   * fed into and updated by the map).
   */
  function trackDispatchedEvent(ev, cameraStateRef) {
    var cameraEvent = ev;
    // we're only interested in the camera-events here
    if (!cameraEvent.detail.center) return;
    var _cameraEvent$detail = cameraEvent.detail,
      center = _cameraEvent$detail.center,
      zoom = _cameraEvent$detail.zoom,
      heading = _cameraEvent$detail.heading,
      tilt = _cameraEvent$detail.tilt;
    cameraStateRef.current.center = center;
    cameraStateRef.current.heading = heading;
    cameraStateRef.current.tilt = tilt;
    cameraStateRef.current.zoom = zoom;
  }

  /**
   * Sets up effects to bind event-handlers for all event-props in MapEventProps.
   * @internal
   */
  function useMapEvents(map, cameraStateRef, props) {
    var _loop = function _loop() {
      var propName = _step.value;
      // fixme: this cast is essentially a 'trust me, bro' for typescript, but
      //   a proper solution seems way too complicated right now
      var handler = props[propName];
      var eventType = propNameToEventType[propName];
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(function () {
        if (!map) return;
        if (!handler) return;
        var listener = google.maps.event.addListener(map, eventType, function (ev) {
          var mapEvent = createMapEvent(eventType, map, ev);
          trackDispatchedEvent(mapEvent, cameraStateRef);
          handler(mapEvent);
        });
        return function () {
          return listener.remove();
        };
      }, [map, cameraStateRef, eventType, handler]);
    };
    // note: calling a useEffect hook from within a loop is prohibited by the
    // rules of hooks, but it's ok here since it's unconditional and the number
    // and order of iterations is always strictly the same.
    // (see https://legacy.reactjs.org/docs/hooks-rules.html)
    for (var _iterator = _createForOfIteratorHelperLoose(eventPropNames), _step; !(_step = _iterator()).done;) {
      _loop();
    }
  }
  /**
   * Create the wrapped map-events used for the event-props.
   * @param type the event type as it is specified to the maps api
   * @param map the map instance the event originates from
   * @param srcEvent the source-event if there is one.
   */
  function createMapEvent(type, map, srcEvent) {
    var ev = {
      type: type,
      map: map,
      detail: {},
      stoppable: false,
      stop: function stop() {}
    };
    if (cameraEventTypes.includes(type)) {
      var camEvent = ev;
      var center = map.getCenter();
      var zoom = map.getZoom();
      var heading = map.getHeading() || 0;
      var tilt = map.getTilt() || 0;
      var bounds = map.getBounds();
      if (!center || !bounds || !Number.isFinite(zoom)) {
        console.warn('[createEvent] at least one of the values from the map ' + 'returned undefined. This is not expected to happen. Please ' + 'report an issue at https://github.com/visgl/react-google-maps/issues/new');
      }
      camEvent.detail = {
        center: (center == null ? void 0 : center.toJSON()) || {
          lat: 0,
          lng: 0
        },
        zoom: zoom,
        heading: heading,
        tilt: tilt,
        bounds: (bounds == null ? void 0 : bounds.toJSON()) || {
          north: 90,
          east: 180,
          south: -90,
          west: -180
        }
      };
      return camEvent;
    } else if (mouseEventTypes.includes(type)) {
      var _srcEvent$latLng;
      if (!srcEvent) throw new Error('[createEvent] mouse events must provide a srcEvent');
      var mouseEvent = ev;
      mouseEvent.domEvent = srcEvent.domEvent;
      mouseEvent.stoppable = true;
      mouseEvent.stop = function () {
        return srcEvent.stop();
      };
      mouseEvent.detail = {
        latLng: ((_srcEvent$latLng = srcEvent.latLng) == null ? void 0 : _srcEvent$latLng.toJSON()) || null,
        placeId: srcEvent.placeId
      };
      return mouseEvent;
    }
    return ev;
  }
  /**
   * maps the camelCased names of event-props to the corresponding event-types
   * used in the maps API.
   */
  var propNameToEventType = {
    onBoundsChanged: 'bounds_changed',
    onCenterChanged: 'center_changed',
    onClick: 'click',
    onContextmenu: 'contextmenu',
    onDblclick: 'dblclick',
    onDrag: 'drag',
    onDragend: 'dragend',
    onDragstart: 'dragstart',
    onHeadingChanged: 'heading_changed',
    onIdle: 'idle',
    onIsFractionalZoomEnabledChanged: 'isfractionalzoomenabled_changed',
    onMapCapabilitiesChanged: 'mapcapabilities_changed',
    onMapTypeIdChanged: 'maptypeid_changed',
    onMousemove: 'mousemove',
    onMouseout: 'mouseout',
    onMouseover: 'mouseover',
    onProjectionChanged: 'projection_changed',
    onRenderingTypeChanged: 'renderingtype_changed',
    onTilesLoaded: 'tilesloaded',
    onTiltChanged: 'tilt_changed',
    onZoomChanged: 'zoom_changed'
  };
  var cameraEventTypes = ['bounds_changed', 'center_changed', 'heading_changed', 'projection_changed', 'tilt_changed', 'zoom_changed'];
  var mouseEventTypes = ['click', 'contextmenu', 'dblclick', 'mousemove', 'mouseout', 'mouseover'];
  var eventPropNames = Object.keys(propNameToEventType);

  function isLatLngLiteral(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (!('lat' in obj && 'lng' in obj)) return false;
    return Number.isFinite(obj.lat) && Number.isFinite(obj.lng);
  }

  var _excluded$3 = ["center", "zoom", "heading", "tilt"],
    _excluded2 = ["mapId"];
  /**
   * Internal hook to update the map-options and camera parameters when
   * props are changed.
   *
   * @param map the map instance
   * @param cameraStateRef stores the last values seen during dispatch into the
   * react-application in useMapEvents(). We can safely assume that we
   * don't need to feed these values back into the map.
   * @param mapProps the props to update the map-instance with
   * @internal
   */
  function useMapOptions(map, cameraStateRef, mapProps) {
    var rawCenter = mapProps.center,
      zoom = mapProps.zoom,
      heading = mapProps.heading,
      tilt = mapProps.tilt,
      mapOptions = _objectWithoutPropertiesLoose(mapProps, _excluded$3);
    var center = rawCenter ? isLatLngLiteral(rawCenter) ? rawCenter : rawCenter.toJSON() : null;
    var lat = center && center.lat;
    var lng = center && center.lng;
    /* eslint-disable react-hooks/exhaustive-deps --
     *
     * The following effects aren't triggered when the map is changed.
     * In that case, the values will be or have been passed to the map
     * constructor as mapOptions.
     */
    // update the map options when mapOptions is changed
    // Note: due to the destructuring above, mapOptions will be seen as changed
    //   with every re-render, so we're boldly assuming the maps-api will properly
    //   deal with unchanged option-values passed into setOptions.
    React.useEffect(function () {
      if (!map) return;
      // Changing the mapId via setOptions will trigger an error-message.
      // We will re-create the map-instance in that case anyway, so we
      // remove it here to avoid this error-message.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      var opts = _objectWithoutPropertiesLoose(mapOptions, _excluded2);
      map.setOptions(opts);
    }, [mapOptions]);
    React.useLayoutEffect(function () {
      if (!map || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
      if (cameraStateRef.current.center.lat === lat && cameraStateRef.current.center.lng === lng) return;
      map.moveCamera({
        center: {
          lat: lat,
          lng: lng
        }
      });
    }, [lat, lng]);
    React.useLayoutEffect(function () {
      if (!map || !Number.isFinite(zoom)) return;
      if (cameraStateRef.current.zoom === zoom) return;
      map.moveCamera({
        zoom: zoom
      });
    }, [zoom]);
    React.useLayoutEffect(function () {
      if (!map || !Number.isFinite(heading)) return;
      if (cameraStateRef.current.heading === heading) return;
      map.moveCamera({
        heading: heading
      });
    }, [heading]);
    React.useLayoutEffect(function () {
      if (!map || !Number.isFinite(tilt)) return;
      if (cameraStateRef.current.tilt === tilt) return;
      map.moveCamera({
        tilt: tilt
      });
    }, [tilt]);
    /* eslint-enable react-hooks/exhaustive-deps */
  }

  /**
   * Internal hook that updates the camera when deck.gl viewState changes.
   * @internal
   */
  function useDeckGLCameraUpdate(map, viewState) {
    React.useLayoutEffect(function () {
      if (!map || !viewState) {
        return;
      }
      // FIXME: this should probably be extracted into a seperate hook that only
      //  runs once when first seeing a deck.gl viewState update and resets
      //  again. Maybe even use a seperate prop (`<Map controlled />`) instead.
      map.setOptions({
        gestureHandling: 'none',
        keyboardShortcuts: false,
        disableDefaultUI: true
      });
      var latitude = viewState.latitude,
        longitude = viewState.longitude,
        heading = viewState.bearing,
        tilt = viewState.pitch,
        zoom = viewState.zoom;
      map.moveCamera({
        center: {
          lat: latitude,
          lng: longitude
        },
        heading: heading,
        tilt: tilt,
        zoom: zoom + 1
      });
    }, [map, viewState]);
  }

  var _excluded$2 = ["id", "initialBounds"];
  var GoogleMapsContext = React__default["default"].createContext(null);
  /**
   * Component to render a Google Maps map
   */
  var Map = function Map(props) {
    var children = props.children,
      id = props.id,
      className = props.className,
      style = props.style,
      viewState = props.viewState,
      viewport = props.viewport;
    var context = React.useContext(APIProviderContext);
    var loadingStatus = useApiLoadingStatus();
    if (!context) {
      throw new Error('<Map> can only be used inside an <ApiProvider> component.');
    }
    var _useMapInstance = useMapInstance(props, context),
      map = _useMapInstance[0],
      mapRef = _useMapInstance[1];
    var cameraStateRef = useInternalCameraState();
    useMapOptions(map, cameraStateRef, props);
    useMapEvents(map, cameraStateRef, props);
    useDeckGLCameraUpdate(map, viewState);
    var isViewportSet = React.useMemo(function () {
      return Boolean(viewport);
    }, [viewport]);
    var combinedStyle = React.useMemo(function () {
      return _extends({
        width: '100%',
        height: '100%',
        // when using deckgl, the map should be sent to the back
        zIndex: isViewportSet ? -1 : 0
      }, style);
    }, [style, isViewportSet]);
    if (loadingStatus === APILoadingStatus.AUTH_FAILURE) {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        style: _extends({
          position: 'relative'
        }, className ? {} : combinedStyle),
        className: className
      }, /*#__PURE__*/React__default["default"].createElement(AuthFailureMessage, null));
    }
    return /*#__PURE__*/React__default["default"].createElement("div", _extends({
      ref: mapRef,
      "data-testid": 'map',
      style: className ? undefined : combinedStyle,
      className: className
    }, id ? {
      id: id
    } : {}), map ? /*#__PURE__*/React__default["default"].createElement(GoogleMapsContext.Provider, {
      value: {
        map: map
      }
    }, children) : null);
  };
  Map.deckGLViewProps = true;
  var AuthFailureMessage = function AuthFailureMessage() {
    var style = {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 999,
      display: 'flex',
      flexFlow: 'column nowrap',
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: '.8rem',
      color: 'rgba(0,0,0,0.6)',
      background: '#dddddd',
      padding: '1rem 1.5rem'
    };
    return /*#__PURE__*/React__default["default"].createElement("div", {
      style: style
    }, /*#__PURE__*/React__default["default"].createElement("h2", null, "Error: AuthFailure"), /*#__PURE__*/React__default["default"].createElement("p", null, "A problem with your API key prevents the map from rendering correctly. Please make sure the value of the ", /*#__PURE__*/React__default["default"].createElement("code", null, "APIProvider.apiKey"), " prop is correct. Check the error-message in the console for further details."));
  };
  /**
   * The main hook takes care of creating map-instances and registering them in
   * the api-provider context.
   * @return a tuple of the map-instance created (or null) and the callback
   *   ref that will be used to pass the map-container into this hook.
   * @internal
   */
  function useMapInstance(props, context) {
    var apiIsLoaded = useApiIsLoaded();
    var _useState = React.useState(null),
      map = _useState[0],
      setMap = _useState[1];
    var _useCallbackRef = useCallbackRef(),
      container = _useCallbackRef[0],
      containerRef = _useCallbackRef[1];
    var id = props.id,
      initialBounds = props.initialBounds,
      mapOptions = _objectWithoutPropertiesLoose(props, _excluded$2);
    // create the map instance and register it in the context
    React.useEffect(function () {
      if (!container || !apiIsLoaded) return;
      var addMapInstance = context.addMapInstance,
        removeMapInstance = context.removeMapInstance;
      var newMap = new google.maps.Map(container, mapOptions);
      setMap(newMap);
      addMapInstance(newMap, id);
      if (initialBounds) {
        newMap.fitBounds(initialBounds);
      }
      return function () {
        if (!container || !apiIsLoaded) return;
        // remove all event-listeners to minimize memory-leaks
        google.maps.event.clearInstanceListeners(newMap);
        setMap(null);
        removeMapInstance(id);
      };
    },
    // FIXME: we should rethink if it could be possible to keep the state
    //   around when a map gets re-initialized (id or mapId changed). This
    //   should keep the viewport as it is (so also no initial viewport in
    //   this case) and any added features should of course get re-added as
    //   well.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, container, apiIsLoaded, props.mapId]);
    // report an error if the same map-id is used multiple times
    React.useEffect(function () {
      if (!id) return;
      var mapInstances = context.mapInstances;
      if (mapInstances[id] && mapInstances[id] !== map) {
        logErrorOnce("The map id '" + id + "' seems to have been used multiple times. " + 'This can lead to unexpected problems when accessing the maps. ' + 'Please use unique ids for all <Map> components.');
      }
    }, [id, context, map]);
    return [map, containerRef];
  }

  function useMapsLibrary(name) {
    var apiIsLoaded = useApiIsLoaded();
    var ctx = React.useContext(APIProviderContext);
    React.useEffect(function () {
      if (!apiIsLoaded || !ctx) return;
      // Trigger loading the libraries via our proxy-method.
      // The returned promise is ignored, since importLibrary will update loadedLibraries
      // list in the context, triggering a re-render.
      void ctx.importLibrary(name);
    }, [apiIsLoaded, ctx == null ? void 0 : ctx.importLibrary]);
    return (ctx == null ? void 0 : ctx.loadedLibraries[name]) || null;
  }

  /* eslint-disable complexity */
  var AdvancedMarkerContext = React__default["default"].createContext(null);
  function useAdvancedMarker(props) {
    var _useContext;
    var _useState = React.useState(null),
      marker = _useState[0],
      setMarker = _useState[1];
    var _useState2 = React.useState(null),
      contentContainer = _useState2[0],
      setContentContainer = _useState2[1];
    var map = (_useContext = React.useContext(GoogleMapsContext)) == null ? void 0 : _useContext.map;
    var markerLibrary = useMapsLibrary('marker');
    var children = props.children,
      className = props.className,
      onClick = props.onClick,
      onDrag = props.onDrag,
      onDragStart = props.onDragStart,
      onDragEnd = props.onDragEnd,
      collisionBehavior = props.collisionBehavior,
      draggable = props.draggable,
      position = props.position,
      title = props.title,
      zIndex = props.zIndex;
    var numChilds = React.Children.count(children);
    // create marker instance and add it to the map when map becomes available
    React.useEffect(function () {
      if (!map || !markerLibrary) return;
      var newMarker = new markerLibrary.AdvancedMarkerElement();
      newMarker.map = map;
      setMarker(newMarker);
      // create container for marker content if there are children
      if (numChilds > 0) {
        var el = document.createElement('div');
        if (className) el.className = className;
        newMarker.content = el;
        setContentContainer(el);
      }
      return function () {
        newMarker.map = null;
        setMarker(null);
        setContentContainer(null);
      };
    }, [map, markerLibrary, numChilds]);
    // bind all marker events
    React.useEffect(function () {
      if (!marker) return;
      var gme = google.maps.event;
      if (onClick) gme.addListener(marker, 'click', onClick);
      if (onDrag) gme.addListener(marker, 'drag', onDrag);
      if (onDragStart) gme.addListener(marker, 'dragstart', onDragStart);
      if (onDragEnd) gme.addListener(marker, 'dragend', onDragEnd);
      if ((onDrag || onDragStart || onDragEnd) && !draggable) {
        console.warn('You need to set the marker to draggable to listen to drag-events.');
      }
      var m = marker;
      return function () {
        gme.clearInstanceListeners(m);
      };
    }, [marker, draggable, onClick, onDragStart, onDrag, onDragEnd]);
    // update other marker props when changed
    React.useEffect(function () {
      if (!marker) return;
      if (position !== undefined) marker.position = position;
      if (draggable !== undefined) marker.gmpDraggable = draggable;
      if (collisionBehavior !== undefined) marker.collisionBehavior = collisionBehavior;
      if (zIndex !== undefined) marker.zIndex = zIndex;
      if (typeof title === 'string') marker.title = title;
    }, [marker, position, draggable, collisionBehavior, zIndex, title]);
    return [marker, contentContainer];
  }
  var AdvancedMarker = React.forwardRef(function (props, ref) {
    var children = props.children;
    var _useAdvancedMarker = useAdvancedMarker(props),
      marker = _useAdvancedMarker[0],
      contentContainer = _useAdvancedMarker[1];
    React.useImperativeHandle(ref, function () {
      return marker;
    }, [marker]);
    if (!marker) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement(AdvancedMarkerContext.Provider, {
      value: {
        marker: marker
      }
    }, contentContainer !== null && reactDom.createPortal(children, contentContainer));
  });
  function useAdvancedMarkerRef() {
    var _useState3 = React.useState(null),
      marker = _useState3[0],
      setMarker = _useState3[1];
    var refCallback = React.useCallback(function (m) {
      setMarker(m);
    }, []);
    return [refCallback, marker];
  }

  var _excluded$1 = ["children", "anchor", "onCloseClick"];
  /**
   * Component to render a Google Maps Info Window
   */
  var InfoWindow = function InfoWindow(props) {
    var _useContext;
    var children = props.children,
      anchor = props.anchor,
      onCloseClick = props.onCloseClick,
      infoWindowOptions = _objectWithoutPropertiesLoose(props, _excluded$1);
    var map = (_useContext = React.useContext(GoogleMapsContext)) == null ? void 0 : _useContext.map;
    var _useState = React.useState(null),
      contentContainer = _useState[0],
      setContentContainer = _useState[1];
    // create infowindow once map is available
    React.useEffect(function () {
      if (!map) return;
      var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
      // Add content to info window
      var el = document.createElement('div');
      infoWindow.setContent(el);
      infoWindow.open({
        map: map,
        anchor: anchor
      });
      if (onCloseClick) {
        google.maps.event.addListener(infoWindow, 'closeclick', function () {
          onCloseClick();
        });
      }
      setContentContainer(el);
      // Cleanup info window and event listeners on unmount
      return function () {
        google.maps.event.clearInstanceListeners(infoWindow);
        infoWindow.close();
        el.remove();
        setContentContainer(null);
      };
    }, [map, children, anchor]);
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, contentContainer !== null && reactDom.createPortal(children, contentContainer));
  };

  /**
   * Retrieves a map-instance from the context. This is either an instance
   * identified by id or the parent map instance if no id is specified.
   * Returns null if neither can be found.
   */
  var useMap = function useMap(id) {
    if (id === void 0) {
      id = null;
    }
    var ctx = React.useContext(APIProviderContext);
    var _ref = React.useContext(GoogleMapsContext) || {},
      map = _ref.map;
    if (ctx === null) {
      logErrorOnce('useMap(): failed to retrieve APIProviderContext. ' + 'Make sure that the <APIProvider> component exists and that the ' + 'component you are calling `useMap()` from is a sibling of the ' + '<APIProvider>.');
      return null;
    }
    var mapInstances = ctx.mapInstances;
    // if an id is specified, the corresponding map or null is returned
    if (id !== null) return mapInstances[id] || null;
    // otherwise, return the closest ancestor
    if (map) return map;
    // finally, return the default map instance
    return mapInstances['default'] || null;
  };

  /**
   * Copy of the `google.maps.ControlPosition` constants.
   * They have to be duplicated here since we can't wait for the maps API to load to be able to use them.
   */
  var ControlPosition = {
    TOP_LEFT: 1,
    TOP_CENTER: 2,
    TOP: 2,
    TOP_RIGHT: 3,
    LEFT_CENTER: 4,
    LEFT_TOP: 5,
    LEFT: 5,
    LEFT_BOTTOM: 6,
    RIGHT_TOP: 7,
    RIGHT: 7,
    RIGHT_CENTER: 8,
    RIGHT_BOTTOM: 9,
    BOTTOM_LEFT: 10,
    BOTTOM_CENTER: 11,
    BOTTOM: 11,
    BOTTOM_RIGHT: 12,
    CENTER: 13,
    BLOCK_START_INLINE_START: 14,
    BLOCK_START_INLINE_CENTER: 15,
    BLOCK_START_INLINE_END: 16,
    INLINE_START_BLOCK_CENTER: 17,
    INLINE_START_BLOCK_START: 18,
    INLINE_START_BLOCK_END: 19,
    INLINE_END_BLOCK_START: 20,
    INLINE_END_BLOCK_CENTER: 21,
    INLINE_END_BLOCK_END: 22,
    BLOCK_END_INLINE_START: 23,
    BLOCK_END_INLINE_CENTER: 24,
    BLOCK_END_INLINE_END: 25
  };
  var MapControl = function MapControl(_ref) {
    var children = _ref.children,
      position = _ref.position;
    var controlContainer = React.useMemo(function () {
      return document.createElement('div');
    }, []);
    var map = useMap();
    React.useEffect(function () {
      if (!map) return;
      var controls = map.controls[position];
      controls.push(controlContainer);
      return function () {
        var index = controls.getArray().indexOf(controlContainer);
        controls.removeAt(index);
      };
    }, [map, position]);
    return reactDom.createPortal(children, controlContainer);
  };

  var _excluded = ["onClick", "onDrag", "onDragStart", "onDragEnd", "onMouseOver", "onMouseOut"];
  function useMarker(props) {
    var _useContext;
    var _useState = React.useState(null),
      marker = _useState[0],
      setMarker = _useState[1];
    var map = (_useContext = React.useContext(GoogleMapsContext)) == null ? void 0 : _useContext.map;
    var onClick = props.onClick,
      onDrag = props.onDrag,
      onDragStart = props.onDragStart,
      onDragEnd = props.onDragEnd,
      onMouseOver = props.onMouseOver,
      onMouseOut = props.onMouseOut,
      markerOptions = _objectWithoutPropertiesLoose(props, _excluded);
    var position = markerOptions.position,
      draggable = markerOptions.draggable;
    // create marker instance and add to the map once the map is available
    React.useEffect(function () {
      if (!map) {
        if (map === undefined) console.error('<Marker> has to be inside a Map component.');
        return;
      }
      var newMarker = new google.maps.Marker(markerOptions);
      newMarker.setMap(map);
      setMarker(newMarker);
      return function () {
        newMarker.setMap(null);
        setMarker(null);
      };
    }, [map]);
    // attach and re-attach event-handlers when any of the properties change
    React.useEffect(function () {
      if (!marker) return;
      var m = marker;
      // Add event listeners
      var gme = google.maps.event;
      if (onClick) gme.addListener(m, 'click', onClick);
      if (onDrag) gme.addListener(m, 'drag', onDrag);
      if (onDragStart) gme.addListener(m, 'dragstart', onDragStart);
      if (onDragEnd) gme.addListener(m, 'dragend', onDragEnd);
      if (onMouseOver) gme.addListener(m, 'mouseover', onMouseOver);
      if (onMouseOut) gme.addListener(m, 'mouseout', onMouseOut);
      marker.setDraggable(Boolean(draggable));
      return function () {
        gme.clearInstanceListeners(m);
      };
    }, [marker, draggable, onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut]);
    // update markerOptions (note the dependencies aren't properly checked
    // here, we just assume that setOptions is smart enough to not waste a
    // lot of time updating values that didn't change)
    React.useEffect(function () {
      if (!marker) return;
      if (markerOptions) marker.setOptions(markerOptions);
    }, [marker, markerOptions]);
    // update position when changed
    React.useEffect(function () {
      // Should not update position when draggable
      if (draggable || !position || !marker) return;
      marker.setPosition(position);
    }, [draggable, position, marker]);
    return marker;
  }
  /**
   * Component to render a Google Maps Marker on a map
   */
  var Marker = React.forwardRef(function (props, ref) {
    var marker = useMarker(props);
    React.useImperativeHandle(ref, function () {
      return marker;
    }, [marker]);
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null);
  });
  function useMarkerRef() {
    var _useState2 = React.useState(null),
      marker = _useState2[0],
      setMarker = _useState2[1];
    var refCallback = React.useCallback(function (m) {
      setMarker(m);
    }, []);
    return [refCallback, marker];
  }

  /**
   * Component to render a google maps marker Pin View
   */
  var Pin = function Pin(props) {
    var _useContext;
    var advancedMarker = (_useContext = React.useContext(AdvancedMarkerContext)) == null ? void 0 : _useContext.marker;
    var glyphContainer = React.useMemo(function () {
      return document.createElement('div');
    }, []);
    // Create Pin View instance
    React.useEffect(function () {
      if (!advancedMarker) {
        if (advancedMarker === undefined) {
          console.error('The <Pin> component can only be used inside <AdvancedMarker>.');
        }
        return;
      }
      if (props.glyph && props.children) {
        logErrorOnce('The <Pin> component only uses children to render the glyph if both the glyph property and children are present.');
      }
      if (React.Children.count(props.children) > 1) {
        logErrorOnce('Passing multiple children to the <Pin> component might lead to unexpected results.');
      }
      var pinViewOptions = _extends({}, props);
      var pinElement = new google.maps.marker.PinElement(pinViewOptions);
      // Set glyph to glyph container if children are present (rendered via portal).
      // If both props.glyph and props.children are present, props.children takes priority.
      if (props.children) {
        pinElement.glyph = glyphContainer;
      }
      // Set content of Advanced Marker View to the Pin View element
      advancedMarker.content = pinElement.element;
    }, [advancedMarker, props]);
    return reactDom.createPortal(props.children, glyphContainer);
  };

  /**
   * Hook to get a Google Maps Places Autocomplete instance
   * monitoring an input field
   */
  var useAutocomplete = function useAutocomplete(props) {
    var inputField = props.inputField,
      options = props.options,
      onPlaceChanged = props.onPlaceChanged;
    var googleMapsAPIIsLoaded = useApiIsLoaded();
    var placeChangedHandler = React.useRef(onPlaceChanged);
    var _useState = React.useState(null),
      autocomplete = _useState[0],
      setAutocomplete = _useState[1];
    // Initializes the Google Maps Places Autocomplete
    React.useEffect(function () {
      // Wait for the Google Maps API and input element to be initialized
      if (!googleMapsAPIIsLoaded || !inputField) return;
      // FIXME: add dynamic loading for required libraries
      if (!google.maps.places) {
        console.error('Google Maps Places library is missing. ' + 'Please add the places library to the props of the <ApiProvider> ' + 'component.');
        return;
      }
      // Create Autocomplete instance
      var autocompleteInstance = new google.maps.places.Autocomplete(inputField, options);
      setAutocomplete(autocompleteInstance);
      // Add places change listener to Autocomplete
      autocompleteInstance.addListener('place_changed', function () {
        var place = autocompleteInstance.getPlace();
        if (placeChangedHandler.current) placeChangedHandler.current(place);
      });
      // Clear listeners on unmount
      return function () {
        if (autocompleteInstance && typeof google.maps === 'object') {
          google.maps.event.clearInstanceListeners(autocompleteInstance);
        }
      };
    }, [googleMapsAPIIsLoaded, inputField, options]);
    return autocomplete;
  };

  /**
   * A typescript assertion function used in cases where typescript has to be
   * convinced that the object in question can not be null.
   *
   * @param value
   * @param message
   */
  function assertNotNull(value, message) {
    if (message === void 0) {
      message = 'assertion failed';
    }
    if (value === null || value === undefined) {
      throw Error(message);
    }
  }

  var useDirectionsRenderer = function useDirectionsRenderer(mapId, renderOnMap, renderOptions) {
    var map = useMap(mapId);
    // create the renderer instance
    var directionsRenderer = React.useMemo(function () {
      if (!map || !renderOnMap) return null;
      var renderer = new google.maps.DirectionsRenderer(renderOptions);
      renderer.setMap(map);
      return renderer;
    },
    // note: no dependency on renderOptions since those are handled in the
    // next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, renderOnMap]);
    React.useEffect(function () {
      if (!directionsRenderer) return;
      directionsRenderer.setOptions(renderOptions || {});
    },
    // note: directionsRenderer dependency isn't needed since the
    // renderOptions will be set on initialization when creating the renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderOptions]);
    return directionsRenderer;
  };
  /**
   * Hook to get Google Maps Places Directions Service instance
   */
  var useDirectionsService = function useDirectionsService(props) {
    if (props === void 0) {
      props = {};
    }
    var _props = props,
      _props$mapId = _props.mapId,
      mapId = _props$mapId === void 0 ? null : _props$mapId,
      renderOnMap = _props.renderOnMap,
      renderOptions = _props.renderOptions;
    var isApiLoaded = useApiIsLoaded();
    // Creates a Directions Service instance
    var directionsService = React.useMemo(function () {
      // Wait for Google Maps API to be loaded
      if (!isApiLoaded) return null;
      return new google.maps.DirectionsService();
    }, [isApiLoaded]);
    // create the renderer instance
    var directionsRenderer = useDirectionsRenderer(mapId, renderOnMap, renderOptions);
    // Custom Directions route request followed by directions rendering
    var renderRoute = React.useCallback(function (request) {
      try {
        // findAndRenderRoute() isn't callable when either directions
        // service or renderer aren't ready
        assertNotNull(directionsService);
        assertNotNull(directionsRenderer);
        return Promise.resolve(directionsService.route(request)).then(function (result) {
          directionsRenderer.setDirections(result);
          return result;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }, [directionsService, directionsRenderer]);
    // Renders directions route of given index
    var setRenderedRouteIndex = function setRenderedRouteIndex(index) {
      assertNotNull(directionsRenderer);
      directionsRenderer.setRouteIndex(index);
    };
    return {
      directionsService: directionsService,
      directionsRenderer: directionsRenderer,
      renderRoute: directionsService && directionsRenderer ? renderRoute : null,
      setRenderedRouteIndex: directionsService && directionsRenderer ? setRenderedRouteIndex : null
    };
  };

  /* eslint-disable complexity */
  /**
   * Hook to get Street View Panorama
   */
  var useStreetViewPanorama = function useStreetViewPanorama(props) {
    if (props === void 0) {
      props = {};
    }
    var _props = props,
      mapId = _props.mapId,
      divElement = _props.divElement,
      position = _props.position,
      pov = _props.pov,
      zoom = _props.zoom;
    var googleMapsAPIIsLoaded = useApiIsLoaded();
    var map = useMap(mapId);
    var _useState = React.useState(null),
      streetViewPanorama = _useState[0],
      setStreetViewPanorama = _useState[1];
    // Creates a Street View instance
    React.useEffect(function () {
      if (!googleMapsAPIIsLoaded) return;
      var pano = null;
      if (divElement) {
        pano = new google.maps.StreetViewPanorama(divElement);
      } else if (map) {
        pano = map.getStreetView();
      }
      setStreetViewPanorama(pano);
      if (!pano) return;
      if (pov) pano.setPov(pov);
      if (position) pano.setPosition(position);
      if (zoom || zoom === 0) pano.setZoom(zoom);
      return function () {
        setStreetViewPanorama(null);
        if (map) map.setStreetView(null);
      };
    },
    // fixme: implement extra hook to update FOV when props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [googleMapsAPIIsLoaded, map, divElement]);
    return streetViewPanorama;
  };

  var mapLinear = function mapLinear(x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  };
  var getMapMaxTilt = function getMapMaxTilt(zoom) {
    if (zoom <= 10) {
      return 30;
    }
    if (zoom >= 15.5) {
      return 67.5;
    }
    // range [10...14]
    if (zoom <= 14) {
      return mapLinear(zoom, 10, 14, 30, 45);
    }
    // range [14...15.5]
    return mapLinear(zoom, 14, 15.5, 45, 67.5);
  };
  /**
   * Function to limit the tilt range of the google maps map when updating the view state
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var limitTiltRange = function limitTiltRange(_ref) {
    var viewState = _ref.viewState;
    var pitch = viewState.pitch;
    var gmZoom = viewState.zoom + 1;
    var maxTilt = getMapMaxTilt(gmZoom);
    return _extends({}, viewState, {
      fovy: 25,
      pitch: Math.min(maxTilt, pitch)
    });
  };

  exports.APIProvider = APIProvider;
  exports.APIProviderContext = APIProviderContext;
  exports.AdvancedMarker = AdvancedMarker;
  exports.AdvancedMarkerContext = AdvancedMarkerContext;
  exports.ControlPosition = ControlPosition;
  exports.GoogleMapsContext = GoogleMapsContext;
  exports.InfoWindow = InfoWindow;
  exports.Map = Map;
  exports.MapControl = MapControl;
  exports.Marker = Marker;
  exports.Pin = Pin;
  exports.limitTiltRange = limitTiltRange;
  exports.useAdvancedMarkerRef = useAdvancedMarkerRef;
  exports.useApiIsLoaded = useApiIsLoaded;
  exports.useApiLoadingStatus = useApiLoadingStatus;
  exports.useAutocomplete = useAutocomplete;
  exports.useDirectionsService = useDirectionsService;
  exports.useMap = useMap;
  exports.useMapsLibrary = useMapsLibrary;
  exports.useMarkerRef = useMarkerRef;
  exports.useStreetViewPanorama = useStreetViewPanorama;

}));
//# sourceMappingURL=index.umd.js.map