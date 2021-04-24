import React, { useEffect, useState } from "react";
import SearchContainer from "../SearchContainer";

export default function News() {
  return (
    <SearchContainer  showPeople={false} searchKey="news"></SearchContainer>
  );
}
