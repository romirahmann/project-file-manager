import { Card, Button } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
function HeaderContent() {
  const [togleUpload, setTogleUpload] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup dropdown jika klik di luar komponen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTogleUpload(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdownUpload = () => setTogleUpload(!togleUpload);

  return (
    <>
      <Card className="">
        <div className="flex place-items-center">
          <img src="/icon/folder.png" className="w-10" alt="" />
          <div className="title-head font-bold text-2xl ms-2">PADAPRIMA</div>

          <div className="flex content-center button ms-auto">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search-file"
                className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search File Name ...."
              />
            </div>

            <div className=" ms-2 btn-upload relative" ref={dropdownRef}>
              <Button onClick={toggleDropdownUpload} color="blue">
                <img
                  src="/icon/upload.svg"
                  className="mr-2 h-5 w-5 text-white"
                  alt=""
                />
                Upload
              </Button>
              {togleUpload && (
                <div
                  id="item-uplod"
                  className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="flex px-4 py-2 text-sm text-gray-700 "
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-0"
                    >
                      <img
                        src="/icon/upload-file.svg"
                        className="mr-2 h-5 w-5 "
                        alt=""
                      />
                      Upload File
                    </a>
                    <a
                      href="#"
                      className="flex px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-1"
                    >
                      <img
                        src="/icon/upload-folder.svg"
                        className="mr-2 h-5 w-5 "
                        alt=""
                      />
                      Upload Folder
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default HeaderContent;
