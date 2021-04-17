import React from "react";
import { BrowserRouter as Router, useRouteMatch } from "react-router-dom";

import { Carousel, Row, Col } from "react-bootstrap";
export default function Main() {

  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="http://placekitten.com/800/400"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="http://placekitten.com/800/400"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="http://placekitten.com/800/400"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
