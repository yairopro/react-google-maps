/// <reference types="google.maps" />
import React, { CSSProperties, PropsWithChildren } from 'react';
import { MapEventProps } from './use-map-events';
export interface GoogleMapsContextValue {
    map: google.maps.Map | null;
}
export declare const GoogleMapsContext: React.Context<GoogleMapsContextValue | null>;
export type { MapCameraChangedEvent, MapEvent, MapEventProps, MapMouseEvent } from './use-map-events';
/**
 * Props for the Google Maps Map Component
 */
export type MapProps = google.maps.MapOptions & MapEventProps & {
    style?: CSSProperties;
    /**
     * Adds custom style to the map by passing a css class.
     */
    className?: string;
    /**
     * Adds initial bounds to the map as an alternative to specifying the center/zoom of the map.
     * Calls the fitBounds method internally https://developers.google.com/maps/documentation/javascript/reference/map?hl=en#Map-Methods
     */
    initialBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    /**
     * An id that is added to the map. Needed when using more than one Map component.
     * This is also needed to reference the map inside the useMap hook.
     */
    id?: string;
    /**
     * Viewport from deck.gl
     */
    viewport?: unknown;
    /**
     * View state from deck.gl
     */
    viewState?: Record<string, unknown>;
    /**
     * Initial View State from deck.gl
     */
    initialViewState?: Record<string, unknown>;
};
/**
 * Component to render a Google Maps map
 */
export declare const Map: {
    (props: PropsWithChildren<MapProps>): React.JSX.Element;
    deckGLViewProps: boolean;
};
