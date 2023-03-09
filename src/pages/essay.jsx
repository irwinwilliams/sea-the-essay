import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import Tesseract from 'tesseract.js';
import ConfigButton from "../components/ConfigButton";
import Cookies from "js-cookie";

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
  const [essayTopic, setEssayTopic] = React.useState("My Favorite Animal");
  const [essayText, setEssayText] = React.useState(`Dogs are my favorite animals, and for good reason. They are loyal creatures and always overjoyed to see you. They are also cute and cuddly, making them perfect pets.

One of the greatest things about dogs is that they can be trained to obey commands and do tricks. They are also great protectors, which is why they are commonly used for security.

At home, I have a black and white Beagle named Max, who is an absolute delight. Max enjoys playing and going for walks. He is also very affectionate and loves to cuddle while I watch TV.

I strongly recommend dogs as pets to anyone looking for a loyal companion. They will always be there for you, no matter what.`);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [gradingResult, setGradingResult] = React.useState("");
  const [uploadActivity, setUploadActivity] = React.useState("Upload a snapshot of your essay");
  const [promptGuide, setPromptGuide] = React.useState("");
  const [error, setError] = React.useState(null);
  const [chatbotMessages, setChatbotMessages] = useState([]);
  

  async function doPrompt(guide, system) {
    const configuration = new Configuration({
      apiKey: Cookies.get("apiKey"),
    });
    const openai = new OpenAIApi(configuration);

    setEssayText(stripNonAlphanumeric(essayText));
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

    var gptResponse = {
      Grade: "",
      Comments: "",
      Improvements: "",
      Result: result,
    };
    try {
      console.log(result);

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
  
  function stripNonAlphanumeric(str) {
    return str.replace(/[^a-zA-Z0-9.,;\n ]/g, '');
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
  
  async function handleImageUpload(event) {
    const imageFile = event.target.files[0];

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("purpose", "generic-document");

    try {
      const response = await axios.post("https://api.openai.com/v1/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const imageText = await openai.davinciInstructBeta({
        query: {
          data: Buffer.from(response.data.data.content, "base64").toString("utf-8"),
          model: "image-alpha-001",
        },
      });

      setEssayText(imageText.choices[0].text);
    } catch (error) {
      console.log(error);
    }
}


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
      <ConfigButton />
      
      <h1 className="title">Write Your Essay Here</h1>
      <p>Type an essay here. When you submit, we'll provide feedback</p>
          <div>
            <label htmlFor="btnUploadEssayImg" className="mx-4 btn btn-info">{uploadActivity}</label>
      <input
        id="btnUploadEssayImg"
        type="file"
        text="Upload an image of an essay"
        accept="image/*"
        onChange={async (e) => {
          setUploadActivity("Processing...");
          const file = e.target.files[0];
          const imageData = await Tesseract.recognize(file);
          setEssayText(imageData.data.text);
          setUploadActivity("Upload a snapshot of your essay");
        }}
      />
    </div>
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
            name="essayText"
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
      <div className="actions">
      <button className="button-3" onClick={handleSubmit}>
        {activity}
      </button>


      </div>

    </div>
  );
}
