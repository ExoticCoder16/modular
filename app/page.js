"use client";

import { useState, useEffect } from "react";
import ResultTable from "../components/ResultTable";

export default function Home() {
  const [divisor, setDivisor] = useState(123);
  const [modular, setModular] = useState(45);
  const [result, setResult] = useState(null);
  const [equationDetails, setEquationDetails] = useState(null);
  const [k, setK] = useState(0); // New state for user input
  const [computedSteps, setComputedSteps] = useState(null);
  const [shouldJump, setShouldJump] = useState(false);
  const [zerosTilGCD, setZerosTilGCD] = useState(0);
  const [sumNonZerosTilGCD, setSumNonZerosTilGCD] = useState(0);
  const [totalZeros, setTotalZeros] = useState(0);
  const [totalSumNonZeros, setTotalSumNonZeros] = useState(0);
  const [nonZeroCountTilGCD, setNonZeroCountTilGCD] = useState(0);
  const [totalNonZeroCount, setTotalNonZeroCount] = useState(0);

  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Placeholder for equation processing logic
//     setResult(`Processing equation: ${divisor}x + ${modular}y = 3`);
//   };

useEffect(() => {
    if (!equationDetails) return;
  
    const x = equationDetails.cycle + equationDetails.total_cycle * k;
    const y = -(equationDetails.round + equationDetails.total_round * k);
    const computedValue = divisor * x + modular * y;
  
    // Step-by-step breakdown
    const step1 = `= ${divisor}(${equationDetails.cycle} + ${equationDetails.total_cycle}(${k})) + ${modular}(-(${equationDetails.round} + ${equationDetails.total_round})(${k}))`;
    // const step2 = `${divisor}(${x}) + ${modular}(${y}) = ${equationDetails.gcd_value}`;
    const step2 = `= ${divisor}(${equationDetails.cycle}) + ${divisor}(${equationDetails.total_cycle}(${k})) - ${modular}(${equationDetails.round}) - ${modular}(${equationDetails.round}(${k}))`;
    const step3 = `= ${divisor * equationDetails.cycle} + ${divisor * equationDetails.total_cycle * k} - ${modular * equationDetails.round} - ${modular * equationDetails.round * k}`;
    const step4 = `= ${divisor * equationDetails.cycle + divisor * equationDetails.total_cycle * k - modular * equationDetails.round - modular * equationDetails.round * k}`;
  
    setComputedSteps({ step1, step2, step3, step4, computedValue });
  
  }, [k, equationDetails, divisor, modular]);

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("/api/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                divisor, 
                modular 
            }),
        });

        const data = await response.json();
        
        if (data.error) {
            setResult(`Error: ${data.error}`);
            setEquationDetails(null);
        } else {
            // setResult(JSON.stringify(data.results, null, 2)); // Display formatted results
            setResult(data.results); // Set the results directly
        }
        
        if (!data.results) {
            setResult("Unexpected server response: missing results.");
            // setEquationDetails(null);
            return;
        }
        
        console.log("data results :", data.results);
        setResult(data.results);

         // Compute GCD dynamically
         const gcd_value = data.gcd_value;
         const total_cycle = data.total_cycle;
         const total_round = data.total_round;

           // Extract cycle number where remainder == gcd
        let cycle = null;
        let round = null;

        if (data.results) {
            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i].remainder_mod_modular === gcd_value) { // Use dynamic GCD
                    cycle = data.results[i].cycle;
                    round = i + 1; // +1 because i is zero-based which started from [0], and the real round number started from 1
                    break;
                }
            }
        }
        setEquationDetails({ cycle, total_cycle, round, total_round, gcd_value });

        // New logic: Summing up zero and nonzero values
        let zerosTilGCD = 0;
        let sumNonZerosTilGCD = 0;
        let stopAtGCD = false;
        
        let totalZeros = 0;
        let totalSumNonZeros = 0;

        let nonZeroCountTilGCD = 0;
        let totalNonZeroCount = 0;

        let zeroIndexes = [];
        let remainderCount = {};
        
        for (let i = 0; i < data.results.length; i++) {
            const value = data.results[i].remainder_mod_modular;
        
            // ======== Set 1: Count before and including GCD =========
            if (!stopAtGCD) {
                if (value === 0) {
                    zerosTilGCD += 1;
                } else {
                    sumNonZerosTilGCD += value;
                    nonZeroCountTilGCD += 1;
        
                    // Check for GCD *after* adding
                    if (value === gcd_value) {
                        console.log(`Stopped Set 1 at index ${i} because remainder equals GCD (${gcd_value})`);
                        stopAtGCD = true;
                    }
                }
            }
        
            // ======== Set 2: Count everything =========
            if (value === 0) {
                totalZeros += 1;
            } else {
                totalSumNonZeros += value;
                totalNonZeroCount += 1;
            }
        }        

        if (data.results) {
            for (let i = 0; i < data.results.length; i++) {
                const value = Number(data.results[i].remainder_mod_modular);
                if (value === 0) {
                    zeroIndexes.push(i);
                }
            }
        }

        console.log("Remainder Frequency:", remainderCount);
        console.log("Indexes of Zeros:", zeroIndexes);

        setZerosTilGCD(zerosTilGCD);
        setSumNonZerosTilGCD(sumNonZerosTilGCD);
        setNonZeroCountTilGCD(nonZeroCountTilGCD);

        setTotalZeros(totalZeros);
        setTotalSumNonZeros(totalSumNonZeros);
        setTotalNonZeroCount(totalNonZeroCount);
    } catch (error) {
        console.error("Error:", error);
        setResult("Error processing equation.");
        setEquationDetails(null);
    }
};

