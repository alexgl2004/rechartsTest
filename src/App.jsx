import { useState } from 'react'
import React from "react";
import Papa from "papaparse";
import './App.css'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const allowedExtensions = ["csv"];
 
function App() {
  const [count, setCount] = useState(0)

    // This state will store the parsed data
    const [seriesXY, setSeriesXY] = useState([]); 
 
    // It state will contain the error when
    // correct file extension is not used
    const [error, setError] = useState("");
 
    // It will store the file uploaded by the user
    const [file, setFile] = useState("");


  const handleFileChange = (e) => {

    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension =
          inputFile?.type.split("/")[1];
      if (
          !allowedExtensions.includes(fileExtension)
      ) {
          setError("Please input a csv file");
          return;
      }

      // If input type is correct set the state        
      console.log(inputFile)
      setFile(inputFile);
    }

};

  const handleParse = () => {
     
// If user clicks the parse button without
    // a file we show a error
    if (!file) return alert("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
        const csv = Papa.parse(target.result, {
            delimiter: ";",
            header: false,
            skipFirstNLines: 5
        });
        const parsedData = csv?.data;

        const numberToDelete = [0, 1, 2, 3, 4, (parsedData.length), (parsedData.length-1), (parsedData.length-2), (parsedData.length-3)];
        const filteredparsedData = parsedData.filter((number,index) => numberToDelete.indexOf(index) === -1);

        let rowData = []

        let test_1 = 0

        filteredparsedData.sort((a, b) => {
          if (b[0] < a[0]) {
            return -1;
          }
          if (b[0] > a[0]) {
            return 1;
          }
        
          return 0;

        })

        filteredparsedData.forEach((value) => {
          const test = Date.parse(value[0].toString());
          test_1 += 1;
          if(value[3]!=='.' && value[3]!=='' && test_1 < 1000000){

            rowData = [
              {
//                'test': test_1,
                'uv': Date.parse(value[0].toString()),
                'test_date': new Date(test).getFullYear() + '-' + new Date(test).getMonth() + '-' + new Date(test).getDay(),
                'pv' : parseFloat(value[3].replace(',','.'))
              },
              ...rowData
            ]
          }
        })

        setSeriesXY(rowData)

    };

    reader.readAsText(file);

//    console.log(rowData);
//    console.log(xSeries,ySeries);

  };

  const renderLineChart = (
    <LineChart width={1000} height={200} data={seriesXY} >
      <XAxis dataKey="test_date" />
      <YAxis />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={false} activeDot={false} />
    </LineChart>
  );


  return (
    <>
      <h1>Gold from DeutschBank</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        {seriesXY.length>0?renderLineChart:false}
      </p>
      <label
          htmlFor="csvInput"
          style={{ display: "block" }}
      >
          Enter CSV File
      </label>
      <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
      />
      <div>
          <button onClick={handleParse}>
              Parse
          </button>
      </div>
    </>
  )
}

export default App
