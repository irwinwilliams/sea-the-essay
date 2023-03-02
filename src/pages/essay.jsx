import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import "../styles/essay.css";

import Chatbot from "../components/Chatbot";
import {
  promptContent,
  promptSystemContent,
  promptLanguage,
  promptSystemLanguage,
  promptGrammar,
  promptSystemGrammar,
  promptOrganization,
  promptSystemOrganization,
} from "../components/prompts";

export default function Essay() {
  const [response, setResponse] = useState(null);
  const [working, setWorking] = useState(false);
  const [activity, setActivity] = React.useState("Get Feedback.");
  const [essayTopic, setEssayTopic] = React.useState("");
  const [essayText, setEssayText] = React.useState(``);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [gradingResult, setGradingResult] = React.useState("");
  const [promptGuide, setPromptGuide] = React.useState("");
  const [error, setError] = React.useState(null);
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [apiKey, setAPIKey] = useState(null);

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  async function doPrompt(guide, system) {
    var prompt = guide + essayText + " |||";
    var response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
      max_tokens: 2067,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      stop: ["|||"],
    });
    /*var response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: guide + essayText + " |||",
        temperature: 0,
        max_tokens: 2067,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
        stop: ["|||"],
      });*/

    console.log(response.data.choices[0].text);

    const result = response.data.choices[0].message.content;

    //response.data.choices[0].text;

    //result = result.replace("Response:", "");

    //const pattern = /Grade:\s*(\d+\/\d+)\nComments:\s*(.+)\nImprovements:\s*(.+)/s;
    var gptResponse = {
      Grade: "",
      Comments: "",
      Improvements: "",
      Result: result,
    };
    try {
      console.log(result);
      //console.log(pattern);

      //const matches = pattern.exec(result);

      //const grade = matches[1];
      //const comments = matches[2].trim();
      //const improvements = matches[3].trim();
      var json = JSON.parse(result);

      gptResponse = {
        Grade: json.Grade,
        Comments: json.Comments,
        Improvements: json.Improvements,
        Result: result,
      };
    } catch (e) {
      console.log(e);
    }

    return gptResponse;
  }

  async function gradeSubmission() {
    try {
      setChatbotMessages([]);
      const messages = [];

      var guides = [
        { Area: "Content", Guide: promptContent, System: promptSystemContent },
        {
          Area: "Language",
          Guide: promptLanguage,
          System: promptSystemLanguage,
        },
        { Area: "Grammar", Guide: promptGrammar, System: promptSystemGrammar },
        {
          Area: "Organization",
          Guide: promptOrganization,
          System: promptSystemOrganization,
        },
      ];
      for (var i = 0; i < guides.length; i++) {
        var result = await doPrompt(guides[i].Guide, guides[i].System);
        //console.log(result);
        setResponse(result);

        if (result.AchievementLevel) {
          messages.push({
            text: `Your essay achieved a level of ${result.AchievementLevel}.`,
            avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
          });
        }
        messages.push({
          area: guides[i].Area,
          text: result.Comments,
          avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
        });

        if (result.Improvements) {
          messages.push({
            area: guides[i].Area,
            text: result.Improvements,
            avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
          });
        }

        setChatbotMessages(messages);
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
      {
        text: nextMessage,
        avatar: "https://img.icons8.com/fluency/48/null/writer-female.png",
      },
    ]);
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
    setActivity("Get more feedback!");
  };

  return (
    <div className="page essay">
      <h1 className="title">Write Your Essay Here</h1>
      <p>Type an essay here. When you submit, we'll provide feedback</p>
      <div className="essayMain">
        <div className="essay-content">
          <span>
            <label>Essay Topic: </label>
            <input
              value={essayTopic}
              onChange={(e) => setEssayTopic(e.target.value)}
            />
          </span>
          <textarea
            rows="15"
            cols="70"
            onChange={(e) => setEssayText(e.target.value)}
            value={essayText}
          ></textarea>
        </div>
        {error ? (
          <textarea rows="15" cols="25" value={error} readOnly />
        ) : response ? (
          <div className="wrapResult">
            <div className="chatbot-container">
              <Chatbot messages={chatbotMessages} />
            </div>
          </div>
        ) : null}
      </div>

      <button className="button-3" onClick={handleSubmit}>
        {activity}
      </button>
    </div>
  );
}
