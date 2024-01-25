import React, { useState, useReducer, useMemo, useCallback, useEffect, useContext, useRef, useLayoutEffect, forwardRef, useImperativeHandle, Children } from 'react';
import { createPortal } from 'react-dom';

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

const APILoadingStatus = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  FAILED: 'FAILED',
  AUTH_FAILURE: 'AUTH_FAILURE'
};

const MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/js';
/**
 * A GoogleMapsApiLoader to reliably load and unload the Google Maps JavaScript API.
 *
 * The actual loading and unloading is delayed into the microtask queue, to
 * allow using the API in an useEffect hook, without worrying about multiple API loads.
 */
class GoogleMapsApiLoader {
  /**
   * Loads the Google Maps API with the specified parameters.
   * Since the Maps library can only be loaded once per page, this will
   * produce a warning when called multiple times with different
   * parameters.
   *
   * The returned promise resolves when loading completes
   * and rejects in case of an error or when the loading was aborted.
   */
  static async load(params, onLoadingStatusChange) {
    var _window$google;
    const libraries = params.libraries ? params.libraries.split(',') : [];
    const serializedParams = this.serializeParams(params);
    // note: if google.maps.importLibrary was defined externally, the params
    //   will be ignored. If it was defined by a previous call to this
    //   method, we will check that the key and other parameters have not been
    //   changed in between calls.
    if (!((_window$google = window.google) != null && (_window$google = _window$google.maps) != null && _window$google.importLibrary)) {
      this.serializedApiParams = serializedParams;
      this.initImportLibrary(params, onLoadingStatusChange);
    } else {
      // if serializedApiParams isn't defined the library was loaded externally
      // and we can only assume that went alright.
      if (!this.serializedApiParams) {
        this.loadingStatus = APILoadingStatus.LOADED;
      }
      onLoadingStatusChange(this.loadingStatus);
    }
    if (this.serializedApiParams && this.serializedApiParams !== serializedParams) {
      console.warn(`The maps API has already been loaded with different ` + `parameters and will not be loaded again. Refresh the page for ` + `new values to have effect.`);
    }
    for (const lib of ['maps', ...libraries]) {
      await google.maps.importLibrary(lib);
    }
  }
  static serializeParams(params) {
    return [params.v, params.key, params.language, params.region, params.authReferrerPolicy, params.solutionChannel].join('/');
  }
  static initImportLibrary(params, onLoadingStatusChange) {
    if (!window.google) window.google = {};
    if (!window.google.maps) window.google.maps = {};
    if (window.google.maps['importLibrary']) {
      console.warn('initImportLibrary can only be called once.', params);
      return;
    }
    let apiPromise = null;
    const loadApi = library => {
      if (apiPromise) return apiPromise;
      apiPromise = new Promise((resolve, reject) => {
        var _document$querySelect;
        const scriptElement = document.createElement('script');
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          const urlParamName = key.replace(/[A-Z]/g, t => '_' + t[0].toLowerCase());
          urlParams.set(urlParamName, value);
        }
        urlParams.set('libraries', library);
        urlParams.set('callback', '__googleMapsCallback__');
        scriptElement.src = MAPS_API_BASE_URL + `?` + urlParams.toString();
        window.__googleMapsCallback__ = () => {
          this.loadingStatus = APILoadingStatus.LOADED;
          onLoadingStatusChange(this.loadingStatus);
          resolve();
        };
        window.gm_authFailure = () => {
          this.loadingStatus = APILoadingStatus.AUTH_FAILURE;
          onLoadingStatusChange(this.loadingStatus);
        };
        scriptElement.onerror = () => {
          this.loadingStatus = APILoadingStatus.FAILED;
          onLoadingStatusChange(this.loadingStatus);
          reject(new Error('The Google Maps JavaScript API could not load.'));
        };
        scriptElement.nonce = ((_document$querySelect = document.querySelector('script[nonce]')) == null ? void 0 : _document$querySelect.nonce) || '';
        this.loadingStatus = APILoadingStatus.LOADING;
        onLoadingStatusChange(this.loadingStatus);
        document.head.append(scriptElement);
      });
      return apiPromise;
    };
    // for the first load, we declare an importLibrary function that will
    // be overwritten once the api is loaded.
    google.maps.importLibrary = libraryName => loadApi(libraryName).then(() => google.maps.importLibrary(libraryName));
  }
}
GoogleMapsApiLoader.loadingStatus = APILoadingStatus.NOT_LOADED;
GoogleMapsApiLoader.serializedApiParams = void 0;

