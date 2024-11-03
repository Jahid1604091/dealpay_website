import { BASE_URL } from "@/app/utils/constants";
import Image from "next/image";
import React, { useState } from "react";
import { Edit, Check, X } from "lucide-react";

const BankAccounts = ({ accounts, handleEdit }) => {
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [editedAccount, setEditedAccount] = useState({});

  // Start editing the selected account
  const handleEditClick = (acc) => {
    setEditingAccountId(acc._id);
    setEditedAccount(acc);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAccount({ ...editedAccount, [name]: value });
  };

  const handleSave = () => {
    handleEdit(editedAccount,'bank');
    setEditingAccountId(null);
  };

  const handleCancel = () => {
    setEditingAccountId(null);
  };

  if (accounts?.length < 1) {
    return <table className="w-full table-auto text-xs">No Bank Account Found</table>;
  }

  return (
    <div>
      <table className="w-full table-auto text-xs">
        <thead>
          <tr className="text-md border-b-2 border-b-slate-200 text-center font-semibold text-slate-400 dark:bg-meta-4">
            <th className="px-4 py-4">S/N</th>
            <th className="min-w-[150px] px-4 py-4">Bank</th>
            <th className="px-4 py-4">Acc. Number</th>
            <th className="px-4 py-4">Acc. Name</th>
            <th className="px-4 py-4">Branch</th>
            <th className="px-4 py-4">Routing Number</th>
            <th className="px-4 py-4">SWIFT Code</th>
            <th className="px-4 py-4">Country</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map((acc, key) => (
            <tr key={acc._id} className="text-center">
              <td className="cursor-pointer px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">{key + 1}</p>
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                <p className="flex items-center justify-center gap-1 text-black dark:text-white">
                  <Image
                    src={BASE_URL + acc.logo}
                    height={60}
                    width={60}
                    alt="Logo"
                  />
                  {editingAccountId === acc._id ? (
                    <input
                      type="text"
                      name="bankName"
                      value={editedAccount.bankName}
                      onChange={handleInputChange}
                      className="w-full max-w-[100px] text-center p-1"
                    />
                  ) : (
                    acc.bankName
                  )}
                </p>
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="accountNumber"
                    value={editedAccount.accountNumber}
                    onChange={handleInputChange}
                    className="w-full max-w-[100px] text-center p-1"
                  />
                ) : (
                  <p className="text-black dark:text-white">{acc.accountNumber}</p>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="accountName"
                    value={editedAccount.accountName}
                    onChange={handleInputChange}
                    className="w-full max-w-[100px] text-center p-1"
                  />
                ) : (
                  <p className="text-black dark:text-white">{acc.accountName}</p>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="branchName"
                    value={editedAccount.branchName}
                    onChange={handleInputChange}
                    className="w-full max-w-[100px] text-center p-1"
                  />
                ) : (
                  <p className="text-black dark:text-white">{acc.branchName}</p>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="routingNumber"
                    value={editedAccount.routingNumber}
                    onChange={handleInputChange}
                    className="w-full max-w-[100px] text-center p-1"
                  />
                ) : (
                  <p className="text-black dark:text-white">{acc.routingNumber}</p>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="swiftCode"
                    value={editedAccount.swiftCode}
                    onChange={handleInputChange}
                    className="w-full max-w-[100px] text-center p-1"
                  />
                ) : (
                  <p className="text-black dark:text-white">{acc.swiftCode}</p>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="country"
                    value={editedAccount.country}
                    onChange={handleInputChange}
                    className="w-full max-w-[100px] text-center p-1"
                  />
                ) : (
                  <p className="text-black dark:text-white">{acc.country}</p>
                )}
              </td>
              {/* <td className="flex items-center justify-center gap-2 px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <div className="flex gap-2">
                    <Check
                      size={16}
                      onClick={handleSave}
                      className="cursor-pointer"
                      aria-label="Save"
                    />
                    <X
                      size={16}
                      onClick={handleCancel}
                      className="cursor-pointer"
                      aria-label="Cancel"
                    />
                  </div>
                ) : (
                  <Edit
                    size={16}
                    className="cursor-pointer"
                    onClick={() => handleEditClick(acc)}
                    aria-label="Edit"
                  />
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankAccounts;
