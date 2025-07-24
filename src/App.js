import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import useLocalStorageState from "./useLocalStorageState";
import useKey from "./useKey";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(1);

const key = //get your own omdb api key;

export default function App() {
  const [selectedmovie, setSelectedmovie] = useState(null);
  const [query, setQuery] = useState("");

  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });

  function closeMovieInfo() {
    setSelectedmovie(null);
  }

  function handleSelectedmovie(id) {
    setSelectedmovie((selectedmovie) => (selectedmovie === id ? null : id));
  }

  function handleAddMovie(movie, isWatched) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleRemove(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

  return (
    <>
      <NavigationBar movies={movies}>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavigationBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <List
              movies={movies}
              selectedmovie={selectedmovie}
              setSelectedmovie={handleSelectedmovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        {/* <Box>{isLoading ? <Loader /> : <List movies={movies} />}</Box> */}

        <Box>
          {selectedmovie ? (
            <MovieInfo
              selectedmovie={selectedmovie}
              closeMovieInfo={closeMovieInfo}
              onAddMovie={handleAddMovie}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <ListWatched
                watched={watched}
                selectedmovie={selectedmovie}
                setSelectedmovie={setSelectedmovie}
                handleRemove={handleRemove}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavigationBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       inputEl.current.focus();
  //       if (e.code === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return () => document.removeEventListener("keydown", callback);
  //   },
  //   [setQuery]
  // );
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function Loader() {
  return <p className="loader">LOADING...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error"> {message} </p>;
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function ListWatched({ watched, setSelectedmovie, handleRemove }) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          setSelectedmovie={setSelectedmovie}
          watched={watched}
          handleRemove={handleRemove}
        />
      ))}
    </ul>
  );
}
function List({ movies, setSelectedmovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie2
          movie={movie}
          key={movie.imdbID}
          setSelectedmovie={setSelectedmovie}
        />
      ))}
    </ul>
  );
}
function Movie2({ movie, setSelectedmovie }) {
  return (
    <li key={movie.imdbID} onClick={() => setSelectedmovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Movie({ movie, setSelectedmovie, handleRemove }) {
  return (
    <li key={movie.imdbID}>
      <div onClick={() => setSelectedmovie(movie.imdbID)}>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => handleRemove(movie.imdbID)}>
        &#x274c;
      </button>
    </li>
  );
}

function MovieInfo({ selectedmovie, closeMovieInfo, onAddMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRating] = useState("");

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedmovie);
  const userRating = isWatched
    ? watched[watched.map((movie) => movie.imdbID).indexOf(selectedmovie)]
        .userRating
    : 0;

  const countRef = useRef(0);

  useEffect(
    function () {
      if (rate) countRef.current = countRef.current + 1;
    },
    [rate]
  );

  const {
    Title: title,
    Year: year,
    Released: released,
    Poster: poster,
    Runtime: runtime,
    imdbRating: rating,
    Director: dir,
    Genre: genre,
    Actors: actors,
    Plot: plot,
  } = movie;

  // if (rating > 8) {
  //   const [isTop, setIsTop] = useState(true);
  // }
  function handleAdd() {
    const newwatchedmovie = {
      imdbRating: Number(rating),
      userRating: Number(rate),
      countRatingDecisions: countRef.current,
      title,
      year,
      poster,
      imdbID: selectedmovie,
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddMovie(newwatchedmovie);
  }

  useKey("escape", closeMovieInfo);
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         closeMovieInfo();
  //         console.log("Closing");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [closeMovieInfo]
  // );

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&i=${selectedmovie}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          console.log(data);
          setIsLoading(false);
          setMovie(data);
        } catch (err) {
          if (err.name !== "AbortError") {
            setIsLoading(false);
          }
        }
      }
      fetchMovieDetails();

      return function () {
        controller.abort();
      };
    },
    [selectedmovie]
  );

  useEffect(
    function () {
      function setTitle() {
        if (!title) return;
        document.title = `Movie | ${title}`;
      }
      setTitle();
      return function () {
        document.title = `usePopcorn`;
      };
    },
    [title]
  );
  console.log("render");
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <img src={`${poster}`} alt={`${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐️ {rating} IMDb Rating</p>
            </div>
            <button className="btn-back" onClick={() => closeMovieInfo()}>
              &larr;
            </button>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You Watched The Movie and rated it a {userRating} ⭐️</p>
              ) : (
                <>
                  <StarRating
                    maxrating={10}
                    size={24}
                    defaultrating={0}
                    onsetRating={setRating}
                  />
                  {rate > 0 && (
                    <button className="btn-add" onClick={() => handleAdd()}>
                      Add to the List
                    </button>
                  )}
                </>
              )}
            </div>
            <em>{plot}</em>
            <p>Starring</p>
            <em>{actors}</em>
            <p>Directed By</p>
            <em>{dir}</em>
          </section>
        </>
      )}
    </div>
  );
}
