import React, { useEffect, useState } from 'react';

const MoviePicker = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [randomMovie, setRandomMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cast, setCast] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');

    // Fetch genres from TMDb
    useEffect(() => {
        const fetchGenres = async () => {
            const response = await fetch(
                `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
            );
            const data = await response.json();
            setGenres(data.genres);
        };

        fetchGenres();
    }, []);

    // Fetch random movie based on selected genre
    const fetchRandomMovie = async () => {
        setLoading(true);
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${selectedGenre}`
        );
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const selectedMovie = data.results[randomIndex];
        setRandomMovie(selectedMovie);
        await fetchAdditionalMovieDetails(selectedMovie.id);
        setLoading(false);
    };

    // Fetch additional movie details: cast, reviews, and trailer
    const fetchAdditionalMovieDetails = async (movieId) => {
        const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=credits,reviews,videos`
        );
        const detailsData = await detailsResponse.json();

        // Set the additional movie data
        setCast(detailsData.credits.cast);
        setReviews(detailsData.reviews.results);

        // Find the trailer URL
        const trailer = detailsData.videos.results.find(video => video.type === 'Trailer');
        setTrailerUrl(trailer ? `https://www.youtube.com/embed/${trailer.key}` : '');
    };

    return (
        <div>
            <select
                onChange={(e) => setSelectedGenre(e.target.value)}
                value={selectedGenre}
            >
                <option value="" disabled>Select Genre</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
            <button onClick={fetchRandomMovie} disabled={!selectedGenre}>
                Get
            </button>

            {loading && <p>Loading...</p>}
            {randomMovie && (
                <div className="movie-details">
                    {randomMovie.poster_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${randomMovie.poster_path}`}
                            alt={randomMovie.title}
                        />
                    )}

                    <h2>{randomMovie.title}</h2>
                    <p>{randomMovie.overview}</p>
                    <p><strong>Release Date:</strong> {randomMovie.release_date}</p>

                    {trailerUrl && (
                        <div>
                            <h3>Trailer</h3>
                            <iframe
                                width="560"
                                height="315"
                                src={trailerUrl}
                                title="Trailer"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

                    <h3>Casts</h3>
                    <p>{cast.map(actor => actor.name).join(', ')}</p>

                    <h3>User Reviews</h3>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id}>
                                <p><strong>{review.author}:</strong> {review.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available for this movie.</p>
                    )}

                </div>
            )}
        </div>
    );
};

export default MoviePicker;
