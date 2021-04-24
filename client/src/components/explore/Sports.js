import React, { useEffect, useState } from "react";
import SearchContainer from "../SearchContainer";

export default function Sports() {
  return (
    <SearchContainer  showPeople={false} searchKey="sports"></SearchContainer>
  );
}
