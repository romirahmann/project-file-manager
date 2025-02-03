/* eslint-disable no-unused-vars */
import HeaderContent from "./components/HeaderContent";
import MainTable from "./components/MainTable";

function App() {
  return (
    <>
      <div className="container-fluid">
        <div className="main-content p-12">
          <div className="card">
            <HeaderContent />
          </div>
          <div className="card mt-2 border-black border-5">
            <MainTable />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
