import React from "react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiHealthBookFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'






export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password })
            .then(res => {
                if (!res.data.token) {
                    alert(res.data.message)
                    return
                }
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('name', res.data.name)
                navigate('/')

            })


    }




    return (
        <div className="flex h-screen bg-[#F4F6FB]">

            <div className="flex w-3/5 h-4/5 rounded-2xl overflow-hidden shadow-xl bg-white m-auto">


                <div className="w-2/5 bg-[#7AAE9E]/85 relative flex flex-col p-10 justify-between overflow-hidden">


                    <img
                        src="https://images.unsplash.com/photo-1628372095387-017d1099fc19?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Hospital Lobby"
                        className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-overlay z-0"
                    />


                    <div className="relative z-10">
                        <h1 className="text-white font-bold text-3xl flex gap-3">
                            <RiHealthBookFill className="mt-1" />Sage EMR
                        </h1>

                        <div>
                            <h2 className="text-2xl text-white font-bold mt-4">A Digital Sanctuary for Medical Precision</h2>
                            <p className="text-white/70 text-sm leading-relaxed mt-2">
                                A secure, staff-facing platform for managing patients, appointments, and clinical records
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex bg-[#b3ffe846] rounded-2xl align-center text-center h-20 justify-center">
                        <p className="flex items-center text-white font-bold gap-2">
                            <IoShieldCheckmarkOutline className="text-white text-2xl" />HIPAA Compliant
                        </p>
                    </div>
                </div>


                {/* Login Form (White section) */}

                <div className="flex flex-col flex-1 p-10">

                    <div className=" flex flex-col justify-center">
                        <h1 className="text-3xl font-semibold text-[#7AAE9E]">Welcome Back!</h1>
                        <p className="mt-2 text-[#7AAE9E]">Enter your credentials to continue</p>




                        <div className="mt-30">


                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <label className="text-gray-700">Professional Email</label>
                                <input
                                    className="border border-gray-300 rounded-lg mt-2 py-3 outline-gray-400 bg-gray-100 h-15  pl-3  text-gray-700"
                                    placeholder="doctor@gmail.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}

                                />

                                <label className="mt-5 text-gray-700">Security Password</label>
                                <input
                                    className="border border-gray-300 rounded-lg mt-2 bg-gray-100  outline-gray-400 h-15  py-3 pl-3  text-gray-700"
                                    placeholder="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button className="bg-[#7AAE9E] cursor-pointer hover:bg-[#5f9585] mt-10 rounded-full h-15 shadow-md text-white font-bold flex items-center justify-center gap-2">
                                    Sign Into Sage EMR
                                    <FaArrowRight />
                                </button>



                            </form>

                            <div className="mt-30">
                                <hr class="h-px bg-gray-200 border-0"></hr>
                                <div className="flex flex-row gap-5 mt-5">
                                    <p className="text-gray-500">Privacy Policy</p>
                                    <p className="text-gray-500">Terms of Service</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


            </div>


        </div >

    )
}