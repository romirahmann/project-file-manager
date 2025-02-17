/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Modal } from "flowbite-react";
import axios from "axios";
import { useEffect, useState } from "react";

export function ModalEdit({ openModalEdit = false, data, onClose }) {
  const [formEdit, setFormEdit] = useState({
    nobox: "",
    namaBank: "",
    noCek: "",
    transaksiDate: "",
    nilai: "",
    filename: "",
    noReceipt: "",
    receiptDate: "",
    customer: "",
    nominal: "",
    file: null,
  });

  const handleForm = () => {
    console.log(data);
  };
  return (
    <>
      <div className="container">
        {/* MODAL CONFIRM */}
        <Modal show={openModalEdit} onClose={onClose}>
          <Modal.Header>
            <span className="text-2xl font-bold">EDIT META DATA</span>
          </Modal.Header>
          <Modal.Body>
            <form className="formEdit max-w-sm mx-auto">
              <div className="mb-5">
                <label
                  htmlFor="nobox"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  No Box
                </label>
                <input
                  type="text"
                  id="nobox"
                  value={data?.nobox || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              {data && data.documentName === "ACOUNT PAYABLE" ? (
                <div className="container">
                  <div className="mb-5">
                    <label
                      htmlFor="namaBank"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      id="namaBank"
                      value={data.namaBank}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="nocek"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nomor Cek
                    </label>
                    <input
                      type="text"
                      id="nocek"
                      value={data.noCek}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="nominal"
                      className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nominal
                    </label>
                    <input
                      type="text"
                      id="nominal"
                      value={data.nilai}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="transactionDate"
                      className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Trancsaction Date
                    </label>
                    <input
                      type="date"
                      id="transactionDate"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="container"></div>
              )}
            </form>
          </Modal.Body>
          <Modal.Footer>
            {" "}
            <button
              onClick={handleForm}
              type="button"
              className=" ms-auto px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-blue-500 hover:bg-blue-600 active:bg-blue-500"
            >
              Edit
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
