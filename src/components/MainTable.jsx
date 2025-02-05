/* eslint-disable no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Breadcrumb,
} from "flowbite-react";
import { FaFolder, FaFilePdf } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

// eslint-disable-next-line react/prop-types
function MainTable() {
  const [data, setData] = useState({});
  const [currentPath, setCurrentPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.9.192:3000/api/master/file-manager") // Ganti dengan API-mu
      .then((response) => {
        let apiData = response.data.data;
        setData(apiData);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const navigateToFolder = (folderName) => {
    setCurrentPath((prev) => [...prev, folderName]);
  };

  const navigateToPath = (index) => {
    setCurrentPath((prev) => prev.slice(0, index + 1));
  };

  const getCurrentData = () => {
    return currentPath.reduce((acc, folder) => acc[folder] || {}, data);
  };

  const getFilePDF = async (filePath) => {
    try {
      await axios
        .post("http://192.168.9.192:3000/api/master/file-url/", {
          filePath: filePath,
        })
        .then((response) => {
          const result = response.data.data;

          if (result) {
            window.open(result, "_blank"); // Membuka URL yang baru
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileClick = (fileName) => {
    const fullPath = [...currentPath, fileName].join("/");
    getFilePDF(fullPath);
  };

  if (loading) return <p>Loading...</p>;

  const currentData = getCurrentData();

  return (
    <>
      <Card>
        <div className="overflow-x-auto p-4">
          {/* Breadcrumb */}
          <div className="shadow-lg p-2 bg-gray-100 rounded-xl mb-2">
            <Breadcrumb aria-label="breadcrumb">
              <Breadcrumb.Item
                icon={HiHome}
                onClick={() => setCurrentPath([])}
                className="cursor-pointer"
              >
                Home
              </Breadcrumb.Item>

              {currentPath.map((folder, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => navigateToPath(index)}
                  className="cursor-pointer"
                >
                  {folder}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>

          {/* Tabel */}
          <Table>
            <TableHead>
              <TableHeadCell className="p-4 bg-blue-900 text-white">
                <Checkbox />
              </TableHeadCell>
              <TableHeadCell className="text-xl bg-blue-900 text-white">
                Name
              </TableHeadCell>
              <TableHeadCell className="text-xl bg-blue-900 text-white">
                Last Modified
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {Object.keys(currentData).map((key) => {
                const value = currentData[key];
                const isFolder =
                  (typeof value === "object" && value !== null) ||
                  Array.isArray(value);

                const lastModified =
                  value.lastModified || new Date().toLocaleString(); // Contoh tanggal

                return (
                  <TableRow key={key} className="bg-gray-100">
                    <TableCell className="p-4">
                      <Checkbox />
                    </TableCell>
                    <TableCell
                      className="text-black flex items-center space-x-2 cursor-pointer"
                      onClick={() =>
                        isFolder
                          ? navigateToFolder(key)
                          : handleFileClick(value)
                      }
                    >
                      {isFolder ? (
                        <FaFolder className="text-yellow-500" />
                      ) : (
                        <FaFilePdf className="text-red-500" />
                      )}
                      <span>{isFolder ? key : value}</span>
                    </TableCell>
                    <TableCell className="text-black">{lastModified}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}

export default MainTable;