const _excluded$4 = ["onLoad", "apiKey", "libraries"],
  _excluded2$1 = ["children"];
const APIProviderContext = React.createContext(null);
/**
 * local hook to set up the map-instance management context.
 */
function useMapInstances() {
  const [mapInstances, setMapInstances] = useState({});
  const addMapInstance = (mapInstance, id = 'default') => {
    setMapInstances(instances => _extends({}, instances, {
      [id]: mapInstance
    }));
  };
  const removeMapInstance = (id = 'default') => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMapInstances(_ref => {
      let remaining = _objectWithoutPropertiesLoose(_ref, [id].map(_toPropertyKey));
      return remaining;
    });
  };
  const clearMapInstances = () => {
    setMapInstances({});
  };
  return {
    mapInstances,
    addMapInstance,
    removeMapInstance,
    clearMapInstances
  };
}
/**
 * local hook to handle the loading of the maps API, returns the current loading status
 * @param props
 */
function useGoogleMapsApiLoader(props) {
  const {
      onLoad,
      apiKey,
      libraries = []
    } = props,
    otherApiParams = _objectWithoutPropertiesLoose(props, _excluded$4);
  const [status, setStatus] = useState(GoogleMapsApiLoader.loadingStatus);
  const [loadedLibraries, addLoadedLibrary] = useReducer((loadedLibraries, action) => {
    return _extends({}, loadedLibraries, {
      [action.name]: action.value
    });
  }, {});
  const librariesString = useMemo(() => libraries == null ? void 0 : libraries.join(','), [libraries]);
  const serializedParams = useMemo(() => JSON.stringify(otherApiParams), [otherApiParams]);
  const importLibrary = useCallback(async name => {
    var _google;
    if (loadedLibraries[name]) {
      return loadedLibraries[name];
    }
    if (!((_google = google) != null && (_google = _google.maps) != null && _google.importLibrary)) {
      throw new Error('[api-provider-internal] importLibrary was called before ' + 'google.maps.importLibrary was defined.');
    }
    const res = await window.google.maps.importLibrary(name);
    addLoadedLibrary({
      name,
      value: res
    });
    return res;
  }, [loadedLibraries]);
  useEffect(() => {
    (async () => {
      try {
        await GoogleMapsApiLoader.load(_extends({
          key: apiKey,
          libraries: librariesString
        }, otherApiParams), status => setStatus(status));
        for (const name of ['core', 'maps', ...libraries]) {
          await importLibrary(name);
        }
        if (onLoad) {
          onLoad();
        }
      } catch (error) {
        console.error('<ApiProvider> failed to load Google Maps API', error);
      }
    })();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [apiKey, librariesString, serializedParams]);
  return {
    status,
    loadedLibraries,
    importLibrary
  };
}
/**
 * Component to wrap the Google Maps React components and load the Google Maps JavaScript API
 */
const APIProvider = props => {
  const {
      children
    } = props,
    loaderProps = _objectWithoutPropertiesLoose(props, _excluded2$1);
  const {
    mapInstances,
    addMapInstance,
    removeMapInstance,
    clearMapInstances
  } = useMapInstances();
  const {
    status,
    loadedLibraries,
    importLibrary
  } = useGoogleMapsApiLoader(loaderProps);
  return /*#__PURE__*/React.createElement(APIProviderContext.Provider, {
    value: {
      mapInstances,
      addMapInstance,
      removeMapInstance,
      clearMapInstances,
      status,
      loadedLibraries,
      importLibrary
    }
  }, children);
};

function useApiLoadingStatus() {
  var _useContext;
  return ((_useContext = useContext(APIProviderContext)) == null ? void 0 : _useContext.status) || APILoadingStatus.NOT_LOADED;
}

/**
 * Hook to check if the Google Maps API is loaded
 */
function useApiIsLoaded() {
  const status = useApiLoadingStatus();
  return status === APILoadingStatus.LOADED;
}

const shownMessages = new Set();
function logErrorOnce(...args) {
  const key = JSON.stringify(args);
  if (!shownMessages.has(key)) {
    shownMessages.add(key);
    console.error(...args);
  }
}

function useCallbackRef() {
  const [el, setEl] = useState(null);
  const ref = useCallback(value => setEl(value), [setEl]);
  return [el, ref];
}

/**
 * Creates a mutable ref object to track the last known state of the map camera.
 * This is updated by `trackDispatchedEvent` and used in `useMapOptions`.
 */
function useInternalCameraState() {
  return useRef({
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
  const cameraEvent = ev;
  // we're only interested in the camera-events here
  if (!cameraEvent.detail.center) return;
  const {
    center,
    zoom,
    heading,
    tilt
  } = cameraEvent.detail;
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
  // note: calling a useEffect hook from within a loop is prohibited by the
  // rules of hooks, but it's ok here since it's unconditional and the number
  // and order of iterations is always strictly the same.
  // (see https://legacy.reactjs.org/docs/hooks-rules.html)
  for (const propName of eventPropNames) {
    // fixme: this cast is essentially a 'trust me, bro' for typescript, but
    //   a proper solution seems way too complicated right now
    const handler = props[propName];
    const eventType = propNameToEventType[propName];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!map) return;
      if (!handler) return;
      const listener = google.maps.event.addListener(map, eventType, ev => {
        const mapEvent = createMapEvent(eventType, map, ev);
        trackDispatchedEvent(mapEvent, cameraStateRef);
        handler(mapEvent);
      });
      return () => listener.remove();
    }, [map, cameraStateRef, eventType, handler]);
  }
}
/**
 * Create the wrapped map-events used for the event-props.
 * @param type the event type as it is specified to the maps api
 * @param map the map instance the event originates from
 * @param srcEvent the source-event if there is one.
 */
