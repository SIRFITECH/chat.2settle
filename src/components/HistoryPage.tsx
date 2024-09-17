// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import {
//   Button,
//   TextField,
//   Card,
//   CardContent,
//   Typography,
//   Snackbar,
//   IconButton,
//   Box,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

// const isWalletConnected = () => {
//   // Replace this with actual wallet connection check
//   return false;
// };

// const sendOTP = async (phoneNumber: string) => {
//   // Replace this with actual OTP sending logic
//   console.log(`Sending OTP to ${phoneNumber}`);
//   return true;
// };

// const verifyOTP = async (phoneNumber: string, otp: string) => {
//   // Replace this with actual OTP verification logic
//   if(otp  == '1234'){
//      console.log(`Verifying OTP ${otp} for ${phoneNumber}`);

//   return true;
//   }else{
//       console.log(`Verifying OTP failed for ${phoneNumber}`);
//   }

// };

// const mockTransactions: any[] =
//   // [];
//   [
//     {
//       id: 1,
//       type: "Spend",
//       amount: 0.5,
//       currency: "BTC",
//       date: "2023-04-01",
//       status: "Completed",
//     },
//     {
//       id: 2,
//       type: "Receive",
//       amount: 1000,
//       currency: "USD",
//       date: "2023-03-28",
//       status: "Completed",
//     },
//     {
//       id: 3,
//       type: "Spend",
//       amount: 1.2,
//       currency: "ETH",
//       date: "2023-03-25",
//       status: "Pending",
//     },
//     {
//       id: 4,
//       type: "Receive",
//       amount: 500,
//       currency: "EUR",
//       date: "2023-03-20",
//       status: "Completed",
//     },
//     {
//       id: 5,
//       type: "Spend",
//       amount: 0.3,
//       currency: "BTC",
//       date: "2023-03-15",
//       status: "Failed",
//     },
//     {
//       id: 6,
//       type: "Receive",
//       amount: 750,
//       currency: "USD",
//       date: "2023-03-10",
//       status: "Completed",
//     },
//     {
//       id: 7,
//       type: "Spend",
//       amount: 0.5,
//       currency: "BTC",
//       date: "2023-04-01",
//       status: "Completed",
//     },
//     {
//       id: 8,
//       type: "Receive",
//       amount: 1000,
//       currency: "USD",
//       date: "2023-03-28",
//       status: "Completed",
//     },
//     {
//       id: 9,
//       type: "Spend",
//       amount: 1.2,
//       currency: "ETH",
//       date: "2023-03-25",
//       status: "Pending",
//     },
//     {
//       id: 10,
//       type: "Receive",
//       amount: 500,
//       currency: "EUR",
//       date: "2023-03-20",
//       status: "Completed",
//     },
//     {
//       id: 11,
//       type: "Spend",
//       amount: 0.3,
//       currency: "BTC",
//       date: "2023-03-15",
//       status: "Failed",
//     },
//     {
//       id: 12,
//       type: "Receive",
//       amount: 750,
//       currency: "USD",
//       date: "2023-03-10",
//       status: "Completed",
//     },
//   ];

// const HistoryPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const router = useRouter();
//   const [showConnectButton, setShowConnectButton] = useState(false);

