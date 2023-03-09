import * as React from "react";
import { animated } from "react-spring";
import { useWiggle } from "../hooks/wiggle";
import { Link } from "wouter";

// Our language strings for the header
const strings = [
  "SEA - the essay",
  "MASTER SEA ESSAYS",
  "YOU CAN DO IT",
  "CONQUER YOUR FEAR",
  "YES, YOU CAN",
];

// Utility function to choose a random value from the language array
function randomLanguage() {
  var result = strings[Math.floor(Math.random() * strings.length)];
  console.log(result);
  return result;
}

export default function Start() {
  const [hello, setHello] = React.useState(randomLanguage());
  const [style, trigger] = useWiggle({ x: 5, y: 5, scale: 1 });

  const handleChangeHello = () => {
    const newHello = randomLanguage();
    setHello(newHello);
  };

  return (
    <div className="front-matter">
      <div className="left-column">
        <h2>{hello}</h2>
        <h1>BE A GREAT WRITER</h1>
      </div>
      <div className="right-column">
        <div className="upper-right-section">
          <h3>TRY AS OFTEN AS YOU LIKE</h3>
          <button id="btn-get-started"><Link href="/essay">GET STARTED</Link></button>
        </div>
        <div className="lower-right-section"></div>
      </div>
    </div>
  );
}
