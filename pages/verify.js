import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verify = () => {
  const router = useRouter();
  const [otpInput, setOtpInput] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const tempUser = JSON.parse(localStorage.getItem('temp-user'));
    if (!tempUser) {
      router.push('/signup');
    } else {
      setUserData(tempUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) return;

    // Convert both to strings and trim whitespace
    const actualOtp = String(userData.otp).trim();
    const enteredOtp = otpInput.trim();

    console.log("Expected OTP:", actualOtp);
    console.log("Entered OTP:", enteredOtp);

    if (enteredOtp === actualOtp) {
      const res = await fetch('/api/finalizeSignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Signup successful!');
        localStorage.removeItem('temp-user');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error(data.error || 'Could not save user');
      }
    } else {
      toast.error('Incorrect OTP');
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verify;
