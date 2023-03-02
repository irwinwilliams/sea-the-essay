import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState("");

  // Load the API key from the cookie when the component mounts
  useEffect(() => {
    const savedApiKey = Cookies.get("openai_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save the API key to a cookie when it changes
  useEffect(() => {
    Cookies.set("openai_api_key", apiKey);
  }, [apiKey]);

  // Handle changes to the API key input field
  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <div>
      <label for="api-key-input">OpenAI API Key:</label>
      <input
        type="text"
        id="api-key-input"
        value={apiKey}
        onChange={handleApiKeyChange}
      />
    </div>
  );
};

export default ApiKeyConfig;
