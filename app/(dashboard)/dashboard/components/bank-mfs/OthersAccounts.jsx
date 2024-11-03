import React, { useState } from "react";
import { Edit, Check, X } from "lucide-react";

const OthersAccounts = ({ accounts, handleEdit }) => {
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
    handleEdit(editedAccount, 'others');
    setEditingAccountId(null);
  };

  const handleCancel = () => {
    setEditingAccountId(null);
  };

  if (accounts?.length < 1) {
    return (
      <table className="w-full table-auto text-xs">No Others Account Found</table>
    );
  }

  return (
    <div>
      <table className="w-full table-auto text-xs">
        <thead>
          <tr className="text-md border-b-2 border-b-slate-200 text-center font-semibold text-slate-400 dark:bg-meta-4">
            <th className="px-4 py-4">S/N</th>
            <th className="min-w-[150px] px-4 py-4">Name</th>
            <th className="px-4 py-4">Email</th>
            <th className="px-4 py-4">Payoneer ID</th>
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
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="methode"
                    value={editedAccount.methode}
                    onChange={handleInputChange}
                    className="text-center"
                  />
                ) : (
                  <h5 className="flex items-center justify-center gap-1 font-medium text-black dark:text-white">
                    {acc.methode}
                  </h5>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="email"
                    name="stripeEmail"
                    value={editedAccount.stripeEmail}
                    onChange={handleInputChange}
                    className="text-center"
                  />
                ) : (
                  <p className="text-black dark:text-white">
                    {acc.stripeEmail}
                  </p>
                )}
              </td>
              <td className="px-4 py-5 dark:border-strokedark">
                {editingAccountId === acc._id ? (
                  <input
                    type="text"
                    name="payoneerId"
                    value={editedAccount.payoneerId}
                    onChange={handleInputChange}
                    className="text-center"
                  />
                ) : (
                  <p className="text-black dark:text-white">
                    {acc.payoneerId}
                  </p>
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

export default OthersAccounts;
