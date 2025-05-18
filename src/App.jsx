import React, { useState, useEffect } from "react";
import "./WordFinder.css"; // You'll create this CSS file

function WordFinder() {
  const [letters, setLetters] = useState(["", "", "", "", ""]);
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    fetch("/french5.txt")
      .then((res) => res.text())
      .then((text) => {
        const words = text.split("\n").map((w) => w.trim().toUpperCase());
        setWordList(words);
      });
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);
  };

  const getMatchingWords = () => {
    const pattern = letters.map((c) => (c === "" ? "." : c)).join("");
    const regex = new RegExp("^" + pattern + "$");
    return wordList.filter((word) => regex.test(word));
  };

  return (
    <div className="wordfinder-container">
      <div className="wordfinder-card">
        <h1>Chercheur de mots (5 lettres)</h1>
        <div className="inputs">
          {letters.map((char, idx) => (
            <input
              key={idx}
              type="text"
              value={char}
              maxLength={1}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="letter-input"
            />
          ))}
        </div>
        <div className="results">
          <h2>Suggestions :</h2>
          <ul>
            {getMatchingWords().map((word, idx) => (
              <li key={idx}>{word}</li>
            ))}
          </ul>
          {getMatchingWords().length === 0 && (
            <p className="empty">Aucun mot trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WordFinder;
