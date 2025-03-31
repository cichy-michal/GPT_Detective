import React, { useState, ChangeEvent, FormEvent } from 'react';

const YourComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Zapobiegamy domyślnej akcji formularza

    try {
      // Wysyłamy dane z pola input do endpointa AWS
      const response = await fetch('https://your-aws-endpoint-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputValue }),
      });

      // Obsługujemy odpowiedź od serwera, jeśli to konieczne
      const responseData = await response.json();
      console.log('Response from AWS:', responseData);
      
      // Możesz dodać obsługę odpowiedzi tutaj

    } catch (error) {
      console.error('Error sending data to AWS:', error);
      // Obsługa błędów, np. wyświetlenie komunikatu użytkownikowi
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="url"
        name="url"
        placeholder="Wklej link do artykułu"
        value={inputValue}
        onChange={handleChange}
      />
      <input type="submit" id="check" value="Sprawdź" />
    </form>
  );
};

export default YourComponent;
