import { Edit, Check, X } from "lucide-react"; // Added check and X icons for save/cancel actions
import React, { useState } from "react";

const MfsAccounts = ({ accounts, handleEdit }) => {
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
    handleEdit(editedAccount,'mfs');
    setEditingAccountId(null);
  };

  const handleCancel = () => {
    setEditingAccountId(null);
  };

  if (accounts?.length < 1) {
    return (
      <table className="w-full table-auto text-xs">No MFS Account Found</table>
    );
  }

  return (
    <div>
      <table className="w-full table-auto text-xs">
        <thead>
          <tr className="text-md border-b-2 border-b-slate-200 text-center font-semibold text-slate-400 dark:bg-meta-4">
            <th className="px-4 py-4">S/N</th>
            <th className="min-w-[150px] px-4 py-4">Name</th>
            <th className="px-4 py-4">Merchant Number</th>
            <th className="px-4 py-4">Methode</th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map((acc, key) => (
            <tr key={acc._id} className="text-center">
              <td className="cursor-pointer px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">{key + 1}</p>
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    className="text-center"
                    type="text"
                    name="businessName"
                    value={editedAccount.businessName}
                    onChange={handleInputChange}
                  />
                ) : (
                  acc.businessName
                )}
              </td>
              <td className="py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    className="text-center"
                    type="number"
                    name="merchantNumber"
                    value={editedAccount.merchantNumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  acc.merchantNumber
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {acc.methode}
              </td>
              {/* <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <div className="flex gap-2">
                    <Check
                      size={16}
                      onClick={handleSave}
                      className="cursor-pointer"
                    />
                    <X
                      size={16}
                      onClick={handleCancel}
                      className="cursor-pointer"
                    />
                  </div>
                ) : (
                  <Edit
                    size={16}
                    className="cursor-pointer"
                    onClick={() => handleEditClick(acc)}
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

export default MfsAccounts;
