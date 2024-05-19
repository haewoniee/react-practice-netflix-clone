import { useQuery } from "react-query";
import styled from "styled-components";
import { getShows, IGetShowsResult, ITv } from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";
import { useRouteMatch } from "react-router-dom";
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

function Tv() {
  const { data: nowPlayingTv, isLoading: isNowPlayingLoading } = useQuery<
    IGetShowsResult<ITv>
  >(["movies", "on_the_air"], () => getShows("tv", "on_the_air"));
  const { data: topRatedMovies, isLoading: isTopRatedLoading } = useQuery<
    IGetShowsResult<ITv>
  >(["movies", "airing_today"], () => getShows("tv", "airing_today"));
  const { data: upcomingMovies, isLoading: isUpcomingLoading } = useQuery<
    IGetShowsResult<ITv>
  >(["movies", "popular"], () => getShows("tv", "popular"));
  const { data: upcomingMovies2, isLoading: isUpcomingLoading2 } = useQuery<
    IGetShowsResult<ITv>
  >(["movies", "top_rated"], () => getShows("tv", "top_rated"));
  const isLoading =
    isNowPlayingLoading ||
    isTopRatedLoading ||
    isUpcomingLoading ||
    isUpcomingLoading2;

  const match = useRouteMatch<{ category: string; id: string }>(
    `/tv/:category/:id`
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              nowPlayingTv?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingTv?.results[0].name}</Title>
            <Overview>{nowPlayingTv?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <SliderTitle>지금 방영 중</SliderTitle>
            <Slider
              type="tv"
              category="airing_today"
              list={topRatedMovies?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>7일 안에 방영 예정작</SliderTitle>
            <Slider
              category="on_the_air"
              type="tv"
              list={nowPlayingTv?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>가장 인기있는 시리즈</SliderTitle>
            <Slider
              type="tv"
              category="popular"
              list={upcomingMovies?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>가장 높은 별점</SliderTitle>
            <Slider
              type="tv"
              category="top_rated"
              list={upcomingMovies2?.results.slice(1) ?? []}
              offset={6}
            />
          </SliderWrapper>
          {match && (
            <Detail
              type="tv"
              id={match.params.id}
              category={match.params.category}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
