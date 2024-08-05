import { OpenAI } from 'openai';
import { firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from '@clerk/nextjs/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateRecipe(req, res) {
  const { userId } = getAuth(req);
  try {
    // Fetch ingredients from Firestore
    const snapshot = await getDocs(collection(firestore, `users/${userId}/pantry`));
    const ingredients = [];
    snapshot.forEach(doc => {
      ingredients.push(doc.id);
    });

    // Create the prompt
    const prompt = `I have a pantry with the following ingredients: ${ingredients.join(', ')}. 
    Please use these ingredients to generate a recipe complete with instructions and ingredients. 
    Be sure to give the title of the recipe, the difficulty (easy, moderate, hard, or expert), 
    the time it takes, and the number of servings there are. Again, make sure to provide the ingredients 
    via bullet points as well as the instructions via bullet points. For the instructions they should be in
    the following format:
    1. **Prepare the Fruit:**
        - Wash all fruits thoroughly.
        - Dice the apple and watermelon into bite-sized pieces.
        - Slice the banana and halve the grapes.
        - Segment the orange and carefully remove the seeds if present.
    Also be sure in the recipe title, do not put '#' or '*' for whatever reason.
    Your whole response should be in this format:
    
    Generated Recipe: Fruit Salad with Citrus Dressing

    **Difficulty:** Easy
    **Time:** 20 minutes
    **Servings:** 4

    **Ingredients:**
    - 1 apple
    - 1 banana
    - 1 cup blackberries
    - 1 cup grapes
    - 1 orange
    - 1 lemon
    - 1 cup watermelon
    - Pepper (to taste)
    - 2 tablespoons flour (optional, for sprinkling)

    **Instructions:**
    1. **Prepare the Fruit:**
        - Wash all fruits thoroughly.
        - Dice the apple and watermelon into bite-sized pieces.
        - Slice the banana and halve the grapes.
        - Segment the orange and carefully remove the seeds if present.
        - Gently wash the blackberries and set aside.

    2. **Make the Citrus Dressing:**
        - In a small bowl, juice the lemon.
        - Add a pinch of pepper to the lemon juice for a unique flavor.
        - Whisk together until combined.

    3. **Combine the Fruits:**
        - In a large bowl, combine the diced apple, banana slices, blackberries, halved grapes, watermelon pieces, and orange segments.

    4. **Add the Dressing:**
        - Pour the citrus dressing over the mixed fruit.
        - If desired, sprinkle with the optional flour for a slight thickening effect.

    5. **Toss and Serve:**
        - Gently toss the salad until the fruit is coated with the dressing.
        - Serve immediately or refrigerate for 10 minutes to enhance the flavors.`;
        
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      max_tokens: 1000,
    });

    if (response && response.choices && response.choices.length > 0) {
      const recipe = response.choices[0].message.content;
      console.log('Generated Recipe:', recipe);
      res.status(200).send(recipe);
    } else {
      res.status(500).send('Failed to generate a recipe.');
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).send('Error generating recipe.');
  }
};

export default generateRecipe;
