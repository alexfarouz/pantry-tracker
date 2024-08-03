// utils/fetchImage.js
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'q3PJwDrSF-att2U7Knwt5N4XWAYSwnRQTJvInW1W4n8'; // Replace with your Unsplash API key

const getSpecificQuery = (query) => {
  const specificQueries = {
    apple: 'apple fruit',
    salt: 'salt shaker with salt in it',
    mango: 'whole mango',
    peach: 'whole peach',
    pineapple: 'whole pineapple food',
    carrot: 'orange carrot',
    potato: 'potato'
    // Add more specific queries for other items if needed
  };
  
  return specificQueries[query.toLowerCase()] || `${query} food`;
};

const fetchImage = async (query) => {
  try {
    const searchQuery = getSpecificQuery(query);
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: searchQuery,
        client_id: UNSPLASH_ACCESS_KEY,
        per_page: 1,
        orientation: 'squarish'
      }
    });

    const imageUrl = response.data.results[0]?.urls?.small;
    console.log(`Fetched image URL for ${query}: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

export default fetchImage;