const computeEquationResult = () => {
    if (!equationDetails) return null;
    console.log("equationDetails:", equationDetails);
    console.log(" equationDetails.cycle:", equationDetails.cycle)
    console.log(" equationDetails.total_cycle:", equationDetails.total_cycle)
    const x = equationDetails.cycle + equationDetails.total_cycle * k;
    console.log("x:", x);
    const y = -(30 + equationDetails.round * k);
    console.log("y:", y);
    const computedValue = divisor * x + modular * y;
    console.log("computedValue:", computedValue);
  
    return computedValue;
  };

  const handleKChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers, including negatives, but prevent invalid characters
    if (/^[-]?\d*$/.test(value)) {
      setK(value);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Math Equation Solver</h1>
    <div className="flex flex-row items-center justify-center space-x-between p-4">
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

      {equationDetails && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
          <p className="text-lg font-semibold">Equation :</p>
          <p>{divisor}x + {modular}y = {equationDetails.gcd_value}</p>
          <p className="text-lg font-semibold">General Equation :</p>
          <p>{divisor}({equationDetails.cycle} + {equationDetails.total_cycle}k) + {modular}(-({equationDetails.round} + {equationDetails.total_round})k) = {equationDetails.gcd_value}</p>


         {/* User input for k */}
            <div className="mt-4">
            <label className="block text-gray-700">Enter k:</label>
            <input
            type="number"
            value={k}
            onChange={handleKChange}
            className="w-full p-2 border rounded mt-1"
            />
        </div>

          {/* Computed result with real-time steps */}
    {computedSteps && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
        <p className="text-lg font-semibold">Step-by-Step Breakdown:</p>
        <p>{computedSteps.step1}</p>
        <p>{computedSteps.step2}</p>
        <p>{computedSteps.step3}</p>
        <p>{computedSteps.step4}</p>
      </div>
    )}

        {/* Computed result*/}
        <p className="mt-4 text-lg font-semibold">
            Computed Equation Output: {computeEquationResult()}
        </p>

        {/* Check if the computed value matches the GCD */}
        <p className={`mt-2 ${computeEquationResult() === equationDetails.gcd_value ? "text-green-600" : "text-red-600"}`}>
            {computeEquationResult() === equationDetails.gcd_value ? "✅ Correct! Matches GCD" : "❌ Incorrect! Does not match GCD"}
        </p>
        </div>

      )}

      {equationDetails &&
        <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
        <p className="text-lg font-semibold">General Equation :</p>
        <p>{divisor}({equationDetails.cycle} + {equationDetails.total_cycle}k) + {modular}(-({equationDetails.round} + {equationDetails.total_round})k) = {equationDetails.gcd_value}</p>
            <p className="text-lg font-semibold">Explanation:</p>
            <p>Total Cycle : {equationDetails.total_cycle}</p>
            <p>gcd cycle#: {equationDetails.cycle}</p>
            <p>gcd round#: {equationDetails.round}</p>
            <br/>
            <p>Total Count of Zeros Til GCD: {zerosTilGCD}</p>
            <p>Sum of Non-Zero Values Til GCD: {sumNonZerosTilGCD} </p>
            <p>Total Numbers of Non-Zero Values Til GCD : {nonZeroCountTilGCD} ({equationDetails.round} - {zerosTilGCD})</p>
            <p>{sumNonZerosTilGCD} which is added up by remainders in that {nonZeroCountTilGCD} rounds, {sumNonZerosTilGCD}-{divisor} = {sumNonZerosTilGCD-divisor}</p>
            <p>Therefore the last cycle of {divisor} would be {divisor}-{sumNonZerosTilGCD-divisor} = {divisor-(sumNonZerosTilGCD-divisor)}</p>
            <br/>
            <p>Total Count of Zeros: {totalZeros}</p>
            <p>Sum of Non-Zero Values: {totalSumNonZeros}</p>
            <p>Total Numbers of Non-Zero Values Til GCD : {totalNonZeroCount}</p>
        </div>
      }
      </div>

     { equationDetails && equationDetails.gcd_value &&
      <button onClick={() => setShouldJump(true)} className="bg-blue-500 text-white p-2 rounded">
        Jump to GCD = {equationDetails.gcd_value} / Remainder mod {modular} = {equationDetails.gcd_value} Row
      </button>
     }
     
      {/* {result && <p className="mt-4 text-lg font-semibold">{result}</p>} */}
      {result && <ResultTable result={result} gcd={equationDetails.gcd_value} shouldJump={shouldJump} setShouldJump={setShouldJump} />}
    </div>
    
  );
}