function createMapEvent(type, map, srcEvent) {
  const ev = {
    type,
    map,
    detail: {},
    stoppable: false,
    stop: () => {}
  };
  if (cameraEventTypes.includes(type)) {
    const camEvent = ev;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const heading = map.getHeading() || 0;
    const tilt = map.getTilt() || 0;
    const bounds = map.getBounds();
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
    const mouseEvent = ev;
    mouseEvent.domEvent = srcEvent.domEvent;
    mouseEvent.stoppable = true;
    mouseEvent.stop = () => srcEvent.stop();
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
const propNameToEventType = {
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
const cameraEventTypes = ['bounds_changed', 'center_changed', 'heading_changed', 'projection_changed', 'tilt_changed', 'zoom_changed'];
const mouseEventTypes = ['click', 'contextmenu', 'dblclick', 'mousemove', 'mouseout', 'mouseover'];
const eventPropNames = Object.keys(propNameToEventType);

function isLatLngLiteral(obj) {
  if (!obj || typeof obj !== 'object') return false;
  if (!('lat' in obj && 'lng' in obj)) return false;
  return Number.isFinite(obj.lat) && Number.isFinite(obj.lng);
}

const _excluded$3 = ["center", "zoom", "heading", "tilt"],
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
  const {
      center: rawCenter,
      zoom,
      heading,
      tilt
    } = mapProps,
    mapOptions = _objectWithoutPropertiesLoose(mapProps, _excluded$3);
  const center = rawCenter ? isLatLngLiteral(rawCenter) ? rawCenter : rawCenter.toJSON() : null;
  const lat = center && center.lat;
  const lng = center && center.lng;
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
  useEffect(() => {
    if (!map) return;
    // Changing the mapId via setOptions will trigger an error-message.
    // We will re-create the map-instance in that case anyway, so we
    // remove it here to avoid this error-message.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const opts = _objectWithoutPropertiesLoose(mapOptions, _excluded2);
    map.setOptions(opts);
  }, [mapOptions]);
  useLayoutEffect(() => {
    if (!map || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (cameraStateRef.current.center.lat === lat && cameraStateRef.current.center.lng === lng) return;
    map.moveCamera({
      center: {
        lat: lat,
        lng: lng
      }
    });
  }, [lat, lng]);
  useLayoutEffect(() => {
    if (!map || !Number.isFinite(zoom)) return;
    if (cameraStateRef.current.zoom === zoom) return;
    map.moveCamera({
      zoom: zoom
    });
  }, [zoom]);
  useLayoutEffect(() => {
    if (!map || !Number.isFinite(heading)) return;
    if (cameraStateRef.current.heading === heading) return;
    map.moveCamera({
      heading: heading
    });
  }, [heading]);
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
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
    const {
      latitude,
      longitude,
      bearing: heading,
      pitch: tilt,
      zoom
    } = viewState;
    map.moveCamera({
      center: {
        lat: latitude,
        lng: longitude
      },
      heading,
      tilt,
      zoom: zoom + 1
    });
  }, [map, viewState]);
}

const _excluded$2 = ["id", "initialBounds"];
const GoogleMapsContext = React.createContext(null);
/**
 * Component to render a Google Maps map
 */
const Map = props => {
  const {
    children,
    id,
    className,
    style,
    viewState,
    viewport
  } = props;
  const context = useContext(APIProviderContext);
  const loadingStatus = useApiLoadingStatus();
  if (!context) {
    throw new Error('<Map> can only be used inside an <ApiProvider> component.');
  }
  const [map, mapRef] = useMapInstance(props, context);
  const cameraStateRef = useInternalCameraState();
  useMapOptions(map, cameraStateRef, props);
  useMapEvents(map, cameraStateRef, props);
  useDeckGLCameraUpdate(map, viewState);
  const isViewportSet = useMemo(() => Boolean(viewport), [viewport]);
  const combinedStyle = useMemo(() => _extends({
    width: '100%',
    height: '100%',
    // when using deckgl, the map should be sent to the back
    zIndex: isViewportSet ? -1 : 0
  }, style), [style, isViewportSet]);
  if (loadingStatus === APILoadingStatus.AUTH_FAILURE) {
    return /*#__PURE__*/React.createElement("div", {
      style: _extends({
        position: 'relative'
      }, className ? {} : combinedStyle),
      className: className
    }, /*#__PURE__*/React.createElement(AuthFailureMessage, null));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: mapRef,
    "data-testid": 'map',
    style: className ? undefined : combinedStyle,
    className: className
  }, id ? {
    id
  } : {}), map ? /*#__PURE__*/React.createElement(GoogleMapsContext.Provider, {
    value: {
      map
    }
  }, children) : null);
};
Map.deckGLViewProps = true;
const AuthFailureMessage = () => {
  const style = {
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
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, /*#__PURE__*/React.createElement("h2", null, "Error: AuthFailure"), /*#__PURE__*/React.createElement("p", null, "A problem with your API key prevents the map from rendering correctly. Please make sure the value of the ", /*#__PURE__*/React.createElement("code", null, "APIProvider.apiKey"), " prop is correct. Check the error-message in the console for further details."));
};
/**
 * The main hook takes care of creating map-instances and registering them in
 * the api-provider context.
 * @return a tuple of the map-instance created (or null) and the callback
 *   ref that will be used to pass the map-container into this hook.
 * @internal
 */
