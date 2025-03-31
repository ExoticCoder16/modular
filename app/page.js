"use client";

import { useState } from "react";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [divisor, setDivisor] = useState(123);
  const [modular, setModular] = useState(45);
  const [result, setResult] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Placeholder for equation processing logic
//     setResult(`Processing equation: ${divisor}x + ${modular}y = 3`);
//   };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("/api/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                divisor_number: divisor, 
                modular_number: modular 
            }),
        });

        const data = await response.json();

        if (data.error) {
            setResult(`Error: ${data.error}`);
        } else {
            // setResult(JSON.stringify(data.results, null, 2)); // Display formatted results
            setResult(data.results); // Set the results directly
        }
    } catch (error) {
        console.error("Error:", error);
        setResult("Error processing equation.");
    }
};
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Math Equation Solver</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Divisor Number</label>
          <input
            type="number"
            value={divisor}
            onChange={(e) => setDivisor(Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Modular Number</label>
          <input
            type="number"
            value={modular}
            onChange={(e) => setModular(Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Solve Equation
        </button>
      </form>
      {/* {result && <p className="mt-4 text-lg font-semibold">{result}</p>} */}
      {result && <ResultTable result={result} />}
    </div>
  );
}
