import { useQuery } from "react-query";
import styled from "styled-components";
import { getShows, IGetShowsResult, IMovie } from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";
import { useLocation } from "react-router-dom";
import Detail from "../Components/Detail"; // Adjust the import path as needed

const Wrapper = styled.div`
  background: black;
  overflow: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${({ $bgPhoto }) => $bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
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

function Home() {
  const { data: nowPlayingMovies, isLoading: isNowPlayingLoading } = useQuery<
    IGetShowsResult<IMovie>
  >(["movies", "nowPlaying"], () => getShows("movie", "now_playing"));
  const { data: topRatedMovies, isLoading: isTopRatedLoading } = useQuery<
    IGetShowsResult<IMovie>
  >(["movies", "top_rated"], () => getShows("movie", "top_rated"));
  const { data: upcomingMovies, isLoading: isUpcomingLoading } = useQuery<
    IGetShowsResult<IMovie>
  >(["movies", "upcoming"], () => getShows("movie", "upcoming"));
  const isLoading =
    isNowPlayingLoading || isTopRatedLoading || isUpcomingLoading;
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);
  const id = params.get("id");
  const category = params.get("category");
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              nowPlayingMovies?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingMovies?.results[0].title}</Title>
            <Overview>{nowPlayingMovies?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <SliderTitle>지금 방영 중</SliderTitle>
            <Slider
              key="nowPlaying"
              type="movie"
              category="now_playing"
              list={nowPlayingMovies?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>가장 높은 별점</SliderTitle>
            <Slider
              key="topRated"
              type="movie"
              category="top_rated"
              list={topRatedMovies?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>방영 예정작</SliderTitle>
            <Slider
              key="upcoming"
              type="movie"
              category="upcoming"
              list={upcomingMovies?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          {id && category && (
            <Detail type="movie" id={id} category={category} />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
