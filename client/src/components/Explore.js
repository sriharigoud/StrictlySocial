import React, { useEffect, useState } from "react";
import ExportLink from './ExploreLink';
export default function Explore({hideExplore}) {
  const [Links, setLinks] = useState([
    {
      url: "news",
      name: "News",
      icon: "fa-newspaper-o",
    },
    {
      url: "covid-19",
      name: "Covid-19",
      icon: "fa-medkit",
    },
    {
      url: "entertainment",
      name: "Entertainment",
      icon: "fa-film",
    },
    {
      url: "sports",
      name: "Sports",
      icon: "fa-trophy",
    },
    {
      url: "science",
      name: "Science",
      icon: "fa-flask",
    },
    {
      url: "technology",
      name: "Technology",
      icon: "fa-cogs",
    },
    {
      url: "business",
      name: "Business",
      icon: "fa-briefcase",
    },
  ]);
  useEffect(() => {});
  return (
    <div className={!hideExplore ? "card mt-2 mb-0 gedf-card" : "card mt-2 mb-0 gedf-card d-none d-md-block"}>
      <div className="card-body px-2">
        <h5 className="card-title mb-2">Explore</h5>
        <div className="card-text border-top border-bottom">
          <ul className="list-group custom-nav border-0 mt-0 px-0 pt-0 list-group-flush">
            {Links.map((LinkData, id) => (
              <ExportLink LinkData={LinkData} key={id} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