//   // Toast state
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       if (isWalletConnected()) {
//         setIsAuthenticated(true);
//         showToast("Wallet connected successfully");
//       }
//     };
//     checkAuthentication();
//   }, []);

//   const handleSendOTP = async () => {
//     if (await sendOTP(phoneNumber)) {

//       setOtpSent(true);
//       showToast("OTP sent successfully");
//     } else {
//       showToast("Failed to send OTP. Please try again.");
//     }
//   };

//   const handleAuthenticateWithWallet = async () => {
//     setShowConnectButton(true);
//   };

//   const handleVerifyOTP = async () => {
//     if (await verifyOTP(phoneNumber, otp)) {
//       setIsAuthenticated(true);
//       showToast("OTP verified successfully");
//     } else {
//       showToast("Invalid OTP. Please try again.");
//     }
//   };

//   const showToast = (message: string) => {
//     setToastMessage(message);
//     setToastOpen(true);
//   };

//   const handleCloseToast = (
//     event: React.SyntheticEvent | Event,
//     reason?: string
//   ) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setToastOpen(false);
//   };

//   const filteredTransactions = mockTransactions.filter((transaction) => {
//     const matchesSearch =
//       transaction.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       transaction.date.includes(searchTerm) ||
//       transaction.amount.toString().includes(searchTerm);
//     const matchesType =
//       filterType === "all" || transaction.type.toLowerCase() === filterType;
//     return matchesSearch && matchesType;
//   });

// if (!isAuthenticated) {
//   return (
//     <div className="container mx-auto p-4 min-h-screen bg-gray-100 flex items-center justify-center">
//       <Card>
//         <CardContent>
//           <Typography
//             variant="h5"
//             component="div"
//             gutterBottom
//             className="text-center"
//           >
//             Authentication Required
//           </Typography>

//           {!otpSent ? (
//             <>
//               <TextField
//                 type="tel"
//                 label="Enter your phone number"
//                 variant="outlined"
//                 fullWidth
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="mb-4"
//               />
//               <Typography
//                 variant="h5"
//                 component="div"
//                 gutterBottom
//                 className="text-center"
//               >
//                 Or
//               </Typography>
//               <Button
//                 variant="contained"
//                 onClick={handleAuthenticateWithWallet}
//                 fullWidth
//                 className="mb-3 text-white"
//                 style={{ backgroundColor: "rgb(13, 118, 252)" }}
//               >
//                 {!showConnectButton ? (
//                   "Authenticate with Wallet"
//                 ) : (
//                   <ConnectButton />
//                 )}
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleSendOTP}
//                 fullWidth
//                 className="text-white"
//                 style={{ backgroundColor: "rgb(13, 118, 252)" }}
//               >
//                 Send OTP
//               </Button>
//             </>
//           ) : (
//             <>
//               <TextField
//                 type="text"
//                 label="Enter OTP"
//                 variant="outlined"
//                 fullWidth
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="mb-4"
//               />
//               <Button
//                 variant="contained"
//                 onClick={handleVerifyOTP}
//                 fullWidth
//                 className="text-white"
//                 style={{ backgroundColor: "rgb(13, 118, 252)" }}
//               >
//                 Verify OTP
//               </Button>
//             </>
//           )}
//         </CardContent>
//       </Card>
//       <Snackbar
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "center",
//         }}
//         open={toastOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseToast}
//         message={toastMessage}
//         ContentProps={{
//           className: "bg-green-600 text-white",
//         }}
//         action={
//           <IconButton
//             size="small"
//             aria-label="close"
//             color="inherit"
//             onClick={handleCloseToast}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         }
//       />
//     </div>
//   );
// }

//   return (
//     <div className="container mx-auto p-4 min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-blue-500">
//         Transaction History
//       </h1>

