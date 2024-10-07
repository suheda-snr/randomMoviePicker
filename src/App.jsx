import React from 'react';
import MoviePicker from './MoviePicker';

function App() {
  return (
    <div className="App">
      <h1>Random Movie Picker</h1>
      <p>Feeling overwhelmed by the endless options? Let us help you pick a movie! Select a category below and discover a random movie to watch.</p>
      <MoviePicker />
    </div>
  );
}

export default App;