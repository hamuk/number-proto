import React, { useState, useEffect } from "react";
import "./App.css";

const synth = window.speechSynthesis;

function getRandomInt(min, max) {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min
  );
}

function ask(value, rate, langOne) {
  return new Promise((resolve, reject) => {
    console.log("asking");

    if (synth.speaking) {
      reject("already speaking");
    }

    const utter = new SpeechSynthesisUtterance(value);
    utter.onend = () => {
      console.log("done asking");
      resolve();
    };

    utter.pitch = 1;
    utter.rate = rate;
    utter.lang = langOne;

    synth.speak(utter);
  });
}

function answer(value, rate, langTwo) {
  return new Promise((resolve, reject) => {
    console.log("answering");

    if (synth.speaking) {
      reject("already speaking");
    }

    const utter = new SpeechSynthesisUtterance(value);
    utter.onend = () => {
      console.log("done answering");
      resolve();
    };

    utter.pitch = 1;
    utter.rate = rate;
    utter.lang = langTwo;

    synth.speak(utter);
  });
}

async function askQuestion(rate, langOne, langTwo, range, delay) {
  const value = getRandomInt(0, range);
  await ask(value, rate, langOne);
  await new Promise(resolve => setTimeout(resolve, delay));
  await answer(value, rate, langTwo);
  await new Promise(resolve => setTimeout(resolve, 1000)); // next question delay
}

function App() {
  const [rate, setRate] = useState(1.0);
  const [langOne, setLangOne] = useState("ja-JP");
  const [langTwo, setLangTwo] = useState("en-GB");
  const [range, setRange] = useState(1000);
  const [delay, setDelay] = useState(1000);
  const [started, setStarted] = useState(false);

  async function start() {
    console.log("starting");
    setStarted(true);
  }

  useEffect(() => {
    // this is pretty buggy if you start and stop it in quick succession but w/e
    let cancel = !started;
    async function doIt() {
      while (!cancel) {
        await askQuestion(rate, langOne, langTwo, range, delay);
      }
    }
    doIt();

    return () => {
      cancel = true;
    };
  }, [rate, langOne, langTwo, range, delay, started]);

  return (
    <div className="App">
      <div style={{ marginBottom: 10 }}>
        <div>Rate</div>
        <select value={rate} onChange={evt => setRate(evt.target.value)}>
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1.0}>1.0x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div>Lang One</div>
        <select value={langOne} onChange={evt => setLangOne(evt.target.value)}>
          <option value="ja-JP">ja-JP</option>
          <option value="en-GB">en-GB</option>
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div>Lang Two</div>
        <select value={langTwo} onChange={evt => setLangTwo(evt.target.value)}>
          <option value="ja-JP">ja-JP</option>
          <option value="en-GB">en-GB</option>
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div>Number Range</div>
        <select value={range} onChange={evt => setRange(evt.target.value)}>
          <option value={100}>0-100</option>
          <option value={1000}>0-1000</option>
          <option value={10000}>0-10000</option>
          <option value={100000}>0-100000</option>
          <option value={1000000}>0-1000000</option>
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div>Answer Delay</div>
        <select value={delay} onChange={evt => setDelay(evt.target.value)}>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
          <option value={2000}>2000</option>
          <option value={3000}>3000</option>
          <option value={5000}>5000</option>
        </select>
      </div>
      {!started && (
        <button type="button" onClick={start}>
          Speak
        </button>
      )}

      {started && (
        <button type="button" onClick={() => setStarted(false)}>
          Stop
        </button>
      )}
    </div>
  );
}

export default App;
