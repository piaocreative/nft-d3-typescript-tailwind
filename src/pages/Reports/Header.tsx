import React from "react";

interface Props {}

export const Header: React.FC<Props> = () => {
  return (
    <header className="mb-2 mt-2">
      <h1 className="text-center font-bold text-xl dark:text-white">
        Company ESG Profile
      </h1>
    </header>
  );
};
