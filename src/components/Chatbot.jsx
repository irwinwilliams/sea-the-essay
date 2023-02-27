import React from "react";

function Chatbot({ messages }) {
  console.log(messages);
  return (
    <div className="chatbot">
      {messages &&  messages.map((message, index) => (
        <div key={index} className="message">
          <div className="avatar">
            <img src={message.avatar} alt="Avatar" />
          </div>
          <div className="text">
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chatbot;
