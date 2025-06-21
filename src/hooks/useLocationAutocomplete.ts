import { useState } from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    Suggestion,
} from 'use-places-autocomplete';
import { useGeocoder } from './useGeocoder';

type LocationData = {
    latitude: number;
    longitude: number;
    address: string;
};

export const useLocationAutocomplete = () => {
    

    const [suggestionAccepted, setSuggestionAccepted] = useState<boolean>(false);
    const {getGeocoder} = useGeocoder();

    const {
        ready,
        value,
        suggestions,
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({ debounce: 300 });

    const handleSelect = ({ description, place_id }: Suggestion, callback?: (data: LocationData) => void ) => () => {
        setValue(description, false);
        setSuggestionAccepted(true);
        clearSuggestions();

        getGeocode({ placeId: place_id }).then((results) => {
            const { lat, lng } = results[0].geometry.location;
            getGeocoder(lat(),lng(),undefined,(data=>{
                if (callback) {
                    callback({
                        latitude:data?.latitude,
                        longitude:data?.longitude || 0,
                        address:description,
                    });
                }
            }));
        });
    };

    return {
        ready,
        suggestions,
        value,
        setValue,
        suggestionAccepted,
        handleSelect,
        setSuggestionAccepted,
        clearSuggestions
    };
};
