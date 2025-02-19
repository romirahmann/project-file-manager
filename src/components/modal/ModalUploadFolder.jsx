/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import axios from "axios";
import { Modal } from "flowbite-react";
import { useState } from "react";

export function ModalUploadFolder({ openModalUploadFolder, onClose }) {
  const [status, setStatus] = useState({ stat: false, type: null, msg: "" });
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    console.log(event.target.files);
  };

  const uploadFolder = async () => {
    setStatus({ stat: true, type: 3, msg: "Sedang Upload ..." });
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Pilih folder terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    const paths = [];

    for (let file of selectedFiles) {
      const relativePath = file.webkitRelativePath;
      if (!relativePath) {
        alert("Path file tidak valid.");
        return;
      }
      formData.append("files", file);
      paths.push(relativePath);
    }

    formData.append("paths", JSON.stringify(paths));

    const response = await axios
      .post("http://192.168.9.192:3000/api/upload-folder", formData)
      .then((res) => {
        setStatus({ stat: true, type: 1, msg: "Upload Berhasil" });
        setTimeout(() => {
          onClose();
        }, 3000);
      })
      .catch((e) => {
        setStatus({ stat: true, type: 2, msg: "Upload gagal !" });
        setTimeout(() => {
          onClose();
        }, 3000);
      });
  };

  return (
    <Modal show={openModalUploadFolder} onClose={onClose}>
      <Modal.Header>
        <p className="text-2xl font-bold">Upload Folder</p>
      </Modal.Header>
      <Modal.Body>
        <div className="form-upload-folder">
          <label htmlFor="folders" className="mb-3 block">
            Silahkan pilih folder!
          </label>
          <input
            id="folders"
            type="file"
            className="block w-full mt-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            webkitdirectory=""
            multiple
            onChange={handleFileChange} // Simpan file yang dipilih
          />
        </div>
        {status.stat && status.type === 1 ? (
          <div className="alert mt-2">
            <div
              className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
              role="alert"
            >
              <svg
                className="shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Success alert!</span> {status.msg}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {status.stat && status.type === 2 ? (
          <div className="alert mt-2">
            <div
              className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
              role="alert"
            >
              <svg
                className="shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Danger alert!</span> {status.msg}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {status.stat && status.type === 3 ? (
          <div className="ket mt-2">{status.msg}</div>
        ) : (
          ""
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={uploadFolder}
        >
          Upload Folder
        </button>
      </Modal.Footer>
    </Modal>
  );
}
