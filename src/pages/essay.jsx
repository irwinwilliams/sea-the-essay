import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import '../styles/essay.css';

import Chatbot from "../components/Chatbot";
import { promptContent, promptLanguage, promptGrammar, promptOrganization}  from "../components/prompts";

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
  const [essayText, setEssayText] = React.useState(`Animals are cool. I like animals because they are cool. Dogs are my favorite animal because they are cool. Dogs can do tricks and stuff.

Cats are okay too. They are cute and soft. They can climb trees and catch mice.

Fish are also cool. You can have a fish tank and watch the fish swim around. They are also pretty to look at.

In conclusion, animals are cool and I like them. Dogs, cats, and fish are my favorite animals because they are cool.`);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [gradingResult, setGradingResult] = React.useState("");
  const [promptGuide, setPromptGuide] = React.useState("");
  const [error, setError] = React.useState(null);
  const [chatbotMessages, setChatbotMessages] = useState([]);

  async function doPrompt(guide)
  {
    var response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: guide + essayText + " |||",
        temperature: 0,
        max_tokens: 2067,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        stop: ["|||"],
      });
      
      console.log(response.data.choices[0].text);

      var result = response.data.choices[0].text;
      
      result = result.replace("Response:", "");
      result = result.replace("'", "\"");
      result = result.replace("“", "\"");
      result = result.replace("”", "\"");
       
      
      result = JSON.parse(result);
      return result;
  }
  
  async function gradeSubmission() {
    try {
      
      setChatbotMessages([]);
      const messages = [];
    
      var guides = [
        {"Area":"Content", "Guide": promptContent}, 
        {"Area":"Language", "Guide": promptLanguage}, 
        {"Area":"Grammar", "Guide": promptGrammar}, 
        {"Area":"Organization", "Guide": promptOrganization}, 
      ];
      for (var i=0;i<guides.length;i++)
        {
          var result = await doPrompt(guides[i].Guide);
          console.log(result);
          setResponse(result);

          // Add chatbot messages based on grading results
          /*if (result.Score) {
            messages.push({
              text: `Your essay has a ${guides[i].Area} score of ${result.Score} out of 10.`,
              avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
            });
          }*/
          
          if (result.AchievementLevel) {
            messages.push({
              text: `Your essay achieved a level of ${result.AchievementLevel}.`,
              avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
            });
          }
          if (result.Content) {
            messages.push({
              text: `Your essay scored ${result.Content} for content.`,
              avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
            });
          }
          if (result.Organization) {
            messages.push({
              text: `Your essay scored ${result.Organization} for organization.`,
              avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
            });
          }
          if (result.Language) {
            messages.push({
              text: `Your essay scored ${result.Language} for language.`,
              avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
            });
          }
          if (result.Grammar) {
            messages.push({
              text: `Your essay scored ${result.Grammar} for grammar.`,
              avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
            });
          }
          
          setChatbotMessages(messages);
          
          if (result.Improvements)
            {
          addChatbotMessage(`Here are some suggestions to improve your essay:`);
          result.Improvements.forEach((suggestion) => {
            addChatbotMessage(suggestion);
          });
            }
          if (result.GrammarErrors)
            {
          addChatbotMessage(`Here are the grammar errors in your essay:`);
          result.GrammarErrors.forEach((error) => {
            addChatbotMessage(`Error: ${error.Error}, Explanation: ${error.Explanation}, Correction: ${error.Correction}`);
          });
            }
          
        }
      return result;
    } catch (error) {
      throw error;
      return error;
    }
  }
  
  function addChatbotMessage(nextMessage) {
  setChatbotMessages((prevMessages) => [
    ...prevMessages,
    { text: nextMessage, avatar: "https://img.icons8.com/fluency/48/null/writer-female.png"  },
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
          </div>
        ) : null}
      </div>
     
      <button className="button-3" onClick={handleSubmit}>{activity}</button>
    </div>
  );

}
