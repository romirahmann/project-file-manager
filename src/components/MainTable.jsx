/* eslint-disable react/prop-types */
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

function MainTable({ onPathChange, searchQuery = "" }) {
  const [data, setData] = useState({});
  const [currentPath, setCurrentPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.9.192:3000/api/master/file-manager") // API endpoint
      .then((response) => {
        let apiData = response.data.data;
        setData(apiData);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    onPathChange(currentPath.join("/"));
  }, [currentPath, onPathChange]);

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
      const response = await axios.post(
        "http://192.168.9.192:3000/api/master/file-url/",
        {
          filePath: filePath,
        }
      );

      const result = response.data.data;
      if (result) {
        window.open(result, "_blank");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileClick = (fileName) => {
    const fullPath = [...currentPath, fileName].join("/");
    onPathChange(fullPath);
    getFilePDF(fullPath);
  };

  if (loading) return <p>Loading...</p>;

  const currentData = getCurrentData();

  // Pastikan searchQuery tidak null/undefined, dan filter data
  const searchQueryLower = searchQuery.toLowerCase();
  const filteredData = Object.entries(currentData).filter(([key, value]) => {
    const isFolder = typeof value === "object" && value !== null;
    const valueString = isFolder ? "" : String(value).toLowerCase(); // Jika bukan folder, gunakan string value

    return (
      key.toLowerCase().includes(searchQueryLower) || // Mencari di nama folder
      valueString.includes(searchQueryLower) // Mencari di nama file
    );
  });

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
              {filteredData.map(([key, value]) => {
                const isFolder = typeof value === "object" && value !== null;
                const lastModified = new Date().toLocaleString();

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
