import { ConnectDb } from "@/dbConfig/dbConfig";
import Agreement from "@/models/AgreementModel";
import Image from "next/image";

async function fetchAgreement(id) {
  await ConnectDb();
  return Agreement.findById(id).lean();
}

export default async function Page({ params }) {
  const {id} = await params; // ✅ CORRECT (NO use())


  const data = await fetchAgreement(id);

  if (!data) return <div>Not found</div>;

  // 🔥 QR CODE
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `https://your-domain.com/agreement/${id}`
  )}`;

  return (
    <div className="min-h-screen0 flex justify-center p-10">

      {/* A4 PAGE */}
      <div className=" w-[800px] p-10 shadow-lg ">

        <h1 className="text-center text-2xl font-bold mb-8">
          AGREEMENT DOCUMENT
        </h1>

        {/* QR */}
             <div className="mt-10 text-center text-sm text-gray-500">

        </div>
        <div className="flex justify-end mb-6">
          Scan QR to verify this document
          <img
            src={qr}
            alt="QR Code"
            className="w-28 h-28"
          />
        </div>

        {/* PARTIES */}
        <div className="grid grid-cols-2 gap-10">

          <div className="border p-4">
            <h2 className="font-bold mb-3">
              First Party
            </h2>

            <Image
              src={data.firstParty.image}
              width={120}
              height={120}
              alt=""
              className="mb-2 object-cover"
            />

            <p><b>Name:</b> {data.firstParty.name}</p>
            <p><b>CNIC:</b> {data.firstParty.cnic}</p>
          </div>

          <div className="border p-4">
            <h2 className="font-bold mb-3">
              Second Party
            </h2>

            <Image
              src={data.secondParty.image}
              width={120}
              height={120}
              alt=""
              className="mb-2 object-cover"
            />

            <p><b>Name:</b> {data.secondParty.name}</p>
            <p><b>CNIC:</b> {data.secondParty.cnic}</p>
          </div>

        </div>



      </div>
    </div>
  );
}