function useMapInstance(props, context) {
  const apiIsLoaded = useApiIsLoaded();
  const [map, setMap] = useState(null);
  const [container, containerRef] = useCallbackRef();
  const {
      id,
      initialBounds
    } = props,
    mapOptions = _objectWithoutPropertiesLoose(props, _excluded$2);
  // create the map instance and register it in the context
  useEffect(() => {
    if (!container || !apiIsLoaded) return;
    const {
      addMapInstance,
      removeMapInstance
    } = context;
    const newMap = new google.maps.Map(container, mapOptions);
    setMap(newMap);
    addMapInstance(newMap, id);
    if (initialBounds) {
      newMap.fitBounds(initialBounds);
    }
    return () => {
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
  useEffect(() => {
    if (!id) return;
    const {
      mapInstances
    } = context;
    if (mapInstances[id] && mapInstances[id] !== map) {
      logErrorOnce(`The map id '${id}' seems to have been used multiple times. ` + 'This can lead to unexpected problems when accessing the maps. ' + 'Please use unique ids for all <Map> components.');
    }
  }, [id, context, map]);
  return [map, containerRef];
}

function useMapsLibrary(name) {
  const apiIsLoaded = useApiIsLoaded();
  const ctx = useContext(APIProviderContext);
  useEffect(() => {
    if (!apiIsLoaded || !ctx) return;
    // Trigger loading the libraries via our proxy-method.
    // The returned promise is ignored, since importLibrary will update loadedLibraries
    // list in the context, triggering a re-render.
    void ctx.importLibrary(name);
  }, [apiIsLoaded, ctx == null ? void 0 : ctx.importLibrary]);
  return (ctx == null ? void 0 : ctx.loadedLibraries[name]) || null;
}

/* eslint-disable complexity */
const AdvancedMarkerContext = React.createContext(null);
function useAdvancedMarker(props) {
  var _useContext;
  const [marker, setMarker] = useState(null);
  const [contentContainer, setContentContainer] = useState(null);
  const map = (_useContext = useContext(GoogleMapsContext)) == null ? void 0 : _useContext.map;
  const markerLibrary = useMapsLibrary('marker');
  const {
    children,
    className,
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    collisionBehavior,
    draggable,
    position,
    title,
    zIndex
  } = props;
  const numChilds = Children.count(children);
  // create marker instance and add it to the map when map becomes available
  useEffect(() => {
    if (!map || !markerLibrary) return;
    const newMarker = new markerLibrary.AdvancedMarkerElement();
    newMarker.map = map;
    setMarker(newMarker);
    // create container for marker content if there are children
    if (numChilds > 0) {
      const el = document.createElement('div');
      if (className) el.className = className;
      newMarker.content = el;
      setContentContainer(el);
    }
    return () => {
      newMarker.map = null;
      setMarker(null);
      setContentContainer(null);
    };
  }, [map, markerLibrary, numChilds]);
  // bind all marker events
  useEffect(() => {
    if (!marker) return;
    const gme = google.maps.event;
    if (onClick) gme.addListener(marker, 'click', onClick);
    if (onDrag) gme.addListener(marker, 'drag', onDrag);
    if (onDragStart) gme.addListener(marker, 'dragstart', onDragStart);
    if (onDragEnd) gme.addListener(marker, 'dragend', onDragEnd);
    if ((onDrag || onDragStart || onDragEnd) && !draggable) {
      console.warn('You need to set the marker to draggable to listen to drag-events.');
    }
    const m = marker;
    return () => {
      gme.clearInstanceListeners(m);
    };
  }, [marker, draggable, onClick, onDragStart, onDrag, onDragEnd]);
  // update other marker props when changed
  useEffect(() => {
    if (!marker) return;
    if (position !== undefined) marker.position = position;
    if (draggable !== undefined) marker.gmpDraggable = draggable;
    if (collisionBehavior !== undefined) marker.collisionBehavior = collisionBehavior;
    if (zIndex !== undefined) marker.zIndex = zIndex;
    if (typeof title === 'string') marker.title = title;
  }, [marker, position, draggable, collisionBehavior, zIndex, title]);
  return [marker, contentContainer];
}
const AdvancedMarker = forwardRef((props, ref) => {
  const {
    children
  } = props;
  const [marker, contentContainer] = useAdvancedMarker(props);
  useImperativeHandle(ref, () => marker, [marker]);
  if (!marker) {
    return null;
  }
  return /*#__PURE__*/React.createElement(AdvancedMarkerContext.Provider, {
    value: {
      marker
    }
  }, contentContainer !== null && createPortal(children, contentContainer));
});
function useAdvancedMarkerRef() {
  const [marker, setMarker] = useState(null);
  const refCallback = useCallback(m => {
    setMarker(m);
  }, []);
  return [refCallback, marker];
}

const _excluded$1 = ["children", "anchor", "onCloseClick"];
/**
 * Component to render a Google Maps Info Window
 */
const InfoWindow = props => {
  var _useContext;
  const {
      children,
      anchor,
      onCloseClick
    } = props,
    infoWindowOptions = _objectWithoutPropertiesLoose(props, _excluded$1);
  const map = (_useContext = useContext(GoogleMapsContext)) == null ? void 0 : _useContext.map;
  const [contentContainer, setContentContainer] = useState(null);
  // create infowindow once map is available
  useEffect(() => {
    if (!map) return;
    const infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    // Add content to info window
    const el = document.createElement('div');
    infoWindow.setContent(el);
    infoWindow.open({
      map,
      anchor
    });
    if (onCloseClick) {
      google.maps.event.addListener(infoWindow, 'closeclick', () => {
        onCloseClick();
      });
    }
    setContentContainer(el);
    // Cleanup info window and event listeners on unmount
    return () => {
      google.maps.event.clearInstanceListeners(infoWindow);
      infoWindow.close();
      el.remove();
      setContentContainer(null);
    };
  }, [map, children, anchor]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, contentContainer !== null && createPortal(children, contentContainer));
};

/**
 * Retrieves a map-instance from the context. This is either an instance
 * identified by id or the parent map instance if no id is specified.
 * Returns null if neither can be found.
 */
const useMap = (id = null) => {
  const ctx = useContext(APIProviderContext);
  const {
    map
  } = useContext(GoogleMapsContext) || {};
  if (ctx === null) {
    logErrorOnce('useMap(): failed to retrieve APIProviderContext. ' + 'Make sure that the <APIProvider> component exists and that the ' + 'component you are calling `useMap()` from is a sibling of the ' + '<APIProvider>.');
    return null;
  }
  const {
    mapInstances
  } = ctx;
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
const ControlPosition = {
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
const MapControl = ({
  children,
  position
}) => {
  const controlContainer = useMemo(() => document.createElement('div'), []);
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const controls = map.controls[position];
    controls.push(controlContainer);
    return () => {
      const index = controls.getArray().indexOf(controlContainer);
      controls.removeAt(index);
    };
  }, [map, position]);
  return createPortal(children, controlContainer);
};

const _excluded = ["onClick", "onDrag", "onDragStart", "onDragEnd", "onMouseOver", "onMouseOut"];
function useMarker(props) {
  var _useContext;
  const [marker, setMarker] = useState(null);
  const map = (_useContext = useContext(GoogleMapsContext)) == null ? void 0 : _useContext.map;
  const {
      onClick,
      onDrag,
      onDragStart,
      onDragEnd,
      onMouseOver,
      onMouseOut
    } = props,
    markerOptions = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    position,
    draggable
  } = markerOptions;
  // create marker instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined) console.error('<Marker> has to be inside a Map component.');
      return;
    }
    const newMarker = new google.maps.Marker(markerOptions);
    newMarker.setMap(map);
    setMarker(newMarker);
    return () => {
      newMarker.setMap(null);
      setMarker(null);
    };
  }, [map]);
  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!marker) return;
    const m = marker;
    // Add event listeners
    const gme = google.maps.event;
    if (onClick) gme.addListener(m, 'click', onClick);
    if (onDrag) gme.addListener(m, 'drag', onDrag);
    if (onDragStart) gme.addListener(m, 'dragstart', onDragStart);
    if (onDragEnd) gme.addListener(m, 'dragend', onDragEnd);
    if (onMouseOver) gme.addListener(m, 'mouseover', onMouseOver);
    if (onMouseOut) gme.addListener(m, 'mouseout', onMouseOut);
    marker.setDraggable(Boolean(draggable));
    return () => {
      gme.clearInstanceListeners(m);
    };
  }, [marker, draggable, onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut]);
  // update markerOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  useEffect(() => {
    if (!marker) return;
    if (markerOptions) marker.setOptions(markerOptions);
  }, [marker, markerOptions]);
  // update position when changed
  useEffect(() => {
    // Should not update position when draggable
    if (draggable || !position || !marker) return;
    marker.setPosition(position);
  }, [draggable, position, marker]);
  return marker;
}
/**
 * Component to render a Google Maps Marker on a map
 */
