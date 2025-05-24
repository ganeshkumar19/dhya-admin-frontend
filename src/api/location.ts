import axios from 'axios';

export interface LocationData {
  location: string;
  lat: string;
  long: string;
  pincode: string;
  country: string
  state: string;
  city: string
}

export const fetchLocation = async (): Promise<LocationData | null> => {
  try {
    const res = await axios.get('https://ipapi.co/json/');
    const locationStr = `${res.data.city}, ${res.data.region}, ${res.data.country_name}`;
     
    console.log('location fetched', res)
    return {
      location: locationStr,
      lat: String(res.data.latitude),
      long: String(res.data.longitude),
      state: res.data.city,
      city: res.data.region,
      pincode: res.data.postal,
      country: res.data.country_name,
    };
  } catch (error) {
    console.warn('⚠️ Failed to fetch location:', error);
    return null;
  }
};