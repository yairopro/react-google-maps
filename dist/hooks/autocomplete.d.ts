/// <reference types="google.maps" />
export interface AutocompleteProps {
    inputField: HTMLInputElement | null;
    options?: google.maps.places.AutocompleteOptions;
    onPlaceChanged: (place: google.maps.places.PlaceResult) => void;
}
/**
 * Hook to get a Google Maps Places Autocomplete instance
 * monitoring an input field
 */
export declare const useAutocomplete: (props: AutocompleteProps) => google.maps.places.Autocomplete | null;
