import { render, screen } from "@testing-library/react";
import StarRating from "./StarRating";
import { assets } from "../assets/assets";
import React from "react";

jest.mock("../assets/assets", () => ({
  assets: {
    starIconFilled: "filled.svg",
    starIconOutlined: "outlined.svg",
  },
}));

describe("StarRating", () => {
  it("renders the correct number of filled and outlined stars based on the rating prop", () => {
    render(<StarRating rating={3} />);

    const filledStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconFilled));
    const outlinedStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconOutlined));

    expect(filledStars).toHaveLength(3);
    expect(outlinedStars).toHaveLength(2);
  });

  it("renders all outlined stars when rating is 0", () => {
    render(<StarRating rating={0} />);

    const filledStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconFilled));
    const outlinedStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconOutlined));

    expect(filledStars).toHaveLength(0);
    expect(outlinedStars).toHaveLength(5);
  });

  it("renders all filled stars when rating is 5", () => {
    render(<StarRating rating={5} />);

    const filledStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconFilled));
    const outlinedStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconOutlined));

    expect(filledStars).toHaveLength(5);
    expect(outlinedStars).toHaveLength(0);
  });

  it("renders 4 filled stars by default if no rating prop is provided", () => {
    render(<StarRating />);

    const filledStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconFilled));
    const outlinedStars = screen
      .getAllByAltText("star-icon")
      .filter((star) => star.src.includes(assets.starIconOutlined));

    expect(filledStars).toHaveLength(4);
    expect(outlinedStars).toHaveLength(1);
  });
});
