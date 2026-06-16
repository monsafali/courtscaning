// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// export default function ProfilePage() {
//   const router = useRouter();

//   const [todayCount, setTodayCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [refresh, setRefresh] = useState(false);

//   const [form, setForm] = useState({
//     firstParty: {
//       name: "",
//       cnic: "",
//       image: "",
//     },
//     secondParty: {
//       name: "",
//       cnic: "",
//       image: "",
//     },
//   });

//   // 📊 GET STATS
//   const getStats = async () => {
//     try {
//       const res = await axios.get(
//         "/api/agreement/stats"
//       );
//       setTodayCount(res.data.todayCount);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getStats();
//   }, [refresh]);

//   // 🖼 IMAGE HANDLER
//   const handleImage = (e, type) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onloadend = () => {
//       setForm((prev) => ({
//         ...prev,
//         [type]: {
//           ...prev[type],
//           image: reader.result,
//         },
//       }));
//     };

//     reader.readAsDataURL(file);
//   };

//   // 🚀 SUBMIT
//   const submit = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "/api/agreement",
//         form
//       );

//       toast.success("Agreement Created");

//       setRefresh((prev) => !prev);

//       router.push(
//         `/agreement/${res.data.id}`
//       );
//     } catch (err) {
//       toast.error("Error creating document");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           Create Agreement
//         </h1>

//         <div className="bg-black text-white px-4 py-2 rounded">
//           Today: {todayCount}
//         </div>
//       </div>

//       {/* FORM */}
//       <div className="space-y-4">

//         {/* FIRST PARTY */}
//         <h2 className="font-bold">
//           First Party
//         </h2>

//         <input
//           placeholder="Name"
//           className="border p-2 w-full"
//           onChange={(e) =>
//             setForm({
//               ...form,
//               firstParty: {
//                 ...form.firstParty,
//                 name: e.target.value,
//               },
//             })
//           }
//         />

//         <input
//           placeholder="CNIC"
//           className="border p-2 w-full"
//           onChange={(e) =>
//             setForm({
//               ...form,
//               firstParty: {
//                 ...form.firstParty,
//                 cnic: e.target.value,
//               },
//             })
//           }
//         />

//         <input
//           type="file"
//           onChange={(e) =>
//             handleImage(e, "firstParty")
//           }
//         />

//         {/* SECOND PARTY */}
//         <h2 className="font-bold mt-4">
//           Second Party
//         </h2>

//         <input
//           placeholder="Name"
//           className="border p-2 w-full"
//           onChange={(e) =>
//             setForm({
//               ...form,
//               secondParty: {
//                 ...form.secondParty,
//                 name: e.target.value,
//               },
//             })
//           }
//         />

//         <input
//           placeholder="CNIC"
//           className="border p-2 w-full"
//           onChange={(e) =>
//             setForm({
//               ...form,
//               secondParty: {
//                 ...form.secondParty,
//                 cnic: e.target.value,
//               },
//             })
//           }
//         />

//         <input
//           type="file"
//           onChange={(e) =>
//             handleImage(e, "secondParty")
//           }
//         />

//         {/* SUBMIT */}
//         <button
//           onClick={submit}
//           disabled={loading}
//           className={`w-full py-2 text-white font-semibold ${
//             loading
//               ? "bg-gray-500"
//               : "bg-black hover:bg-gray-800"
//           }`}
//         >
//           {loading
//             ? "Creating..."
//             : "Submit Agreement"}
//         </button>

//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);

  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [form, setForm] = useState({
    firstParty: {
      name: "",
      cnic: "",
      image: "",
    },
    secondParty: {
      name: "",
      cnic: "",
      image: "",
    },
  });

  // 📊 STATS
  const getStats = async () => {
    try {
      const res = await axios.get("/api/agreement/stats");
      setTodayCount(res.data.todayCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStats();
  }, [refresh]);

  // 📸 OPEN CAMERA
  const openCamera = async (type) => {
    try {
      setActiveType(type);
      setCameraOpen(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      toast.error("Camera access denied");
    }
  };

  // 📸 CAPTURE IMAGE
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setForm((prev) => ({
      ...prev,
      [activeType]: {
        ...prev[activeType],
        image: imageData,
      },
    }));

    stopCamera();
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

      const res = await axios.post("/api/agreement", form);

      toast.success("Agreement Created");

      setRefresh((prev) => !prev);

      router.push(`/agreement/${res.data.id}`);
    } catch (err) {
      toast.error("Error creating document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Create Agreement
        </h1>

        <div className="bg-black text-white px-4 py-2 rounded">
          Today: {todayCount}
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-4">

        {/* FIRST PARTY */}
        <h2 className="font-bold">First Party</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full"
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
          className="border p-2 w-full"
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
          className="bg-blue-600 text-white px-3 py-2"
        >
          Capture First Party Image
        </button>

        {form.firstParty.image && (
          <img
            src={form.firstParty.image}
            className="w-24 h-24 mt-2 object-cover"
          />
        )}

        {/* SECOND PARTY */}
        <h2 className="font-bold mt-4">Second Party</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full"
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
          className="border p-2 w-full"
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
          className="bg-green-600 text-white px-3 py-2"
        >
          Capture Second Party Image
        </button>

        {form.secondParty.image && (
          <img
            src={form.secondParty.image}
            className="w-24 h-24 mt-2 object-cover"
          />
        )}

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold ${
            loading
              ? "bg-gray-500"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Creating..." : "Submit Agreement"}
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
