/// <reference types="google.maps" />
export interface StreetViewPanoramaProps {
    mapId?: string;
    divElement?: HTMLElement | null;
    position?: google.maps.LatLng | google.maps.LatLngLiteral;
    pov?: google.maps.StreetViewPov;
    zoom?: number;
}
/**
 * Hook to get Street View Panorama
 */
export declare const useStreetViewPanorama: (props?: StreetViewPanoramaProps) => google.maps.StreetViewPanorama | null;
