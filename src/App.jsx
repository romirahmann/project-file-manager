/* eslint-disable no-unused-vars */
import { useState } from "react";
import HeaderContent from "./components/HeaderContent";
import MainTable from "./components/MainTable";

function App() {
  const [currentPath, setCurrentPath] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  let handlePathChange = (path) => {
    setCurrentPath(path);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="main-content p-12">
          <div className="card">
            <HeaderContent
              currentPath={currentPath}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="card mt-2 border-black border-5">
            <MainTable
              onPathChange={handlePathChange}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
