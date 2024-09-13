// import React, { useState } from "react";
// import dynamic from "next/dynamic";
 
// // Load the scanner component dynamically to avoid SSR issues
// const BarcodeScannerComponent = dynamic(
//   () => import("react-qr-barcode-scanner").then((mod) => mod.default),
//   { ssr: false }
// );

// const BarcodeScanner = ({ onScan }) => {
//   const [data, setData] = useState("");

//   const handleUpdate = (err, result) => {
//     if (result) {
//       setData(result.text);
//       onScan(result.text);
//     }
//   };

//   return (
//     <div>
//       <BarcodeScannerComponent onUpdate={handleUpdate} />
//       <p>Scanned Code: {data}</p>
//     </div>
//   );
// };

// export default BarcodeScanner;


// import React from "react";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";

// function App() {
//   const [data, setData] = React.useState("Not Found");

//   return (
//     <>
//       <BarcodeScannerComponent
//         width={500}
//         height={500}
//         onUpdate={(err, result) => {
//           if (result) setData(result.text);
//           else setData("Not Found");
//         }}
//       />
//       <p>{data}</p>
//     </>
//   );
// }

// export default App;

