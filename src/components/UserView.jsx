/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Pagination,
  Label,
  Select,
  Datepicker,
  Modal,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/id";
import { ModalDelete } from "./modal/ModalDelete";
import { ModalEdit } from "./modal/ModalEdit";

export function UserView() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [metaData, setMetaData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayItems, setDisplayItem] = useState(50);
  const [selectedDate, setSelectedDate] = useState(null);
  const [documentName, setDocumentName] = useState("ACOUNT PAYABLE");
  const [listDocuments, setListDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [status, setStatus] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState({
    isOpen: false,
    message: "",
  });
  const [isOpen, setModalOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [formValues, setFormValues] = useState({
    document_id: 1,
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
  const [inputDocument, setInputDocument] = useState("ACOUNT PAYABLE");
  const [idDocument, setIdDocument] = useState();
  const [dataModal, setDataModal] = useState();

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTime();
    getAllDocumentName();
  }, [documentName, metaData]);

  const getAllPayabale = () => {
    axios
      .get("http://192.168.9.192:3000/api/master/files-payable")
      .then((res) => {
        setMetaData(res.data.data || []);
      });
  };
  const getAllReceivable = () => {
    axios
      .get("http://192.168.9.192:3000/api/master/files-receivable")
      .then((res) => {
        setMetaData(res.data.data || []);
      });
  };

  const getAllDocumentName = () => {
    axios
      .get("http://192.168.9.192:3000/api/master/document-name")
      .then((res) => {
        setListDocuments(res.data.data || []);
        documentName === "ACOUNT PAYABLE"
          ? getAllPayabale()
          : getAllReceivable();
      });
  };

  const handleDocumentName = (param) => {
    setDocumentName(param);
    param === "ACOUNT PAYABLE" ? getAllPayabale() : getAllReceivable();
  };

  const setTime = () => {
    const updateDateTime = () => {
      const now = new Date();
      const day = now.toLocaleString("id-ID", { weekday: "long" });
      const date = now.toLocaleDateString("id-ID");
      const time = now.toLocaleTimeString("id-ID");

      setCurrentDateTime(`${day}, ${date} ${time}`);
    };

    setInterval(updateDateTime, 1000);
    updateDateTime();
  };

  // 🔍 **Filter Data Sesuai Query**
  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
  }, [searchQuery]);

  const searchQueryLower = searchQuery.toLowerCase();
  const filteredData = Array.isArray(metaData)
    ? metaData.filter((item) => {
        const matchesQuery = Object.values(item)
          .filter((val) => typeof val === "string")
          .some((val) => val.toLowerCase().includes(searchQueryLower));

        if (item.documentName === "ACOUNT PAYABLE") {
          const matchesDate =
            selectedDate === null ||
            (item.transaksiDate &&
              moment(item.transaksiDate, "YYYYMMDD").isSame(
                moment(selectedDate).format("YYYYMMDD"),
                "day"
              ));
          return matchesQuery && matchesDate;
        }
        if (item.documentName === "ACOUNT RECEIVABLE") {
          const matchesDate =
            selectedDate === null ||
            (item.receiptDate &&
              moment(item.receiptDate, "YYYYMMDD").isSame(
                moment(selectedDate).format("YYYYMMDD"),
                "day"
              ));
          return matchesQuery && matchesDate;
        }
      })
    : [];

  // 🔄 **Pagination Logic**
  const totalPages = Math.ceil(filteredData.length / displayItems);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * displayItems,
    currentPage * displayItems
  );

  // Fungsi untuk menangani perubahan halaman
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewPDF = (filePath) => {
    // console.log(filePath);
    if (!filePath) {
      alert("File tidak ditemukan");
    }
    getFilePDF(filePath);
  };
  const handleDeletePDF = (filePath, metaId, documentName) => {
    if (!filePath && !metaId && !documentName) {
      alert("Data tidak ditemukan");
    }
    let data = {
      filePath: filePath,
      dataId: metaId,
      accountName: documentName,
    };

    deletePDF(data);
  };
  const deletePDF = async (data) => {
    try {
      const res = await axios.delete(
        "http://192.168.9.192:3000/api/master/delete-file",
        {
          data,
        }
      );
      console.log(res.status);
    } catch (e) {
      console.log(e);
    }
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

  // UPLOAD LOGIC
  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length === 0) {
      setStatus("Pilih folder terlebih dahulu!");
      return;
    }
    setSelectedFile(files);
  };

  const handleModal = () => {
    isOpen ? setModalOpen(false) : setModalOpen(true);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Menghentikan reload form default

    const formData = new FormData();

    // Menambahkan data teks ke formData
    formData.append("nobox", formValues.nobox);

    inputDocument === "ACOUNT PAYABLE"
      ? formData.append("document_id", 1)
      : formData.append("document_id", 2);

    // Payable
    formData.append("namaBank", formValues.namaBank);
    formData.append("noCek", formValues.noCek);
    formData.append("transaksiDate", formValues.transaksiDate);
    formData.append("nilai", formValues.nilai);

    // Receivable
    formData.append("noReceipt", formValues.noReceipt);
    formData.append("receiptDate", formValues.receiptDate);
    formData.append("customer", formValues.customer);
    formData.append("nominal", formValues.nominal);

    // Menambahkan file ke formData
    formData.append("file", selectedFile[0]);

    axios
      .post("http://192.168.9.192:3000/api/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.data);

        setStatus("Upload File Successfully!");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.reload();
  };

  const handleModalDelete = (data) => {
    setIdDocument(data);
    setOpenModalDelete(true);
  };
  const handleModalEdit = (data) => {
    console.log(data);
    setOpenModalEdit(true);
    setDataModal(data);
  };

  const handleCloseModal = () => {
    setOpenModalDelete(false);
    setOpenModalEdit(false);
  };

  const handleAlert = (isOpen, messegae) => {
    setIsAlertOpen({ isOpen: isOpen, message: messegae });
    setStatus(messegae);
    setTimeout(() => {
      setIsAlertOpen(false);
    }, 3000);
  };
  return (
    <>
      <div className="container-fluid p-5">
        <div className="alert">
          {isAlertOpen.isOpen ? (
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
                <span className="font-medium">Successfully !</span> {status}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Card>
          <div className="flex items-center">
            <img src="/icon/folder.png" className="w-10" alt="" />
            <div className="font-bold text-4xl ms-2">DOCUMENTS DATA</div>
            <Select
              id="documentName"
              className="ms-auto me-5"
              onChange={(e) => handleDocumentName(e.target.value)}
              required
            >
              {Array.isArray(listDocuments) && listDocuments.length > 0 ? (
                listDocuments.map((document) => (
                  <option
                    key={document.document_id}
                    value={document.document_id}
                  >
                    {document.documentName}
                  </option>
                ))
              ) : (
                <option key={document.document_id}>
                  No Document Names Available
                </option>
              )}
            </Select>
            <button
              onClick={() => handleModal()}
              className="bg-blue-700 mx-1 me-10 hover:bg-blue-600 text-white px-2 py-2 rounded-lg flex"
            >
              <img src="/icon/upload.svg" className="w-5 mx-2" alt="" />
              <span className="me-3">Upload File</span>
            </button>
            <button
              onClick={() => handleLogout()}
              className="bg-red-700 mx-1 me-10 hover:bg-red-600 text-white px-2 py-2 rounded-lg flex"
            >
              <img src="/icon/logout.svg" className="w-5 mx-2" alt="" />
              <span className="me-2">LOGOUT</span>
            </button>
          </div>
          <div className="documentName flex">
            <p className="text-gray-400text-2xl">{currentDateTime}</p>
          </div>
        </Card>
        {documentName == "ACOUNT PAYABLE" ? (
          // ACCOUNT PAYABLE
          <div className="container-fluid p-5">
            <Card className="mt-5">
              <div className="filter px-3 grid grid-cols-2 justify-center content-center">
                <div className="filterItemPerpage flex">
                  <Select
                    id="displayItem"
                    value={displayItems}
                    onChange={(e) => setDisplayItem(Number(e.target.value))}
                    required
                  >
                    <option value={metaData.length}>All</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </Select>
                </div>
                <div className="filterBtn flex ms-auto">
                  <div className="filterDate me-4 ">
                    <Datepicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateformat="dd/MM/yyyy"
                      isclearable="true"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="search"
                      className="w-full p-2 ps-10 text-sm  rounded-lg bg-gray-50"
                      placeholder="Search ...."
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto p-2">
                <Table>
                  <TableHead>
                    <TableHeadCell className="bg-blue-900 text-white">
                      #
                    </TableHeadCell>

                    <TableHeadCell className="bg-blue-900 text-white">
                      Nobox
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Bank Name
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Check Number
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Transaction Date
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Value
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Filename
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Action
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="border border-1-black">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((value, index) => (
                        <TableRow key={value.id}>
                          <TableCell>
                            {(currentPage - 1) * displayItems + index + 1}
                          </TableCell>

                          <TableCell>{value.nobox || "N/A"}</TableCell>
                          <TableCell>{value.namaBank || "N/A"}</TableCell>
                          <TableCell>{value.noCek || "N/A"}</TableCell>
                          <TableCell>
                            {value.transaksiDate
                              ? moment(value.transaksiDate, "YYYYMMDD").format(
                                  "DD MMM YYYY"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>{value.nilai || "N/A"}</TableCell>
                          <TableCell>{value.filename || "N/A"}</TableCell>

                          <TableCell>
                            <button
                              className="bg-blue-500 mx-1 hover:bg-blue-600 text-white px-2 py-2 rounded-lg"
                              onClick={() => handleViewPDF(value.filePath)}
                            >
                              <svg
                                className="w-6 h-6 text-white dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              className="bg-green-500 mx-1 hover:bg-green-600 text-white px-2 py-2 rounded-lg"
                              onClick={() => handleModalEdit(value)}
                            >
                              <img
                                src="/icon/edit.svg"
                                className="w-6"
                                alt=""
                              />
                            </button>
                            <button
                              className="bg-red-500 mx-1 hover:bg-red-600 text-white px-2 py-2 rounded-lg"
                              onClick={() => handleModalDelete(value)}
                            >
                              <img
                                src="/icon/delete.svg"
                                className="w-6"
                                alt=""
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="11" className="text-center">
                          Data Not Found!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="footer flex">
                <div className="detail">
                  <p className="text-gray-600">
                    Showing{" "}
                    <strong>
                      {filteredData.length === 0
                        ? 0
                        : (currentPage - 1) * displayItems + 1}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(
                        currentPage * displayItems,
                        filteredData.length
                      )}
                    </strong>{" "}
                    of <strong>{filteredData.length}</strong> files
                  </p>
                </div>
                <div className="pagination md:ms-auto">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // ACCOUNT RECEIVABLE
          <div className="container-fluid p-5">
            <Card className="mt-5">
              <div className="filter px-3 grid grid-cols-2 justify-center content-center">
                <div className="filterItemPerpage flex">
                  <Select
                    id="displayItem"
                    value={displayItems}
                    onChange={(e) => setDisplayItem(Number(e.target.value))}
                    required
                  >
                    <option value={metaData.length}>All</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </Select>
                </div>
                <div className="filterBtn flex ms-auto">
                  <div className="filterDate me-4 ">
                    <Datepicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateformat="dd/MM/yyyy"
                      isclearable="true"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="search"
                      className="w-full p-2 ps-10 text-sm  rounded-lg bg-gray-50"
                      placeholder="Search ...."
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto p-2">
                <Table>
                  <TableHead>
                    <TableHeadCell className="bg-blue-900 text-white">
                      #
                    </TableHeadCell>

                    <TableHeadCell className="bg-blue-900 text-white">
                      Nobox
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      No Receipt
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Receipt Date
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Customer
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Nominal
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Filename
                    </TableHeadCell>
                    <TableHeadCell className="bg-blue-900 text-white">
                      Action
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="border border-1-black">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((value, index) => (
                        <TableRow key={value.id}>
                          <TableCell>
                            {(currentPage - 1) * displayItems + index + 1}
                          </TableCell>

                          <TableCell>{value.nobox || "N/A"}</TableCell>
                          <TableCell>{value.noReceipt || "N/A"}</TableCell>
                          <TableCell>
                            {value.receiptDate
                              ? moment(value.receiptDate, "YYYYMMDD").format(
                                  "DD MMM YYYY"
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>{value.customer}</TableCell>
                          <TableCell>{value.nominal || "N/A"}</TableCell>
                          <TableCell>{value.filename || "N/A"}</TableCell>

                          <TableCell>
                            <button
                              className="mt-2 md:mt-2 bg-blue-500 me-1 hover:bg-blue-600 text-white px-2 py-2 rounded-lg"
                              onClick={() => handleViewPDF(value.filePath)}
                            >
                              <svg
                                className="w-6 h-6 text-white dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              className="bg-green-500  hover:bg-green-600 text-white px-2 py-2 rounded-lg"
                              onClick={() => handleModalEdit(value)}
                            >
                              <img
                                src="/icon/edit.svg"
                                className="w-6"
                                alt=""
                              />
                            </button>
                            <button
                              className="mt-2 md:mt-2 bg-red-500  hover:bg-red-600 text-white px-2 py-2 rounded-lg"
                              onClick={() =>
                                handleDeletePDF(value.filePath, value.id)
                              }
                            >
                              <img
                                src="/icon/delete.svg"
                                className="w-6"
                                alt=""
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="11" className="text-center">
                          Data Not Found!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="footer flex">
                <div className="detail">
                  <p className="text-gray-600">
                    Showing{" "}
                    <strong>
                      {filteredData.length === 0
                        ? 0
                        : (currentPage - 1) * displayItems + 1}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(
                        currentPage * displayItems,
                        filteredData.length
                      )}
                    </strong>{" "}
                    of <strong>{filteredData.length}</strong> files
                  </p>
                </div>
                <div className="pagination md:ms-auto">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal show={isOpen} onClose={handleModal}>
        <Modal.Header>
          {" "}
          <label htmlFor="uploadFolder" className="text-2xl font-bold">
            Upload File
          </label>{" "}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="">
              <div className="formUploadFile">
                <Select
                  id="documentName"
                  className="ms-auto me-5"
                  name="documentName"
                  onChange={(e) => setInputDocument(e.target.value)}
                  required
                >
                  {Array.isArray(listDocuments) && listDocuments.length > 0 ? (
                    listDocuments.map((document) => (
                      <option
                        key={document.document_id}
                        value={document.document_id}
                      >
                        {document.documentName}
                      </option>
                    ))
                  ) : (
                    <option key={document.document_id}>No Document </option>
                  )}
                </Select>
                <div className="my-5">
                  <label
                    htmlFor="nobox"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nomor Box
                  </label>
                  <input
                    type="text"
                    id="nobox"
                    name="nobox"
                    onChange={handleInput}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                {inputDocument === "ACOUNT PAYABLE" ? (
                  <div className="my-5">
                    <div className="my-5">
                      <label
                        htmlFor="namaBank"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nama Bank
                      </label>
                      <input
                        type="text"
                        id="namaBank"
                        name="namaBank"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="my-5">
                      <label
                        htmlFor="noCek"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nomor Cek
                      </label>
                      <input
                        type="text"
                        id="noCek"
                        name="noCek"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="my-5">
                      <label
                        htmlFor="transaksiDate"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Tanggal Transaksi
                      </label>
                      <input
                        type="text"
                        id="transaksiDate"
                        name="transaksiDate"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="my-5">
                      <label
                        htmlFor="nilai"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nominal
                      </label>
                      <input
                        type="text"
                        id="nilai"
                        name="nilai"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="inputReceivable">
                    <div className="my-5">
                      <label
                        htmlFor="noReceipt"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        No Receipt
                      </label>
                      <input
                        type="text"
                        id="noReceipt"
                        name="noReceipt"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="my-5">
                      <label
                        htmlFor="receiptDate"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Receipt Date
                      </label>
                      <input
                        type="text"
                        id="receiptDate"
                        name="receiptDate"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="my-5">
                      <label
                        htmlFor="customer"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Customer
                      </label>
                      <input
                        type="text"
                        id="customer"
                        name="customer"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="my-5">
                      <label
                        htmlFor="nominal"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nominal
                      </label>
                      <input
                        type="text"
                        id="nominal"
                        name="nominal"
                        onChange={handleInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}{" "}
              </div>

              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-5"
              />
              <button
                type="submit"
                className="ms-auto mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Upload
              </button>
              <p className="mt-4 text-gray-700">{status}</p>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <ModalDelete
        className="md:w-full"
        data={idDocument}
        openModalDelete={openModalDelete}
        onClose={handleCloseModal}
      />
      <ModalEdit
        className="md:w-full"
        alertOpen={handleAlert}
        data={dataModal}
        openModalEdit={openModalEdit}
        onClose={handleCloseModal}
      />
    </>
  );
}
