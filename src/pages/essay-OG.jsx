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
  
  const [essayTopic, setEssayTopic] = React.useState("");

  const [essayText, setEssayText] = React.useState(``);

  const [gradingResult, setGradingResult] = React.useState("");
  
  const [promptGuide, setPromptGuide] = React.useState("");
  
  const [error, setError] = React.useState(null);
  
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
