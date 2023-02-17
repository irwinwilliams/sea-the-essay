import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const API_KEY = "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";

const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

export default function Essay() {
  const [response, setResponse] = useState(null);
  const [working, setWorking] = useState(false);
  
  async function gradeSubmission() {
    try {
      console.log(promptGuide);
      var response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: promptGuide + essayText + " |||",
        temperature: 0,
        max_tokens: 2067,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        stop: ["|||"],
      });

      //response = response.replace("Response:", "");

      //setResponse(response);
      var result = response.data.choices[0].text;
      result = result.replace("Response:", "");
      console.log(result);
      result = JSON.parse(result);
      setResponse(result);
      return result;
    } catch (error) {
      return error;
    }
  }

  function renderTable() {
    console.log(response);
    return (
      <div>
        <h3>Level</h3>
        <p>
          {response.AchievementLevel}
        </p>
      <table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Content</td>
            <td>{response.Content}</td>
          </tr>
          <tr>
            <td>Language</td>
            <td>{response.Language}</td>
          </tr>
          <tr>
            <td>Organization</td>
            <td>{response.Organization}</td>
          </tr>
          <tr>
            <td>Grammar</td>
            <td>{response.Grammar}</td>
          </tr>
        </tbody>
      </table>
        </div>
    );
  }

  const [activity, setActivity] = React.useState("Submit!");
  
  const [essayTopic, setEssayTopic] = React.useState("The Importance of Trees");

  const [essayText, setEssayText] = React.useState(`

  Trees are essential to our environment and our lives. They provide us with clean air, shade, and homes for wildlife. They also play a crucial role in the water cycle, releasing moisture into the air and helping to regulate the climate.

  Trees are also important to our economy. They provide us with resources like wood and paper, which are used to make many of the things we use every day. Without trees, our world would be a very different place.

  That's why it's important for us to take care of trees and protect them from things that can harm them, like pollution and deforestation. We can do this by planting more trees, avoiding cutting them down unless it's absolutely necessary, and making sure that we're using sustainable practices when we do use trees for resources.

  Trees are a valuable part of our world, and we need to do our part to protect and preserve them. If we work together, we can create a greener and healthier planet for ourselves and future generations.`);

  const [gradingResult, setGradingResult] = React.useState("");
  const [error, setError] = React.useState(null);

  
  const promptGuide =
`This is a rubric for grading essays includes Content, Language, Organization and Grammar. The rubric is laid out below:

Content:
    The elements of a story:
        Setting (time and place)
        Characters (who are physically described, who engage in actions and dialogue)
    Plot:
    - Exposition
    - Rising action
    - Climax
    - Falling action
    - Resolution

Language:
	Descriptive and figurative language that appeal to the readers’ senses and help them to create mental pictures as they read.


Organization:
	Sequencing the plot structure so that it does not appear to be jumbled to the reader
    Clearly defined paragraphs
    Transitions that add clarity to the plot structure

Grammar/Mechanics:
	1. Capitalization
	2. Parts of speech
	3. Punctuation
	4. Spelling

Essays may have these achievement levels:
	Exemplary: exceeds the standard
	Proficient: meets the minimum standard
	Progressing: nearly meets the standard
	Emerging: below the standard
	Makes an attempt: requires substantial remediation
	Unsatisfactory: requires intervention

Please grade the following essay written by a child on the topic [` + essayTopic +`]. 
The essay is graded based on the rubric provided. 
Imagine you are an expert English Language teacher of 10 or 11 year old children. 
The grade should have specific values for Content, Language, Organization, Grammar, AchievementLevel
Please provide a score out of [10] for each criteria. 
Please list any grammar errors found in the essay, along with an explanation for each error and a 
proposed correction. 
Finally, please provide suggestions for improvements that the student can make to their essay 
to achieve a better score.
Format response in json only. 
Include a property called "GrammarErrors" that lists all grammar errors, the explanation for each error and the proposed corrections in an array. 
Include an property called "Improvements", which will be an array of suggestions for improvement. 

Essay:  `;
  
  const handleSubmit = async () => {
    // Call the gradeEssay function with the essay text
    //const result = await gradeEssay(essayText);
    setActivity("...thinking");
    const result = await gradeSubmission();
    if (result.message) {
      setError(result.message + " - " + result.toString());
    } else {
      setGradingResult(result);
    }
    setActivity("Submit!");
  };

  return (
    <div className="page essay">
      <h1 className="title">Write Your <br />Essay Here</h1>
      <p>Type an essay here. When you submit, we'll provide feedback</p>
      <div >
        <div class="essay-content">
        <span><label>Essay Topic: </label><input value={essayTopic}
          onChange={(e) => setEssayTopic(e.target.value)} /></span>
        <textarea
          rows="25"
          cols="70"
          onChange={(e) => setEssayText(e.target.value)}
          value={essayText}
          ></textarea></div>
        {error ? (
          <textarea rows="25" cols="25" value={error} readOnly />
        ) : response ? (
          <div className="wrapResult">
            {renderTable()}
            <div>
              <h3>Grammar Errors:</h3>
              {response["GrammarErrors"].map((error, i) => (
                <div key={i}>
                  <h4>Error: {error.Error}</h4>
                  <p>Explanation: {error.Explanation}</p>
                  <p>Correction: {error.Correction}</p>
                </div>
              ))}
            </div>
            <div>
              <h3>Improvements:</h3>
              {response.Improvements.map((suggestion, i) => (
                <div key={i}>
                  <p>{suggestion.Suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <button class="button-3" onClick={handleSubmit}>{activity}</button>
    </div>
  );
}
