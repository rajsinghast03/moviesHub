import { useState, useEffect } from "react";

const KEY = process.env.REACT_APP_API_KEY;

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", "app-ims");
  urlencoded.append("grant_type", "password");
  urlencoded.append("username", "forkit-hackathon");
  urlencoded.append("password", "forkitiiitdelhi");
  urlencoded.append("scope", "openid");

  const requestOptions = {
    method: "POST",
    body: urlencoded,
    redirect: "follow",
  };

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?&apikey=${KEY}&s=${query}`,
            requestOptions
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
