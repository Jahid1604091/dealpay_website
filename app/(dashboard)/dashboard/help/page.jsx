"use client";
import React from "react";
import Header from "../components/Header";
import { Mail, MessageCircleMore } from "lucide-react";

export default function Help() {
  return (
    <div>
      <Header title="Help" />

      <div className="md:w-[600px] mx-auto p-16">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex gap-4 items-center">
              <MessageCircleMore className="text-blue-500" />
              <div className="text-sm leading-loose">
                <h5 className="font-bold capitalize">Messanger</h5>
              </div>
            </div>
            
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex gap-4 items-center">
              <Mail className="text-green-500" />
              <div className="text-sm leading-loose">
                <h5 className="font-bold capitalize">Email</h5>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}
