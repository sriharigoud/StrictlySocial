import React from "react";
import { Image, Transformation } from "cloudinary-react";

export default function DynamicImg({
  imageName,
  avatar,
  CSSClassName,
  width,
  height,
}) {
  return (
    <React.Fragment>
      {imageName === "none" && (
        <img
          onError={(e) => (e.target.src = avatar)}
          className={CSSClassName}
          width={width}
          height={height}
          src={avatar}
          alt=""
        />
      )}
      {imageName !== "none" && (
        <Image
          className={CSSClassName}
          cloudName={"strictlysocial"}
          publicId={imageName}
        >
          <Transformation
            width={width}
            height={height}
            gravity="faces"
            crop="fill"
          />
        </Image>
      )}
    </React.Fragment>
  );
}
