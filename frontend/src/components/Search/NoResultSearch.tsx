import React from 'react';

const NoResultSearch = () => {
  return (
    <div className="flex flex-all-center py-20">
      <p
        className="
        text-light-text-secondary
        dark:text-dark-text-secondary
          text-xl font-semibold
        "
      >
        일치하는 검색결과가 없습니다.
      </p>
    </div>
  );
};

export default NoResultSearch;