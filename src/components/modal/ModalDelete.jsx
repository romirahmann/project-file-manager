/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Modal } from "flowbite-react";
import axios from "axios";

export function ModalDelete({ openModalDelete = false, data, onClose }) {
  const handleDelete = async () => {
    if (!data || !data.filePath || !data.id) {
      alert("Data Not Found!");
      return;
    }

    try {
      const response = await axios.delete(
        "http://192.168.9.192:3000/api/master/delete-file",
        {
          data: {
            filePath: data.filePath,
            accountName: data.documentName,
            dataId: data.id,
          },
        }
      );

      console.log("Delete success:", response.data);
      onClose(); // Menutup modal setelah berhasil delete
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data!");
    }
  };
  return (
    <>
      <div className="container">
        {/* MODAL CONFIRM */}
        <Modal show={openModalDelete} onClose={onClose}>
          <Modal.Header />
          <Modal.Body>
            <div className="md:my-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[10em] fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                  data-original="#000000"
                />
                <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                  data-original="#000000"
                />
              </svg>
              <h4 className="text-gray-800 text-lg font-semibold mt-4">
                Are you sure you want to delete it?
              </h4>
              <p className="text-sm text-gray-600 mt-4">
                Document ini akan terhapus secara permanent dari sistem. Apakh
                anda akan tetap menghapusnya ?
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {" "}
            <button
              onClick={handleDelete}
              type="button"
              className=" ms-auto px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-red-500 hover:bg-red-600 active:bg-red-500"
            >
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
