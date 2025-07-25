import React, { useState, useEffect } from "react";
import "./WordFinder.css";

function WordFinder() {
  const [letters, setLetters] = useState(["", "", "", "", ""]);
  const [wordList, setWordList] = useState([]);
  const [excludedLetters, setExcludedLetters] = useState(new Set());

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

  const toggleExcluded = (letter) => {
    const newSet = new Set(excludedLetters);
    if (newSet.has(letter)) {
      newSet.delete(letter);
    } else {
      newSet.add(letter);
    }
    setExcludedLetters(newSet);
  };

  const getMatchingWords = () => {
    const pattern = letters.map((c) => (c === "" ? "." : c)).join("");
    const regex = new RegExp("^" + pattern + "$");
    return wordList.filter((word) => {
      if (!regex.test(word)) return false;
      for (let letter of excludedLetters) {
        if (word.includes(letter)) return false;
      }
      return true;
    });
  };

  return (
    <div className="wordfinder-container">
      <div className="instructions-panel">
        <h3>Mode d'emploi:</h3>
        <ul>
          <li>Saisissez les lettres connues dans les cases</li>
          <li>Cliquez sur les lettres à exclure</li>
          <li>Les mots potentiels apparaîtront automatiquement</li>
        </ul>
      </div>
      
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
          <div className="alphabet-filter-title"><h2>Exclusions</h2></div>
        <div className="alphabet-filter">
          
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              className={`letter-button ${excludedLetters.has(letter) ? "excluded" : ""
                }`}
              onClick={() => toggleExcluded(letter)}
            >
              {letter}
            </button>
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
      
      {/* <div className="ad-panel">
        <h3>Publicité <br/>(désactivez adblock pour soutenir le développeur)</h3>
        <div className="ad-content">
          <p>Espace publicitaire</p>
          <p>Votre message ici</p>
        </div>
      </div> */}
      
      <footer className="footer">
        {new Date().getFullYear()} fait avec ❤️ par <a href="https://github.com/Marma92" target="_blank" rel="noopener noreferrer">Marma92</a>
      </footer>
    </div>
  );
}

export default WordFinder;
