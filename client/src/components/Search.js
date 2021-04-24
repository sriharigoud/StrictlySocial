import React, { useEffect } from "react";
import { useLocation } from "react-router";
import SearchContainer from "./SearchContainer";

export default function Search() {
  const { key, pathname } = useLocation();

  useEffect(() => {
  });
  return (
    <SearchContainer showPeople={true} searchKey={pathname.replace("/search/", "")}></SearchContainer>
  );
}
