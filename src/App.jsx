/* eslint-disable no-unused-vars */
import { useState } from "react";
import HeaderContent from "./components/HeaderContent";
import MainTable from "./components/MainTable";

function App() {
  const [mainData, setMainData] = useState([]);

  const handleData = (data) => {
    setMainData(data);
  };

  console.log(mainData);

  return (
    <>
      <div className="container-fluid">
        <div className="main-content p-12">
          <div className="card">
            <HeaderContent />
          </div>
          <div className="card mt-2 border-black border-5">
            <MainTable dataDocument={handleData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
