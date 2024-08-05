import { OpenAI } from 'openai';
import { storage, firestore } from '../../firebase';
import { ref, deleteObject, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from '@clerk/nextjs/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleOpenAIRequest = async (imageUrl) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please classify what the item is and how many there are. For example, if I provide an image of 5 apples, 
                ensure to specify the item is an apple, and the quantity is 5. For every response, structure them in:
                item: apple; quantity: 5.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low"
              },
            }
          ],
        }
      ],
      max_tokens: 1000,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('No choices returned from OpenAI');
    }
  } catch (error) {
    console.error('Error with OpenAI request:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;

  // Get the authenticated user
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const itemDescription = await handleOpenAIRequest(imageUrl);
    console.log(itemDescription);

    // Extract item and quantity using regex
    const match = itemDescription.match(/item: (\w+); quantity: (\d+)/);
    if (!match) {
      throw new Error('Invalid response format');
    }
    
    const item = match[1];
    const quantity = parseInt(match[2], 10);

    // Update Firestore with the item and quantity for the authenticated user
    const docRef = doc(firestore, `users/${userId}/pantry`, item.toLowerCase());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { quantity: docSnap.data().quantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }

    // Delete the image from Firebase Storage
    const imageRef = ref(storage, decodeURIComponent(imageUrl.split('/').pop().split('?')[0]));
    try {
      await getDownloadURL(imageRef); // Check if the image exists
      await deleteObject(imageRef);
      console.log('Image deleted successfully');
    } catch (error) {
      console.warn('Image not found in storage, skipping delete operation.');
    }

    return res.status(200).json({ item, quantity: Math.floor(quantity / 2) });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({ error: 'Error analyzing image' });
  }
}
