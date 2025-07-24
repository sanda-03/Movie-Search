import { useState, useEffect } from "react";

const key = "93c068cf";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      async function fetchmovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`
          );

          if (!res.ok) throw new Error("Abe Net kharab hein be tumhara");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not Found");
          setMovies(data.Search);
          console.log(data.Search);
          setIsLoading(false);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length === 0) {
        setMovies([]);
        setError("");
        return;
      }
      fetchmovies();
    },
    [query]
  );

  return { movies, isLoading, error };
}