const Marker = forwardRef((props, ref) => {
  const marker = useMarker(props);
  useImperativeHandle(ref, () => marker, [marker]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
});
function useMarkerRef() {
  const [marker, setMarker] = useState(null);
  const refCallback = useCallback(m => {
    setMarker(m);
  }, []);
  return [refCallback, marker];
}

/**
 * Component to render a google maps marker Pin View
 */
const Pin = props => {
  var _useContext;
  const advancedMarker = (_useContext = useContext(AdvancedMarkerContext)) == null ? void 0 : _useContext.marker;
  const glyphContainer = useMemo(() => document.createElement('div'), []);
  // Create Pin View instance
  useEffect(() => {
    if (!advancedMarker) {
      if (advancedMarker === undefined) {
        console.error('The <Pin> component can only be used inside <AdvancedMarker>.');
      }
      return;
    }
    if (props.glyph && props.children) {
      logErrorOnce('The <Pin> component only uses children to render the glyph if both the glyph property and children are present.');
    }
    if (Children.count(props.children) > 1) {
      logErrorOnce('Passing multiple children to the <Pin> component might lead to unexpected results.');
    }
    const pinViewOptions = _extends({}, props);
    const pinElement = new google.maps.marker.PinElement(pinViewOptions);
    // Set glyph to glyph container if children are present (rendered via portal).
    // If both props.glyph and props.children are present, props.children takes priority.
    if (props.children) {
      pinElement.glyph = glyphContainer;
    }
    // Set content of Advanced Marker View to the Pin View element
    advancedMarker.content = pinElement.element;
  }, [advancedMarker, props]);
  return createPortal(props.children, glyphContainer);
};

/**
 * Hook to get a Google Maps Places Autocomplete instance
 * monitoring an input field
 */
const useAutocomplete = props => {
  const {
    inputField,
    options,
    onPlaceChanged
  } = props;
  const googleMapsAPIIsLoaded = useApiIsLoaded();
  const placeChangedHandler = useRef(onPlaceChanged);
  const [autocomplete, setAutocomplete] = useState(null);
  // Initializes the Google Maps Places Autocomplete
  useEffect(() => {
    // Wait for the Google Maps API and input element to be initialized
    if (!googleMapsAPIIsLoaded || !inputField) return;
    // FIXME: add dynamic loading for required libraries
    if (!google.maps.places) {
      console.error('Google Maps Places library is missing. ' + 'Please add the places library to the props of the <ApiProvider> ' + 'component.');
      return;
    }
    // Create Autocomplete instance
    const autocompleteInstance = new google.maps.places.Autocomplete(inputField, options);
    setAutocomplete(autocompleteInstance);
    // Add places change listener to Autocomplete
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (placeChangedHandler.current) placeChangedHandler.current(place);
    });
    // Clear listeners on unmount
    return () => {
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
function assertNotNull(value, message = 'assertion failed') {
  if (value === null || value === undefined) {
    throw Error(message);
  }
}

const useDirectionsRenderer = (mapId, renderOnMap, renderOptions) => {
  const map = useMap(mapId);
  // create the renderer instance
  const directionsRenderer = useMemo(() => {
    if (!map || !renderOnMap) return null;
    const renderer = new google.maps.DirectionsRenderer(renderOptions);
    renderer.setMap(map);
    return renderer;
  },
  // note: no dependency on renderOptions since those are handled in the
  // next effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [map, renderOnMap]);
  useEffect(() => {
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
const useDirectionsService = (props = {}) => {
  const {
    mapId = null,
    renderOnMap,
    renderOptions
  } = props;
  const isApiLoaded = useApiIsLoaded();
  // Creates a Directions Service instance
  const directionsService = useMemo(() => {
    // Wait for Google Maps API to be loaded
    if (!isApiLoaded) return null;
    return new google.maps.DirectionsService();
  }, [isApiLoaded]);
  // create the renderer instance
  const directionsRenderer = useDirectionsRenderer(mapId, renderOnMap, renderOptions);
  // Custom Directions route request followed by directions rendering
  const renderRoute = useCallback(async request => {
    // findAndRenderRoute() isn't callable when either directions
    // service or renderer aren't ready
    assertNotNull(directionsService);
    assertNotNull(directionsRenderer);
    const result = await directionsService.route(request);
    directionsRenderer.setDirections(result);
    return result;
  }, [directionsService, directionsRenderer]);
  // Renders directions route of given index
  const setRenderedRouteIndex = index => {
    assertNotNull(directionsRenderer);
    directionsRenderer.setRouteIndex(index);
  };
  return {
    directionsService,
    directionsRenderer,
    renderRoute: directionsService && directionsRenderer ? renderRoute : null,
    setRenderedRouteIndex: directionsService && directionsRenderer ? setRenderedRouteIndex : null
  };
};

/* eslint-disable complexity */
/**
 * Hook to get Street View Panorama
 */
const useStreetViewPanorama = (props = {}) => {
  const {
    mapId,
    divElement,
    position,
    pov,
    zoom
  } = props;
  const googleMapsAPIIsLoaded = useApiIsLoaded();
  const map = useMap(mapId);
  const [streetViewPanorama, setStreetViewPanorama] = useState(null);
  // Creates a Street View instance
  useEffect(() => {
    if (!googleMapsAPIIsLoaded) return;
    let pano = null;
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
    return () => {
      setStreetViewPanorama(null);
      if (map) map.setStreetView(null);
    };
  },
  // fixme: implement extra hook to update FOV when props change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [googleMapsAPIIsLoaded, map, divElement]);
  return streetViewPanorama;
};

const mapLinear = (x, a1, a2, b1, b2) => b1 + (x - a1) * (b2 - b1) / (a2 - a1);
const getMapMaxTilt = zoom => {
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
const limitTiltRange = ({
  viewState
}) => {
  const pitch = viewState.pitch;
  const gmZoom = viewState.zoom + 1;
  const maxTilt = getMapMaxTilt(gmZoom);
  return _extends({}, viewState, {
    fovy: 25,
    pitch: Math.min(maxTilt, pitch)
  });
};

export { APIProvider, APIProviderContext, AdvancedMarker, AdvancedMarkerContext, ControlPosition, GoogleMapsContext, InfoWindow, Map, MapControl, Marker, Pin, limitTiltRange, useAdvancedMarkerRef, useApiIsLoaded, useApiLoadingStatus, useAutocomplete, useDirectionsService, useMap, useMapsLibrary, useMarkerRef, useStreetViewPanorama };
//# sourceMappingURL=index.modern.mjs.map
