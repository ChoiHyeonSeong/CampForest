import React from 'react';

type Props = {
  searchText: string;
};

const NoResultSearch = (props: Props) => {
  return (
    <div className="flex flex-all-center py-20">
      <p
        className="
          text-light-text-secondary
          dark:text-dark-text-secondary
          md:text-xl font-semibold
        "
      >
        {props.searchText}에 일치하는 검색결과가 없습니다.
      </p>
    </div>
  );
};

export default NoResultSearch;
