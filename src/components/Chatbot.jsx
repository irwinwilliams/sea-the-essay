import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography } from "@material-ui/core";

function Chatbot({ messages }) {
  const [tabIndex, setTabIndex] = useState(0);

  // Group messages by area
  const messagesByArea = {
    Content: [],
    Language: [],
    Grammar: [],
    Organization: [],
  };
  messages.forEach((message) => {
    const { area } = message;
    messagesByArea[area].push(message);
  });

  // Create tabs for each area
  const tabs = Object.keys(messagesByArea).map((area, index) => (
    <Tab key={index} label={area} />
  ));

  // Render messages for the selected area
  const renderMessages = () => {
    const area = Object.keys(messagesByArea)[tabIndex];
    const messages = messagesByArea[area];
    return messages.map((message, index) => (
      <div key={index} className="message">
        <div className="avatar">
          <img src={message.avatar} alt="Avatar" />
        </div>
        <div className="text">
          <Typography variant="body1">{message.text}</Typography>
        </div>
      </div>
    ));
  };

  return (
    <div className="chatbot">
      <Tabs value={tabIndex} onChange={(e, index) => setTabIndex(index)}>
        {tabs}
      </Tabs>
      <div className="messages">{renderMessages()}</div>
    </div>
  );
}

Chatbot.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      text: PropTypes.string,
      area: PropTypes.oneOf(["Content", "Language", "Grammar", "Organization"]),
    })
  ),
};

export default Chatbot;
