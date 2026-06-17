

import { ConnectDb } from "@/dbConfig/dbConfig";
import Agreement from "@/models/AgreementModel";
import Image from "next/image";

async function fetchAgreement(id) {
  await ConnectDb();
  return Agreement.findById(id).lean();
}

export default async function Page({ params }) {
  const { id } = await params;

  const data = await fetchAgreement(id);

  if (!data) return <div>Not found</div>;

  // QR Code
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `AGREEMENTID-${data._id}-FIRSTPARTY-${data.firstParty.name}-FIRSTPARTYCNIC-${data.firstParty.cnic}-SECONDPARTY-${data.secondParty.name}-SECONDPARTYCNIC-${data.secondParty.cnic}`
  )}`;

  const currentDate = new Date().toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex justify-center p-10 bg-gray-100">

      {/* A4 Page */}
      <div className="bg-white w-[800px] p-10 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">

          {/* Logo */}
          <div>
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={120}
              priority
            />
          </div>

          {/* QR */}
          <div className="text-center">
            <Image
              src={qr}
              alt="QR Code"
              width={120}
              height={120}
              unoptimized
            />
            <p className="text-xs mt-1">
              Scan For Verification
            </p>
          </div>

        </div>

        {/* Title */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold">
            VERIFICATION DOCUMENT
          </h1>

          <p className="text-gray-600 mt-2">
            Date: {currentDate}
          </p>

          <p className="text-gray-600">
            Time: {currentTime}
          </p>

          <p className="text-sm mt-2">
            ID: {data._id.toString()}
          </p>
        </div>

        {/* Parties */}
        <div className="flex justify-between gap-10 mt-10">

          {/* First Party */}
          <div className="flex-1 border rounded p-4">

            <h2 className="font-bold text-lg mb-4 text-center">
              First Party
            </h2>

            <div className="flex justify-center">
              <Image
                src={data.firstParty.image}
                width={200}
                height={200}
                alt="First Party"
                className="object-cover border"
              />
            </div>

            <div className="mt-4">
              <p>
                <b>Name:</b> {data.firstParty.name}
              </p>

              <p>
                <b>CNIC:</b> {data.firstParty.cnic}
              </p>
            </div>

          </div>

          {/* Second Party */}
          <div className="flex-1 border rounded p-4">

            <h2 className="font-bold text-lg mb-4 text-center">
              Second Party
            </h2>

            <div className="flex justify-center">
              <Image
                src={data.secondParty.image}
                width={200}
                height={200}
                alt="Second Party"
                className="object-cover border"
              />
            </div>

            <div className="mt-4">
              <p>
                <b>Name:</b> {data.secondParty.name}
              </p>

              <p>
                <b>CNIC:</b> {data.secondParty.cnic}
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="border-t mt-10 pt-4 text-center text-sm text-gray-500">
          This document is digitally generated and can be verified using the QR Code.
        </div>

      </div>
    </div>
  );
}
