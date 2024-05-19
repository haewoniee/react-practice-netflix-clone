import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import {
  IGetShowDetailResult,
  IGetShowsResult,
  IMovie,
  ITv,
  getShowDetail,
  getSimilarShows,
} from "../api";
import { useQuery } from "react-query";
import StarRating from "./StarRating";
import Slider from "./Slider";

interface IDetailParams {
  type: "tv" | "movie";
  category: string;
  id: string;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 60vw;
  min-height: 80vh;
  top: 20px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: scroll;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  min-height: 400px;
  max-height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 28px;
  position: absolute;
  width: 100%;
  margin-left: 40px;
  top: 300px;
  font-weight: 600;
`;

const SubTitle = styled.h4`
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  position: absolute;
  width: 100%;
  margin-left: 45px;
  top: 340px;
`;

const BigInfo = styled.div`
  position: relative;
  height: fit-content;
  padding: 20px;
  margin-bottom: 30px;
`;

const BigInfoLeft = styled.div`
  float: left;
  width: 60%;
`;

const BigInfoRight = styled.div`
  float: right;
  text-align: right;
  width: 40%;
`;

const BigOverview = styled.p`
  position: relative;
  padding: 30px;
  padding-top: 20px;
  color: ${(props) => props.theme.white.lighter};
  line-height: 1.8;
`;

const Grade = styled.span<{ $adult: boolean }>`
  background-color: ${({ $adult }) => ($adult ? "red" : "green")};
  border-radius: 30%;
  padding: 5px;
  font-weight: 500;
  margin-left: 10px;
`;

const GenreLabel = styled.span`
  color: gray;
`;

const GenreList = styled.div`
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: end;
  gap: 5px;
`;

const BigTagline = styled.h4`
  font-size: 25px;
  font-style: italic;
  margin-top: 20px;
  margin-left: 30px;
`;

const SliderWrapper = styled(motion.div)`
  position: absolute;
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

function Detail({ type, category, id }: IDetailParams) {
  const history = useHistory();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const keyword = params.get("keyword");
  const onOverlayClick = () => {
    if (keyword) history.push(`/search?keyword=${keyword}`);
    else if (type && type !== "movie") history.push(`/${type}`);
    else history.push("/");
  };
  const { data: detail } = useQuery<IGetShowDetailResult>(
    ["detail", type, id],
    () => getShowDetail(type, id)
  );
  const { data: similarShows } = useQuery<IGetShowsResult<IMovie | ITv>>(
    ["similar", type, id],
    () => getSimilarShows(type, id)
  );
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        animate={{ opacity: 0.5, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      />
      <BigMovie layoutId={`${type}_${category}_${id}`}>
        {detail && (
          <>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  detail.backdrop_path,
                  "w500"
                )})`,
              }}
            >
              <BigTitle>
                {detail.title ?? detail.name}
                {(detail.release_date || detail.first_air_date) && (
                  <span>
                    {" ("}
                    {(detail.release_date || detail.first_air_date).slice(0, 4)}
                    {")"}
                  </span>
                )}
              </BigTitle>
              {detail.original_title && (
                <SubTitle>{detail.original_title} </SubTitle>
              )}
            </BigCover>
            <BigInfo>
              <BigInfoLeft>
                <Grade $adult={detail.adult}>
                  {detail.adult ? "18+" : "All"}
                </Grade>
                <GenreList>
                  <GenreLabel>장르:</GenreLabel>
                  {detail.genres?.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </GenreList>
              </BigInfoLeft>
              <BigInfoRight>
                <StarRating
                  width="15px"
                  height="15px"
                  ratingOutOfTen={detail.vote_average}
                />
              </BigInfoRight>
            </BigInfo>
            {detail.tagline && <BigTagline>"{detail.tagline}"</BigTagline>}
            {detail.overview && <BigOverview>{detail.overview}</BigOverview>}
            <SliderWrapper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {similarShows?.results && similarShows.results.length > 0 && (
                <>
                  <SliderTitle>비슷한 작품들</SliderTitle>
                  <Slider
                    showButtons={false}
                    key="topRated"
                    type={type}
                    category="similar"
                    list={similarShows?.results.slice(0, 6) ?? []}
                    offset={6}
                  />
                </>
              )}
            </SliderWrapper>
          </>
        )}
      </BigMovie>
    </>
  );
}

export default Detail;
