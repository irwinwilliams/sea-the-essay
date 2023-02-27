import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import '../styles/essay.css';

import Chatbot from "../components/Chatbot";
import  promptGuideTemplate  from "../components/prompts";

const API_KEY = "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";

const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

export default function Essay() {
  const [response, setResponse] = useState(null);
  const [working, setWorking] = useState(false);
  const [activity, setActivity] = React.useState("Submit!");
  const [essayTopic, setEssayTopic] = React.useState("The Importance of Trees");
  const [essayText, setEssayText] = React.useState(` Trees are essential to our environment and our lives. They provide us with clean air, shade, and homes for wildlife. They also play a crucial role in the water cycle, releasing moisture into the air and helping to regulate the climate.

  Trees are also important to our economy. They provide us with resources like wood and paper, which are used to make many of the things we use every day. Without trees, our world would be a very different place.

  That's why it's important for us to take care of trees and protect them from things that can harm them, like pollution and deforestation. We can do this by planting more trees, avoiding cutting them down unless it's absolutely necessary, and making sure that we're using sustainable practices when we do use trees for resources.

  Trees are a valuable part of our world, and we need to do our part to protect and preserve them. If we work together, we can create a greener and healthier planet for ourselves and future generations.`);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [gradingResult, setGradingResult] = React.useState("");
  const [promptGuide, setPromptGuide] = React.useState(promptGuideTemplate);
  const [error, setError] = React.useState(null);
  const [chatbotMessages, setChatbotMessages] = useState([]);

  async function gradeSubmission() {
    try {
      //console.log(promptGuide);
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

      var result = response.data.choices[0].text;
      result = result.replace("Response:", "");
      result = JSON.parse(result);
      console.log(result);
      setResponse(result);

      // Add chatbot messages based on grading results
      const messages = [];
      if (result.AchievementLevel) {
        messages.push({
          text: `Your essay achieved a level of ${result.AchievementLevel}.`,
          avatar: "https://example.com/avatar1.jpg",
        });
      }
      if (result.Content) {
        messages.push({
          text: `Your essay scored ${result.Content} for content.`,
          avatar: "https://example.com/avatar2.jpg",
        });
      }
      if (result.Organization) {
        messages.push({
          text: `Your essay scored ${result.Organization} for organization.`,
          avatar: "https://example.com/avatar3.jpg",
        });
      }
      if (result.Language) {
        messages.push({
          text: `Your essay scored ${result.Language} for language.`,
          avatar: "https://example.com/avatar4.jpg",
        });
      }
      if (result.Grammar) {
        messages.push({
          text: `Your essay scored ${result.Grammar} for grammar.`,
          avatar: "https://example.com/avatar5.jpg",
        });
      }
      setChatbotMessages(messages);

      return result;
    } catch (error) {
      return error;
    }
  }
  
  function addChatbotMessage(sender, content) {
  setChatbotMessages((prevMessages) => [
    ...prevMessages,
    { sender: sender, content: content },
  ]);
}
  
  function renderTable() {
    console.log(response);
    return (
      <div>
        <h3>Level</h3>
        <p>{response.AchievementLevel}</p>
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

  const handleTyping = (e) => {
    setEssayText(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        if (e.target.value) {
          setPromptGuide(
            `Please grade my essay on the following criteria: content, organization, language, and grammar. Give me a score between 1 and 5 in each category. Here is my essay: "${e.target.value}"\n`
          );
        } else {
          setPromptGuide("");
        }
      }, 1000)
    );
  };

  const handleSubmit = async () => {
  setActivity("...thinking");
  const result = await gradeSubmission();
  if (result.message) {
    setError(result.message + " - " + result.toString());
  } else {
    setGradingResult(result);
    addChatbotMessage(
      "Essay Grader",
      `Your essay score is ${result.AchievementLevel}.`
    );
    addChatbotMessage(
      "Essay Grader",
      `Here are the scores for each criterion:`
    );
    addChatbotMessage(
      "Essay Grader",
      `Content: ${result.Content}, Language: ${result.Language}, Organization: ${result.Organization}, Grammar: ${result.Grammar}.`
    );
    addChatbotMessage(
      "Essay Grader",
      `Here are some suggestions to improve your essay:`
    );
    result.Improvements.forEach((suggestion) => {
      addChatbotMessage("Essay Grader", suggestion.Suggestion);
    });
    addChatbotMessage(
      "Essay Grader",
      `Here are the grammar errors in your essay:`
    );
    result.GrammarErrors.forEach((error) => {
      addChatbotMessage(
        "Essay Grader",
        `Error: ${error.Error}, Explanation: ${error.Explanation}, Correction: ${error.Correction}`
      );
    });
  }
  setActivity("Submit!");
};
  
  
  
  return (
    <div className="page essay">
      <h1 className="title">Write Your <br />Essay Here</h1>
      <p>Type an essay here. When you submit, we'll provide feedback</p>
      <div className="essayMain">
        <div className="essay-content">
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
            
            <div className="chatbot-container">
              <Chatbot messages={chatbotMessages}/>
            </div>
  
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
     
      <button className="button-3" onClick={handleSubmit}>{activity}</button>
    </div>
  );

}
