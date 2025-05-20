import { useState } from "react";

interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Phonetic {
    text: string;
    audio: string;
    sourceUrl?: string;
    license?: {
        name: string;
        url: string;
    }
}

interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

function App() {

  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notFoundError, setNotFoundError] = useState(false);

  async function findWord() {
    setNotFoundError(false);
    setDictionaryEntries(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`, {
        method: "GET"
      });

      if (!response.ok) {
        if (response.status === 404) {
          setNotFoundError(true);
        } else {
           console.error("API error:", response.status);
        }
        return;
      }

      const data = await response.json();

      setDictionaryEntries(data);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Dictionary</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              findWord();
            }
          }}
        />
        <button onClick={findWord}>Search</button>
      </div>

      <div className="word">
        {notFoundError ? (
          <div>
            <h2>No Definitions Found</h2>
            <p>Sorry pal, we couldn't find definitions for the word you were looking for.</p>
            <p>You can try the search again at later time or head to the web instead.</p>
          </div>
        ) : (
          dictionaryEntries && dictionaryEntries.map((entry: DictionaryEntry, index) => {
            const audioPhonetic = entry.phonetics.find(p => p.audio);

            const playAudio = () => {
              if (audioPhonetic && audioPhonetic.audio) {
                const audio = new Audio(audioPhonetic.audio);
                audio.play();
              }
            };

            return (
              <div key={index}>
                <h2 style={{ fontSize: '2.5em', fontFamily: 'serif' }}>{entry.word}</h2>
                {entry.phonetic && (
                  <p
                    onClick={playAudio}
                    style={{ cursor: audioPhonetic ? 'pointer' : 'default', textDecoration: 'none' }}
                  >
                    {entry.phonetic}
                    {audioPhonetic && <span> 🗣️</span>}
                  </p>
                )}

                {entry.meanings.map((meaning, meaningIndex) => (
                  <div key={meaningIndex}>
                    <h3>{meaning.partOfSpeech}</h3>
                    {meaning.definitions.length > 1 ? (
                      <ul>
                        {meaning.definitions.map((definition, definitionIndex) => (
                          <li key={definitionIndex}>
                            {definition.definition}
                            {definition.example && <p style={{ backgroundColor: '#f0f0f0', padding: '5px', fontStyle: 'italic' }}>{definition.example}</p>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      meaning.definitions.map((definition, definitionIndex) => (
                        <div key={definitionIndex}>
                          <p><strong>Definition:</strong> {definition.definition}</p>
                          {definition.example && <p style={{ backgroundColor: '#f0f0f0', padding: '5px', fontStyle: 'italic' }}>{definition.example}</p>}
                        </div>
                      ))
                    )}
                    {meaning.antonyms && meaning.antonyms.length > 0 && (
                      <p><strong>Antonyms:</strong> {meaning.antonyms.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </>
  )
}

export default App
