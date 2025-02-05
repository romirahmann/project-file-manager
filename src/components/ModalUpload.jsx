/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { Modal } from "flowbite-react";
import { useState } from "react";

export function ModalUpload({ isOpen = false, typeUpload, onClose }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(files);
    if (files.length === 0) {
      setStatus("Pilih folder terlebih dahulu!");
      return;
    }

    const fileArray = Array.from(files).map((file) => ({
      file,
      path: file.webkitRelativePath,
    }));

    setSelectedFiles(fileArray);
  };

  const uploadFolder = async () => {
    if (selectedFiles.length === 0) {
      setStatus("Pilih folder terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    const paths = [];

    selectedFiles.forEach(({ file, path }) => {
      formData.append("files", file);
      paths.push(path);
    });

    formData.append("paths", JSON.stringify(paths));

    try {
      axios
        .post("http://192.168.9.192:3000/api/upload-folder", formData)
        .then((response) => {
          const result = response.data.data;
          if (!result) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setStatus("Berhasil upload folder!");
        });
    } catch (error) {
      console.error("Error uploading folder:", error);
      setStatus("Gagal mengupload folder: " + error.message);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        {typeUpload === "File" ? (
          <h1>File</h1>
        ) : (
          <div className="">
            <label htmlFor="uploadFolder" className="text-2xl font-bold">
              Upload {typeUpload} ke MinIO
            </label>
            <p>Silahkan upload folder yang berisi file !</p>
            <input
              type="file"
              webkitdirectory=""
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-5"
            />

            <p className="mt-4 text-gray-700">{status}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {" "}
        <button
          onClick={uploadFolder}
          className="ms-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Upload
        </button>{" "}
      </Modal.Footer>
    </Modal>
  );
}
