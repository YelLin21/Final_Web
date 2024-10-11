"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_BASE;

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => startEditMode(params.row)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteCustomer(params.row)}
              className="bg-gray-300 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md"
            >
              🗑️
            </button>
          </div>
        );
      },
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "dateofbirth", headerName: "Date of Birth", width: 150 },
    { field: "membernumber", headerName: "Member Number", width: 150 },
    { field: "interests", headerName: "Interests", width: 150 },
  ];

  const [customerList, setCustomerList] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [editMode, setEditMode] = useState(false);

  async function fetchCustomer() {
    const data = await fetch(`${APIBASE}/customer`);
    const c = await data.json();
    const c2 = c.map((customer) => {
      return {
        ...customer,
        id: customer._id,
      };
    });
    setCustomerList(c2);
  }

  useEffect(() => {
    fetchCustomer();
  }, []);

  async function deleteCustomer(customer) {
    if (!confirm(`Deleting ${customer.name}`)) return;

    const id = customer._id;
    try {
      const response = await fetch(`${APIBASE}/customer/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      fetchCustomer();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  }

  function handleMemberFormSubmit(data) {
    if (editMode) {
      fetch(`${APIBASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchCustomer();
        stopEditMode();
      });
      return;
    }
    fetch(`${APIBASE}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchCustomer();
        stopEditMode();
      });
}
  
  function startEditMode(customer) {
    reset(customer);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: "",
      dateofbirth: "",
      membernumber: "",
      interests: "",
    });
    setEditMode(false);
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen pt-20">
      {/* Form Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Manage Customer</h2>
          <form
            onSubmit={handleSubmit(handleMemberFormSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name:
              </label>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date of Birth:
              </label>
              <input
                name="dateofbirth"
                type="date"
                {...register("dateofbirth", { required: true })}
                className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Member Number:
              </label>
              <input
                name="membernumber"
                type="number"
                {...register("membernumber", { required: true })}
                className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Interests:
              </label>
              <input
                name="interests"
                type="String"
                {...register("interests", { required: true })}
                className="border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              />
            </div>

            <div className="col-span-2 flex justify-end space-x-4 mt-4">
              {editMode ? (
                <>
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg"
                  />
                  <button
                    onClick={() => stopEditMode(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <input
                  type="submit"
                  value="Create"
                  className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg"
                />
              )}
            </div>
          </form>
        </div>

        {/* DataGrid Table */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Customer List</h2>
          <DataGrid
            rows={customerList}
            columns={columns}
            pageSize={5}
            autoHeight
            className="text-gray-700"
          />
        </div>
      </main>
  );
}
