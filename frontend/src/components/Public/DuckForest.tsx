import React from 'react';
import '@styles/DuckForest.css';

const Tree: React.FC<{ id: number }> = ({ id }) => {
  return (
    <div className={`tree tree-${id}`}>
      <div className="vertical-line" />
      <ul>
        {[...Array(3)].map((_, y) => (
          <li key={y}>{y}</li>
        ))}
      </ul>
    </div>
  );
} 

const Duck: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className={`duck ${id}`}>
      <div className="throat" />
      <div className="body" />
    </div>
  );
};

const DuckForest: React.FC = () => {
  return (
    <div className='fixed inset-0 w-screen h-screen z-[-1]'>
      <div className="container">
        <div className="invisible-Box">
          <div className="cloud-1" />
          <div className="cloud-2" />

          <div className="trees">
            {[...Array(10)].map((_, x) => (
              <Tree key={x} id={x} />
            ))}
          </div>

          <div className="jungle">
            <div className="one" />
            <div className="two" />
          </div>

          <div className="jungle-2">
            <div className="one" />
          </div>

          <div className="jungle-3">
            <div className="one" />
          </div>

          <div className="camp" />

          <div className="jungle-4">
            <div className="one" />
          </div>

          <div className="jungle-5">
            <div className="one" />
            <div className="two" />
          </div>

          <div className="floar" />

          <Duck id="d-1" />
          <Duck id="d-2" />
          <Duck id="d-3" />

          <div className="water" />
        </div>
      </div>
    </div>
  )
}

export default DuckForest;