import { useState } from "react";

// Define types based on the API response structure
interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string; // example is optional
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
    sourceUrl?: string; // optional
    license?: { // optional
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
    setNotFoundError(false); // Reset error state on new search
    setDictionaryEntries(null); // Clear previous results

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`, {
        method: "GET"
      });

      if (!response.ok) {
        if (response.status === 404) {
          setNotFoundError(true);
        } else {
           console.error("API error:", response.status);
           // Optionally handle other errors here
        }
        return; // Stop processing if not OK
      }

      const data = await response.json();

      // Assuming data is an array based on the API docs for successful responses
      setDictionaryEntries(data);

    } catch (error) {
      console.error("Fetch error:", error);
      // Optionally handle network errors here
    }
  }

  return (
    <>
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

      <div className="word">
        {/* Display dictionary entries */}
        {notFoundError ? (
          <div>
            <h2>No Definitions Found</h2>
            <p>Sorry pal, we couldn't find definitions for the word you were looking for.</p>
            <p>You can try the search again at later time or head to the web instead.</p>
          </div>
        ) : (
          dictionaryEntries && dictionaryEntries.map((entry: DictionaryEntry, index) => {
            // Find the first phonetic entry with an audio link
            const audioPhonetic = entry.phonetics.find(p => p.audio);

            // Function to play the audio
            const playAudio = () => {
              if (audioPhonetic && audioPhonetic.audio) {
                const audio = new Audio(audioPhonetic.audio);
                audio.play();
              }
            };

            return (
              <div key={index}>
                {/* Added style to make the word bigger and use a different font */}
                <h2 style={{ fontSize: '2.5em', fontFamily: 'serif' }}>{entry.word}</h2>
                {/* Display the phonetic text if available and make it clickable */}
                {/* Add an onClick handler to play the audio */}
                {/* Added a style to indicate it's clickable (optional) */}
                {entry.phonetic && (
                  <p
                    onClick={playAudio}
                    style={{ cursor: audioPhonetic ? 'pointer' : 'default', textDecoration: 'none' }}
                  >
                    {/* Add sound icon if audio is available */}
                    {entry.phonetic}
                    {audioPhonetic && <span> 🗣️</span>}
                  </p>
                )}

                {/* Display meanings and definitions */}
                {entry.meanings.map((meaning, meaningIndex) => (
                  <div key={meaningIndex}>
                    <h3>{meaning.partOfSpeech}</h3>
                    {/* Display definitions as an unordered list if there are multiple, otherwise display as paragraphs */}
                    {meaning.definitions.length > 1 ? (
                      <ul>
                        {meaning.definitions.map((definition, definitionIndex) => (
                          <li key={definitionIndex}>
                            {definition.definition}
                            {definition.example && <p><strong>Example:</strong> {definition.example}</p>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      meaning.definitions.map((definition, definitionIndex) => (
                        <div key={definitionIndex}>
                          <p><strong>Definition:</strong> {definition.definition}</p>
                          {definition.example && <p><strong>Example:</strong> {definition.example}</p>}
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
