/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";

export function ModalEdit({ openModalEdit = false, data, onClose, alertOpen }) {
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

  useEffect(() => {
    if (data) {
      setFormEdit({
        documentName: data.documentName || "",
        nobox: data.nobox || "",
        namaBank: data.namaBank || "",
        noCek: data.noCek || "",
        transaksiDate:
          data.transaksiDate && data.transaksiDate.length === 8
            ? `${data.transaksiDate.slice(0, 4)}-${data.transaksiDate
                .slice(4, 6)
                .padStart(2, "0")}-${data.transaksiDate
                .slice(6, 8)
                .padStart(2, "0")}`
            : "",
        nilai: data.nilai || "",
        filename: data.filename || "",
        noReceipt: data.noReceipt || "",
        receiptDate:
          data.receiptDate && data.receiptDate.length === 8
            ? `${data.receiptDate.slice(0, 4)}-${data.receiptDate
                .slice(4, 6)
                .padStart(2, "0")}-${data.receiptDate
                .slice(6, 8)
                .padStart(2, "0")}`
            : "",
        customer: data.customer || "",
        nominal: data.nominal || "",
        file: null,
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormEdit((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFormSubmit = () => {
    let idTarget = data.id;

    // Konversi transaksiDate ke format YYYYMMDD
    const formattedTransaksiDate = formEdit.transaksiDate
      ? formEdit.transaksiDate.replace(/-/g, "") // Menghilangkan tanda minus
      : "";

    if (formEdit.documentName === "ACOUNT PAYABLE") {
      let data = {
        nobox: formEdit.nobox,
        filename: formEdit.filename,
        namaBank: formEdit.namaBank,
        nilai: formEdit.nilai,
        noCek: formEdit.noCek,
        transaksiDate: formattedTransaksiDate, // Kirim format YYYYMMDD
      };

      axios
        .put(
          `http://192.168.9.192:3000/api/master/file-update/${idTarget}/document/${formEdit.documentName}`,
          data
        )
        .then((res) => {
          console.log("UPDATE DATA PAYABLE SUCCESSFULLY", res);
          onClose();
          alertOpen(true, "UPDATE DATA PAYABLE");
        })
        .catch((e) => {
          console.log("UPDATE FAILED ", e);
        });
    } else {
      // Konversi transaksiDate ke format YYYYMMDD
      const formattedReceiptDate = formEdit.receiptDate
        ? formEdit.receiptDate.replace(/-/g, "") // Menghilangkan tanda minus
        : "";

      let data = {
        nobox: formEdit.nobox,
        filename: formEdit.filename,
        noReceipt: formEdit.noReceipt,
        receiptDate: formattedReceiptDate,
        customer: formEdit.customer,
        nominal: formEdit.nominal,
      };
      axios
        .put(
          `http://192.168.9.192:3000/api/master/file-update/${idTarget}/document/${formEdit.documentName}`,
          data
        )
        .then((res) => {
          console.log("UPDATE DATA SUCCESSFULLY", res);

          onClose();
          alertOpen(true, "UPDATE DATA RECEIVABLE");
        })
        .catch((e) => {
          console.log("UPDATE FAILED ", e);
        });
    }
  };

  return (
    <div className="container">
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
                value={formEdit.nobox}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            {formEdit.documentName === "ACOUNT PAYABLE" && (
              <>
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
                    value={formEdit.namaBank}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="noCek"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nomor Cek
                  </label>
                  <input
                    type="text"
                    id="noCek"
                    value={formEdit.noCek}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="nilai"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nominal
                  </label>
                  <input
                    type="text"
                    id="nilai"
                    value={formEdit.nilai}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="transaksiDate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    id="transaksiDate"
                    value={formEdit.transaksiDate}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </>
            )}
            {formEdit.documentName === "ACOUNT RECEIVABLE" && (
              <>
                <div className="mb-5">
                  <label
                    htmlFor="noReceipt"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    No Receipt
                  </label>
                  <input
                    type="text"
                    id="noReceipt"
                    value={formEdit.noReceipt}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="customer"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Customer
                  </label>
                  <input
                    type="text"
                    id="customer"
                    value={formEdit.customer}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="nominal"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nominal
                  </label>
                  <input
                    type="text"
                    id="nominal"
                    value={formEdit.nominal}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="receiptDate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Receipt Date
                  </label>
                  <input
                    type="date"
                    id="receiptDate"
                    value={formEdit.receiptDate}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleFormSubmit}
            type="button"
            className="ms-auto px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-blue-500 hover:bg-blue-600 active:bg-blue-500"
          >
            Edit
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
