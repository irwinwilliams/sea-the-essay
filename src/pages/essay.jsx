import * as React from "react";
import axios from "axios";

export default function Essay() {
  
  async function gradeEssay(student_essay) {
    const API_KEY = "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";
    const model = "text-davinci-002";

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/" + model + "/jobs",
        {
          prompt: `Grade the following essay according to the rubric:

Content:
1. Setting (this includes time and place)
2. Character (physical description, action and dialog)
3. Plot (Exposition, rising action, climax, falling action, resolution)

Language:
1. Descriptive language
2. Figurative language
3. Sensory details

Organization:
1. Sequencing of plot
2. Use of transitions and paragraphing 

Grammar/Mechanics:
1. Capitalization
2. Parts of speech
3. Punctuation
4. Spelling

Essay:
${essayText}`,
          max_tokens: 2048,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const result = response.data.choices[0].text;
      return result;
    } catch (error) {
      return error;
    }
  }

  const [essayText, setEssayText] = React.useState(`The Importance of Trees

  Trees are essential to our environment and our lives. They provide us with clean air, shade, and homes for wildlife. They also play a crucial role in the water cycle, releasing moisture into the air and helping to regulate the climate.

  Trees are also important to our economy. They provide us with resources like wood and paper, which are used to make many of the things we use every day. Without trees, our world would be a very different place.

  That's why it's important for us to take care of trees and protect them from things that can harm them, like pollution and deforestation. We can do this by planting more trees, avoiding cutting them down unless it's absolutely necessary, and making sure that we're using sustainable practices when we do use trees for resources.

  In conclusion, trees are a valuable part of our world, and we need to do our part to protect and preserve them. If we work together, we can create a greener and healthier planet for ourselves and future generations.`);

  const [gradingResult, setGradingResult] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async () => {
    // Call the gradeEssay function with the essay text
    const result = await gradeEssay(essayText);
    if (result.message) {
      setError(result.message + " - " + result.toString());
    } else {
      setGradingResult(result);
    }
  };

  return (
    <div className="page essay">
      <h1 className="title">Submit an essay</h1>
      <p>Type an essay here. When you submit, we'll provide feedback</p>
      <div>
        <textarea
          rows="25"
          cols="70"
          onChange={(e) => setEssayText(e.target.value)}
        >{essayText}</textarea>
        {error ? (
          <textarea rows="25" cols="25" value={error} readOnly />
        ) : (
          <textarea rows="25" cols="25" value={gradingResult} readOnly />
        )}
      </div>
      <button onClick={handleSubmit}>Submit!</button>
    </div>
  );
}
