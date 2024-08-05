import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'q3PJwDrSF-att2U7Knwt5N4XWAYSwnRQTJvInW1W4n8'; // Replace with your Unsplash API key

const getSpecificQuery = (query) => {
  const specificQueries = {
    apple: 'red apple fruit',
    salt: 'salt shaker with salt in it',
    mango: 'whole ripe mango',
    peach: 'whole ripe peach',
    pineapple: 'whole pineapple food',
    carrot: 'fresh orange carrot',
    potato: 'whole potato'
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
        per_page: 5, // Increase number of results
        orientation: 'squarish',
        content_filter: 'high' // Use 'high' to get more relevant results
      }
    });

    const results = response.data.results;
    if (!results.length) {
      console.log(`No images found for ${query}`);
      return null;
    }

    // Select the most appropriate image (e.g., the first one)
    const imageUrl = results[0].urls.small;
    console.log(`Fetched image URL for ${query}: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

export default fetchImage;
