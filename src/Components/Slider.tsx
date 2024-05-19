import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import StarRating from "./StarRating";

interface SliderItem {
  id: number;
  backdrop_path: string;
  vote_average: number;
  title?: string;
  name?: string;
}

export interface ISlider<T extends SliderItem> {
  list: T[];
  offset: number;
  type: "tv" | "movie";
  category: string;
  showButtons?: boolean;
}

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  div:first-child {
    transform-origin: center left !important;
  }
  div:last-child {
    transform-origin: center right !important;
  }
`;

const Item = styled(motion.div)<{ $bgPhoto: string }>`
  cursor: pointer;
  height: 200px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  background-image: url(${({ $bgPhoto }) => $bgPhoto}),
    url(${process.env.PUBLIC_URL}/No_Image.png);
  background-size: cover;
  background-position: center center;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  width: 100%;
  bottom: 0;
  position: absolute;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoTitle = styled.h4`
  color: ${(props) => props.theme.white.lighter};
  font-size: 13px;
`;

const NavButton = styled(motion.div)`
  cursor: pointer;
  width: 50px;
  height: 200px;
  position: absolute;
  svg {
    padding: 10px;
    fill: white;
    margin: 0 auto;
    height: 100%;
    width: 100%;
  }
`;

const buttonVariants = {
  hidden: { backgroundColor: "rgba(0,0,0,0)", opacity: 0 },
  hover: {
    backgroundColor: "rgba(0,0,0,0.5)",
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

const iconVariants = {
  hover: {
    opacity: 1,
    scale: 1.1,
    transition: { duration: 0.2, type: "linear" },
  },
};

const rowVariants = {
  hidden: (direction: number) => ({
    x: direction === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
  }),
};

const itemVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 0.7,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

function Slider<T extends SliderItem>({
  list,
  offset,
  type,
  category,
  showButtons = true,
}: ISlider<T>) {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [direction, setDirection] = useState(1);
  const searchMatch = useRouteMatch("/search");
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const keyword = params.get("keyword");

  const increaseIndex = () => {
    if (leaving) return;
    setDirection(1);
    setLeaving(true);
    const totalItems = list.length - 1;
    const maxIndex = Math.ceil(totalItems / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndex = () => {
    if (leaving) return;
    setDirection(-1);
    setLeaving(true);
    const totalItems = list.length - 1;
    const maxIndex = Math.floor(totalItems / offset) - 1;
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const onItemClick = (id: number) => {
    if (searchMatch && keyword)
      history.push(
        `?keyword=${keyword}&type=${type}&category=${category}&id=${id}`
      );
    else history.push(`?type=${type}&category=${category}&id=${id}`);
  };

  return (
    <>
      <AnimatePresence
        custom={direction}
        initial={false}
        onExitComplete={() => setLeaving(false)}
      >
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          custom={direction}
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {list.slice(offset * index, offset * index + offset).map((show) => (
            <Item
              layoutId={`${type}_${category}_${show.id}`}
              key={show.id}
              transition={{ type: "tween" }}
              $bgPhoto={makeImagePath(show.backdrop_path, "w500")}
              variants={itemVariants}
              initial="normal"
              whileHover="hover"
              onClick={() => onItemClick(show.id)}
            >
              <Info variants={infoVariants}>
                <InfoTitle>
                  {show.title ? show.title : show.name ?? ""}
                </InfoTitle>
                <StarRating
                  width="10px"
                  height="10px"
                  ratingOutOfTen={show.vote_average}
                />
              </Info>
            </Item>
          ))}
        </Row>
      </AnimatePresence>
      {showButtons && (
        <>
          <NavButton
            variants={buttonVariants}
            initial="hidden"
            whileHover="hover"
            onClick={decreaseIndex}
            style={{ left: 0 }}
          >
            <motion.svg
              variants={iconVariants}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </motion.svg>
          </NavButton>
          <NavButton
            variants={buttonVariants}
            initial="hidden"
            whileHover="hover"
            onClick={increaseIndex}
            style={{ right: 0 }}
          >
            <motion.svg
              variants={iconVariants}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />{" "}
            </motion.svg>
          </NavButton>
        </>
      )}
    </>
  );
}

export default Slider;
