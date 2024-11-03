"use client";
import { Fingerprint, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import Link from "next/link";
import {useSelector} from 'react-redux'

export default function Security() {
  const router = useRouter();
  const { t } = useTranslation();
  const {verifiedUserInfo} = useSelector(state=>state.auth);
  const [fingerprintStatus, setFingerprintStatus] = useState(""); 

  // Function to handle fingerprint setup using WebAuthn
  const handleFingerprintSetup = async () => {
    try {
      const publicKeyOptions = {
        challenge: new Uint8Array([ // This challenge should come from the server
          0x8C, 0xAF, 0xD4, 0x7C, 0xC8, 0xAA, 0x0A, 0xEE,
        ]).buffer, 
        rp: {
          name: "Delapay Asia",
        },
        user: {
          id: new Uint8Array(16), // User ID: Replace with actual user's ID (e.g., from database)
          name: verifiedUserInfo?.user?.email || verifiedUserInfo?.user?.number,
          displayName: "User",
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7, // ES256 algorithm
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // This indicates fingerprint (platform authenticator)
        },
        timeout: 60000, // Optional timeout
        attestation: "none", // No attestation needed
      };

      // Step 2: Trigger fingerprint setup using WebAuthn
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      });

      if (credential) {
        // Step 3: Send the result to your server for verification and storage
        console.log("Fingerprint setup successful:", credential);
        setFingerprintStatus("Fingerprint setup successful!");
      }
    } catch (error) {
      console.error("Error during fingerprint setup:", error);
      setFingerprintStatus("Fingerprint setup failed.");
    }
  };

  return (
    <div>
      <Header title="Security" />

      <div className="md:w-[800px] mx-auto p-16">
        {/* Fingerprint Section */}
        <div className="flex justify-between items-center py-16 my-16 border-b-2">
          <div className="flex gap-16 items-center justify-center mx-auto md:mx-0">
            <Fingerprint />
            <div className="text-sm leading-loose">
              <h5 className="font-bold">Fingerprint</h5>
              <button
                onClick={handleFingerprintSetup}
                className="text-blue-500 underline mt-2"
              >
                Set up fingerprint
              </button>
              {fingerprintStatus && (
                <p className="mt-2 text-green-600">{fingerprintStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* PIN Section */}
        <div className="flex justify-between items-center py-16 my-16 border-b-2">
          <div className="flex gap-16 items-center justify-center mx-auto md:mx-0">
            <Ellipsis />
            <div className="text-sm leading-loose">
              <h5 className="font-bold">
                <Link href="/auth/forget-pin">PIN</Link>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
