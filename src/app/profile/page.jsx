
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);

  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);


  const [form, setForm] = useState({
  firstParty: {
    name: "",
    cnic: "",
    image: "",
    latitude: "",
    longitude: "",
    address: "",
  },
  secondParty: {
    name: "",
    cnic: "",
    image: "",
    latitude: "",
    longitude: "",
    address: "",
  },
});


const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await response.json();

          resolve({
            latitude,
            longitude,
            address: data.display_name || "Address not found",
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

  const getUser = async () => {
  try {
    const res = await axios.get("/api/users/getme", {
      withCredentials: true,
    });

    setUser(res.data.user);
  } catch (error) {
    console.log(error);
    router.replace("/login");
  }
};

  // 📊 STATS
  const getStats = async () => {
    try {
      const res = await axios.get("/api/agreement/stats");
      setTodayCount(res.data.todayCount);
       setTotalCount(res.data.totalCount);
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  getUser();
  getStats();
}, [refresh]);

  // 📸 OPEN CAMERA
const openCamera = async (type) => {
  try {
    setActiveType(type);
    setCameraOpen(true);

    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {}
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    videoRef.current.srcObject = stream;
    videoRef.current.play();
  } catch (error) {
    toast.error("Camera access denied");
  }
};


  const captureImage = async () => {
  try {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    toast.loading("Getting location...", {
      id: "location",
    });

    const gps = await getLocation();


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    // Draw image
    ctx.drawImage(video, 0, 0);

    const timestamp = new Date().toLocaleString();

    // Background overlay
    const overlayHeight = 140;

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(
      0,
      canvas.height - overlayHeight,
      canvas.width,
      overlayHeight
    );

    // Text styling
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial";

    const lines = [
      `Address: ${gps.address}`,
      `Latitude: ${gps.latitude}`,
      `Longitude: ${gps.longitude}`,
      `Time: ${timestamp}`,
    ];

    const maxWidth = canvas.width - 20;
    let y = canvas.height - 100;

    lines.forEach((line) => {
      const words = line.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + " ";
        const width = ctx.measureText(testLine).width;

        if (width > maxWidth) {
          ctx.fillText(currentLine, 10, y);
          currentLine = words[i] + " ";
          y += 22;
        } else {
          currentLine = testLine;
        }
      }

      ctx.fillText(currentLine, 10, y);
      y += 22;
    });

    const imageData = canvas.toDataURL("image/png");

    setForm((prev) => ({
      ...prev,
      [activeType]: {
        ...prev[activeType],
        image: imageData,
        latitude: gps.latitude,
        longitude: gps.longitude,
        address: gps.address,
      },
    }));

    toast.success("Photo captured with GPS location", {
      id: "location",
    });

    stopCamera();
  } catch (error) {
    console.error(error);

    toast.error(
      "Unable to get location. Please allow location access.",
      {
        id: "location",
      }
    );
  }
};






  // 🛑 STOP CAMERA
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setCameraOpen(false);
    setActiveType(null);
  };

  // 🚀 SUBMIT
  const submit = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/agreement", form,{
    withCredentials: true,
  });

      toast.success("Agreement Created");

      setRefresh((prev) => !prev);

      router.push(`/agreement/${res.data.id}`);
    } catch (err) {
      toast.error("Error creating document");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
  try {
    await axios.post("/api/users/logout");

    toast.success("Logged out");

    router.replace("/login");
  } catch (error) {
    toast.error("Logout failed");
  }
};

  return (
    <div className="p-6 max-w-3xl mx-auto">

{user && (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-3">
      <Image
        src={user.profileImage}
        width={100}
        height={100}
        className="rounded-full"
        alt="user"
      />
      <div>
        <p className="font-bold">{user.username}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>

    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>
)}
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Create Agreement
        </h1>

       <div className="flex gap-4 mb-6">

  <div className="bg-black text-white px-4 py-2 rounded">
    Today: {todayCount}
  </div>

  <div className="bg-green-600 text-white px-4 py-2 rounded">
    Total: {totalCount}
  </div>

</div>
      </div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* FIRST PARTY */}
  <div className="border rounded-lg p-4 shadow">
    <h2 className="font-bold text-lg mb-3">
      First Party
    </h2>

    <input
      placeholder="Name"
      className="border p-2 w-full mb-3 rounded"
      onChange={(e) =>
        setForm({
          ...form,
          firstParty: {
            ...form.firstParty,
            name: e.target.value,
          },
        })
      }
    />

    <input
      placeholder="CNIC"
      className="border p-2 w-full mb-3 rounded"
      onChange={(e) =>
        setForm({
          ...form,
          firstParty: {
            ...form.firstParty,
            cnic: e.target.value,
          },
        })
      }
    />

    <button
      onClick={() => openCamera("firstParty")}
      className="bg-blue-600 text-white px-4 py-2 rounded w-full"
    >
      Capture Image
    </button>

    {form.firstParty.image && (
      <Image
        src={form.firstParty.image}
        alt="First Party"
        height={128}
        width={128}
        className="w-32 h-32 object-cover rounded border mt-3 mx-auto"
      />
    )}
  </div>

  {/* SECOND PARTY */}
  <div className="border rounded-lg p-4 shadow">
    <h2 className="font-bold text-lg mb-3">
      Second Party
    </h2>

    <input
      placeholder="Name"
      className="border p-2 w-full mb-3 rounded"
      onChange={(e) =>
        setForm({
          ...form,
          secondParty: {
            ...form.secondParty,
            name: e.target.value,
          },
        })
      }
    />

    <input
      placeholder="CNIC"
      className="border p-2 w-full mb-3 rounded"
      onChange={(e) =>
        setForm({
          ...form,
          secondParty: {
            ...form.secondParty,
            cnic: e.target.value,
          },
        })
      }
    />

    <button
      onClick={() => openCamera("secondParty")}
      className="bg-green-600 text-white px-4 py-2 rounded w-full"
    >
      Capture Image
    </button>

    {form.secondParty.image && (
      <Image
        src={form.secondParty.image}
        alt="Second Party"
        height={128}
        width={128}
        className="w-32 h-32 object-cover rounded border mt-3 mx-auto"
      />
    )}
  </div>

</div>

{/* SUBMIT BUTTON */}
<div className="mt-6">
  <button
    onClick={submit}
    disabled={loading}
    className={`w-full py-3 rounded text-white font-semibold ${
      loading
        ? "bg-gray-500"
        : "bg-black hover:bg-gray-800"
    }`}
  >
    {loading
      ? "please wait submitting..."
      : "Submit Agreement"}
  </button>
</div>
      {/* CAMERA MODAL */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">

          <video
            ref={videoRef}
            className="w-[400px] rounded"
          />

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 space-x-4">
            <button
              onClick={captureImage}
              className="bg-green-600 text-white px-4 py-2"
            >
              Capture
            </button>

            <button
              onClick={stopCamera}
              className="bg-red-600 text-white px-4 py-2"
            >
              Cancel
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
