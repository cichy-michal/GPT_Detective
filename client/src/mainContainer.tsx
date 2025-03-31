import React, { useEffect, useState } from "react";
import { FaSpinner } from 'react-icons/fa';

export const MainContainer = () => {
  const [backendData, setBackendData] = useState([{}]);
  const [isAi, setIsAi] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  interface ApiResponse {
    isAi: string;
  }

  useEffect(() => {
    if (loading) {
      fetch(`https://GPTD-lb-433075978.us-east-1.elb.amazonaws.com/api?text=${encodeURIComponent(inputText)}`)
        .then(response => response.json())
        .then((data: ApiResponse) => {
          setIsAi(data.isAi);
          setLoading(false);
        })
        .catch(error => {
          console.error('Błąd podczas pobierania danych z API:', error);
          setLoading(false);
        });
    }
  }, [loading, inputText]);

  function LoadingSpinner() {
    return (
      <div id="lds-ring"><div></div><div></div><div></div><div></div></div>
    );
  }

  function handleClick() {
    setLoading(true);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value); // Aktualizujemy stan danych wprowadzonych przez użytkownika
  }

  return (
    <div className="main-container">
      <div id="little"><div id="margin"></div></div>
      <div id="big">
        <h1>Projekt zespołowy</h1>
        <p>Projekt wtyczki zaprojektowany przez studentów Politecniki Wrocławskiej, pozwalający sprawdzić czy dany artykuł został wygenerowany przez ChatGPT, czy napisany przez człowieka.</p>
        <form>
        <input type="text" id="s" name="sdas" placeholder="Wklej treść artykułu" value={inputText} onChange={handleInputChange}></input>
          <button type="button" id="guziczek" onClick={handleClick}>Sprawdź</button>
        </form>
        <div>
          {/* Warunek renderowania na podstawie wartości isAi */}
          {loading ? (
            <LoadingSpinner />
          ) : isAi === "Human" ? (
            <p className="result">Artykuł napisany przez człowieka.</p>
          ) : isAi === "AI" ? (
            <p className="result">Artykuł napisany przez (AI).</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}