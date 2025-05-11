import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tree from "react-d3-tree";

const dummyTreeData = [
  {
    name: "Alpha Hen",
    attributes: {
      Type: "Layer",
      EggsPerMonth: "30",
      Health: "Excellent",
    },
    children: [
      {
        name: "Beta Chick",
        attributes: {
          Type: "Broiler",
          Health: "Good",
        },
      },
      {
        name: "Gamma Chick",
        attributes: {
          Type: "Layer",
          Health: "Fair",
        },
      },
    ],
  },
];

const PedigreeTracking = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">🧬 Pedigree Tracking</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-600">Total Birds</h2>
            <p className="text-2xl text-blue-600 font-bold mt-2">42</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-600">Avg Eggs/Month</h2>
            <p className="text-2xl text-green-600 font-bold mt-2">26</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-600">Health Issues</h2>
            <p className="text-md text-red-500 mt-2">Respiratory (5), Parasites (2)</p>
          </div>
        </div>

        {/* Add Bird Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Bird Record</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" type="text" placeholder="Bird Name" />
            <input className="input" type="text" placeholder="Bird Tag/ID" />
            <select className="input">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input className="input" type="date" />
            <input className="input" type="text" placeholder="Type (e.g., Layer)" />
            <textarea className="input col-span-2" placeholder="Health Notes"></textarea>
            <button className="col-span-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
              Save Bird
            </button>
          </form>
        </div>

        {/* Pedigree Tree */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Lineage Tree</h2>
          <div className="h-[400px] overflow-auto border rounded-lg p-2 bg-gray-100">
            <Tree data={dummyTreeData} orientation="vertical" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PedigreeTracking;
