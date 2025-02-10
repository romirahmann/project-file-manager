/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";

export function Login() {
  const [userData, setUserData] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const login = (e) => {
    e.preventDefault();
    if (userData) {
      axios
        .post("http://192.168.9.192:3000/api/auth/login", userData)
        .then((res) => {
          let token = res.data.token;
          let user = res.data.user;

          localStorage.setItem("token", token);
          localStorage.setItem("userData", JSON.stringify(user));
          window.location.href = "/";
        });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-300 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">LOGIN </h1>
              </div>
              <div className="divide-y divide-gray-500">
                <form onSubmit={login}>
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative my-5">
                      <input
                        onChange={handleInput}
                        autoComplete="off"
                        id="username"
                        name="username"
                        type="text"
                        className="peer rounded-lg placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="username..."
                      />
                      <label
                        htmlFor="username"
                        className="absolute p-3 left-0 -top-8 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:-top-1 transition-all peer-focus:-top-8 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Username
                      </label>
                    </div>
                    <div className="relative my-5">
                      <input
                        onChange={handleInput}
                        autoComplete="off"
                        id="password"
                        name="password"
                        type="password"
                        className="peer rounded-lg placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Password"
                      />
                      <label
                        htmlFor="password"
                        className="absolute p-3 left-0 -top-8 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:-top-1 transition-all peer-focus:-top-8 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <button
                        type="submit"
                        className="bg-cyan-500 text-white rounded-md px-2 py-1"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