//       <div className="mb-6 flex flex-col sm:flex-row gap-4">
//         <div className="flex-grow relative">
//           <TextField
//             type="text"
//             placeholder="Search by currency, date, or amount"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             fullWidth
//             InputProps={{
//               startAdornment: <SearchIcon />,
//             }}
//           />
//         </div>
//         <div className="w-full sm:w-48">
//           <TextField
//             select
//             fullWidth
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             SelectProps={{
//               native: true,
//             }}
//           >
//             <option value="all">All Transactions</option>
//             <option value="spend">Spend</option>
//             <option value="receive">Receive</option>
//           </TextField>
//         </div>
//       </div>

//       <Card>
//         <CardContent>
//           <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
//             {filteredTransactions.length > 0 ? (
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 border-b">
//                     <th className="py-2 px-4 text-left">Type</th>
//                     <th className="py-2 px-4 text-left">Amount</th>
//                     <th className="py-2 px-4 text-left">Crypto</th>
//                     <th className="py-2 px-4 text-left">Date</th>
//                     <th className="py-2 px-4 text-left">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTransactions.map((transaction) => (
//                     <tr
//                       key={transaction.id}
//                       className="border-b last:border-b-0"
//                     >
//                       <td className="py-2 px-4">
//                         <div className="flex items-center">
//                           {transaction.type === "Spend" ? (
//                             <ArrowUpwardIcon className="mr-2 h-4 w-4 text-red-500" />
//                           ) : (
//                             <ArrowDownwardIcon className="mr-2 h-4 w-4 text-green-500" />
//                           )}
//                           {transaction.type}
//                         </div>
//                       </td>
//                       <td className="py-2 px-4">{transaction.amount}</td>
//                       <td className="py-2 px-4">{transaction.currency}</td>
//                       <td className="py-2 px-4">{transaction.date}</td>
//                       <td className="py-2 px-4">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             transaction.status === "Completed"
//                               ? "bg-green-200 text-green-800"
//                               : transaction.status === "Pending"
//                               ? "bg-yellow-200 text-yellow-800"
//                               : "bg-red-200 text-red-800"
//                           }`}
//                         >
//                           {transaction.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <Typography
//                 variant="body1"
//                 align="center"
//                 sx={{ py: 4 }}
//                 className="text-blue-500 font-semibold text-lg "
//               >
//                 No transactions yet.
//               </Typography>
//             )}
//           </Box>
//         </CardContent>
//       </Card>

//       <div className="mt-6 flex justify-center mb-30">
//         <Button
//           variant="contained"
//           onClick={() => {
//             router.push("/dashboard");
//             showToast("Returning to Dashboard");
//           }}
//         >
//           Back to Dashboard
//         </Button>
//       </div>

//       <Snackbar
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "center",
//         }}
//         open={toastOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseToast}
//         message={toastMessage}
//         ContentProps={{
//           className: "bg-green-600 text-white",
//         }}
//         action={
//           <IconButton
//             size="small"
//             aria-label="close"
//             color="inherit"
//             onClick={handleCloseToast}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         }
//       />
//     </div>
//   );
// };

// export default HistoryPage;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Snackbar,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const mockTransactions: any[] = [
  // ... (keep the existing mockTransactions array)
];

type ToastType = "success" | "error" | "warning" | "info";

const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const account = useAccount();
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  //  const isWalletConnected = () => {
  //   // Replace this with actual wallet connection check
  //   if(account.isConnected){
  //     setIsAuthenticated(true);
  //     return true;
  //   } else{return false;}

  // };

  const sendOTP = async (phoneNumber: string) => {
    // Replace this with actual OTP sending logic
    console.log(`Sending OTP to ${phoneNumber}`);
    return true;
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    // Replace this with actual OTP verification logic
    if (otp == "1234") {
      console.log(`Verifying OTP ${otp} for ${phoneNumber}`);

      return true;
    } else {
      console.log(`Verifying OTP failed for ${phoneNumber}`);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      if (account.isConnected) {
        setIsAuthenticated(true);
        showToast("Wallet connected successfully", "success");
      }
    };
    checkAuthentication();
  }, []);

  const handleSendOTP = async () => {
    if (await sendOTP(phoneNumber)) {
      setOtpSent(true);
      showToast("OTP sent successfully", "success");
    } else {
      showToast("Failed to send OTP. Please try again.", "error");
    }
  };

  const handleAuthenticateWithWallet = async () => {
    setShowConnectButton(true);
  };

  const handleVerifyOTP = async () => {
    if (await verifyOTP(phoneNumber, otp)) {
      setIsAuthenticated(true);
      showToast("OTP verified successfully", "success");
    } else {
      showToast("Invalid OTP. Please try again.", "error");
    }
  };

  const showToast = (message: string, type: ToastType = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleCloseToast = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      case "info":
      default:
        return "bg-blue-600";
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm);
    const matchesType =
      filterType === "all" || transaction.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 min-h-screen bg-gray-100 flex items-center justify-center">
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              className="text-center"
            >
              Authentication Required
            </Typography>

            {!otpSent ? (
              <>
                <TextField
                  type="tel"
                  label="Enter your phone number"
                  variant="outlined"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mb-4"
                />
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  className="text-center"
                >
                  Or
                </Typography>
                <div
                  className="mb-3 text-white pl-14 "
                  style={{ backgroundColor: "rgb(13, 118, 252)" }}
                >
                  <ConnectButton />
                </div>

                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  className="text-center mt-4"
                ></Typography>

                <Button
                  variant="contained"
                  onClick={handleSendOTP}
                  fullWidth
                  className="text-white font-bold"
                  style={{ backgroundColor: "rgb(13, 118, 252)" }}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <TextField
                  type="text"
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mb-4"
                />
                <Button
                  variant="contained"
                  onClick={handleVerifyOTP}
                  fullWidth
                  className="text-white"
                  style={{ backgroundColor: "rgb(13, 118, 252)" }}
                >
                  Verify OTP
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={toastOpen}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          message={toastMessage}
          ContentProps={{
            className: `${getToastColor(toastType)} text-white`,
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseToast}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">
        Transaction History
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <TextField
            type="text"
            placeholder="Search by currency, date, or amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <TextField
            select
            fullWidth
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="all">All Transactions</option>
            <option value="spend">Spend</option>
            <option value="receive">Receive</option>
          </TextField>
        </div>
      </div>

      <Card>
        <CardContent>
          <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {filteredTransactions.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Crypto</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="py-2 px-4">
                        <div className="flex items-center">
                          {transaction.type === "Spend" ? (
                            <ArrowUpwardIcon className="mr-2 h-4 w-4 text-red-500" />
                          ) : (
                            <ArrowDownwardIcon className="mr-2 h-4 w-4 text-green-500" />
                          )}
                          {transaction.type}
                        </div>
                      </td>
                      <td className="py-2 px-4">{transaction.amount}</td>
                      <td className="py-2 px-4">{transaction.currency}</td>
                      <td className="py-2 px-4">{transaction.date}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "Completed"
                              ? "bg-green-200 text-green-800"
                              : transaction.status === "Pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography
                variant="body1"
                align="center"
                sx={{ py: 4 }}
                className="text-blue-500 font-semibold text-lg "
              >
                No transactions yet.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center mb-30">
        <Button
          variant="contained"
          onClick={() => {
            router.push("/");
            showToast("Returning to Home", "info");
          }}
        >
          Back to Home
        </Button>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        message={toastMessage}
        ContentProps={{
          className: `${getToastColor(toastType)} text-white`,
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseToast}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default HistoryPage;
