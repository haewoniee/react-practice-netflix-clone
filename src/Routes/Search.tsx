import { useLocation } from "react-router-dom";
import { IGetShowsResult, IMovie, ITv, getSearchResult } from "../api";
import { useQuery } from "react-query";
import { styled } from "styled-components";
import Slider from "../Components/Slider";
import Detail from "../Components/Detail";

const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const Guide = styled.div`
  height: 10vh;
  font-size: 30px;
  margin-left: 30px;
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  min-height: 270px;
`;

const SliderTitle = styled.h3`
  color: white;
  font-size: 25px;
  position: relative;
  margin-left: 15px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const NotFound = styled.div`
  padding: 20px;
  font-size: 20px;
`;

function Search() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const keyword = params.get("keyword");
  const id = params.get("id");
  const type = params.get("type");
  const category = params.get("category");
  const { data: movieResult, isLoading: isMovieLoading } = useQuery<
    IGetShowsResult<IMovie>
  >(["search", "movie", keyword], () => getSearchResult("movie", keyword!));
  const { data: tvResult, isLoading: isTvLoading } = useQuery<
    IGetShowsResult<ITv>
  >(["search", "tv", keyword], () => getSearchResult("tv", keyword!));
  const isLoading = isMovieLoading || isTvLoading;
  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SearchWrapper>
          <Guide>Search Result for: {keyword}</Guide>
          <SliderWrapper>
            <SliderTitle>Movies</SliderTitle>
            {movieResult?.results && movieResult.results.length > 0 ? (
              <Slider
                type="movie"
                category="search_movie"
                list={
                  movieResult.results.sort((a, b) => a.id - b.id).slice(1) ?? []
                }
                offset={6}
              />
            ) : (
              <NotFound>검색 결과가 없습니다.</NotFound>
            )}
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>Tv Shows</SliderTitle>
            {tvResult?.results && tvResult.results.length > 0 ? (
              <Slider
                type="tv"
                category="search_tv"
                list={
                  tvResult.results.sort((a, b) => a.id - b.id).slice(1) ?? []
                }
                offset={6}
              />
            ) : (
              <NotFound>검색 결과가 없습니다.</NotFound>
            )}
          </SliderWrapper>
          {id && category && (
            <Detail
              type={(type as "movie" | "tv") ?? "movie"}
              id={id}
              category={category}
            />
          )}
        </SearchWrapper>
      )}
    </>
  );
}

export default Search;
