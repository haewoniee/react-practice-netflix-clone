const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  first_air_date: string;
  release_data: string;
  adult: boolean;
  vote_average: number;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  first_air_date: string;
  release_data: string;
  adult: boolean;
  vote_average: number;
}

export interface IGetShowsResult<T> {
  dates: {
    mininum: string;
    maximum: string;
  };
  page: number;
  results: T[];
  total_pages: number;
  total_Results: number;
}

export interface IGetShowDetailResult {
  adult: false;
  title: string;
  name: string;
  backdrop_path: string;
  genres: [{ id: number; name: string }];
  tagline: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  runtime: number;
  release_date: string;
  first_air_date: string;
  original_title: string;
}

export function getShows(
  type: "tv" | "movie",
  category:
    | "now_playing"
    | "top_rated"
    | "upcoming"
    | "popular"
    | "top_rated"
    | "on_the_air"
    | "airing_today"
) {
  return fetch(
    `${BASE_PATH}/${type}/${category}?api_key=${API_KEY}&language=ko-KO&region=KR`
  ).then((res) => res.json());
}

export function getShowDetail(type: "tv" | "movie", movie_id: string) {
  return fetch(
    `${BASE_PATH}/${type}/${movie_id}?api_key=${API_KEY}&language=ko-KO&region=KR`
  ).then((res) => res.json());
}

export function getSearchResult(type: "tv" | "movie", keyword: string) {
  return fetch(
    `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}&language=ko-KO&region=KR`
  ).then((res) => res.json());
}

export function getSimilarShows(type: "tv" | "movie", id: string) {
  return fetch(
    `${BASE_PATH}/${type}/${id}/similar?api_key=${API_KEY}&language=ko-KO&region=KR`
  ).then((res) => res.json());
}
