import axios from "axios";

export const getLocationByZipcode = async (zipcode: string) => {
  try {
    const response = await axios.get(
      `https://api.zipcodestack.com/v1/search?apikey=&codes=${zipcode}&country=us`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
