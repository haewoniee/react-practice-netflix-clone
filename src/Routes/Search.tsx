import { useLocation } from "react-router-dom";
import { IGetShowsResult, IMovie, ITv, getSearchResult } from "../api";
import { useQuery } from "react-query";
import { styled } from "styled-components";
import Slider from "../Components/Slider";

const SearchWrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
`;

const Guide = styled.div`
  height: 10vh;
  font-size: 30px;
  margin-left: 30px;
`;

const SliderWrapper = styled.div`
  position: relative;
  margin-bottom: 50px;
`;

const SliderTitle = styled.h3`
  color: white;
  font-size: 25px;
  position: relative;
  margin-left: 15px;
  font-weight: 600;
  margin-bottom: 10px;
`;
function Search() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");
  const { data: movieResult, isLoading: isMovieLoading } = useQuery<
    IGetShowsResult<IMovie>
  >(["search", "movie", keyword], () => getSearchResult("movie", keyword!));
  const { data: tvResult, isLoading: isTvLoading } = useQuery<
    IGetShowsResult<ITv>
  >(["search", "tv", keyword], () => getSearchResult("tv", keyword!));
  const isLoading = isMovieLoading || isTvLoading;
  return (
    <SearchWrapper>
      <Guide>Search Result for: {keyword}</Guide>
      <SliderWrapper>
        <SliderTitle>Movies</SliderTitle>
        <Slider
          type="movie"
          category="upcoming"
          list={movieResult?.results.slice(1) ?? []}
          offset={6}
        />
      </SliderWrapper>

      <SliderWrapper>
        <SliderTitle>Tv Shows</SliderTitle>
        <Slider
          type="tv"
          category="upcoming"
          list={tvResult?.results.slice(1) ?? []}
          offset={6}
        />
      </SliderWrapper>
    </SearchWrapper>
  );
}

export default Search;
