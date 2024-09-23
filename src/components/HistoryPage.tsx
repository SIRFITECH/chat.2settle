import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloseIcon from "@mui/icons-material/Close";
import { phoneNumberPattern } from "@/utils/utilities";
import { checkUserHasHistory } from "@/helpers/api_call/history_page_calls";

const Transactions: any[] = [];

type ToastType = "success" | "error" | "warning" | "info";

const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userOTPEntry, setUserOTPEntry] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  const router = useRouter();
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const wallet = account.address;

  useEffect(() => {
    if (account.isConnected) {
      handleAuthentication();
      populateHistory(undefined, wallet);
    } else {
      Transactions.length = 0;
      setIsAuthenticated(false);
    }
  }, [account.isConnected]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    Transactions.length > 0
      ? showToast("Here is your transaction history 😉 ", "success")
      : showToast(
          "You need to do better jare, try do transaction!! 😔 ",
          "success"
        );
  };

  const sendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (phoneNumber !== "") {
      if (!phoneNumberPattern.test(phoneNumber)) {
        showToast("Please enter a valid Phone number.", "error");
        return;
      } else {
        populateHistory(phoneNumber, "");
        const generatedOTP = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        setOtp(generatedOTP);
        setOtpSent(true);
        showToast(`Use "${generatedOTP}" as your OTP`, "success");
      }
    } else {
      showToast("You must enter a Phone number.", "error");
    }
  };

  const verifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (userOTPEntry === otp) {
      if (otpSent) {
        setUserOTPEntry("");
      }
      handleAuthentication();
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
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  const getToastColor = (type: ToastType) => {
    const colors = {
      success: "bg-green-600",
      error: "bg-red-600",
      warning: "bg-yellow-600",
      info: "bg-blue-600",
    };
    return colors[type] || colors.info;
  };

  const handleSwitchAccount = () => {
    disconnect();
    setIsAuthenticated(false);
    setOtpSent(false);
    setPhoneNumber("");
    setOtp("");
    setUserOTPEntry("");
    Transactions.length = 0;
    showToast("Please authenticate again", "info");
  };
  const populateHistory = async (
    phoneNumber?: string,
    walletAddress?: string
  ) => {
    if (!phoneNumber && !walletAddress) {
      console.error("Either phone number or wallet address must be provided.");
      return;
    }

    try {
      const userHistory = await checkUserHasHistory(phoneNumber, walletAddress);

      if (userHistory.exists && Array.isArray(userHistory.transactions)) {
        userHistory.transactions.forEach((transaction, index) => {
          let paymentType = transaction.mode_of_payment;

          switch (paymentType) {
            case "transferMoney":
              paymentType = "Paid";
              break;
            case "Gift":
              paymentType = "Gifts Sent";
              break;
            case "Claim Gift":
              paymentType = "Gifts Received";
              break;
            case "request":
              paymentType = "Received";
              break;
            default:
              paymentType = transaction.mode_of_payment;
          }
          const transformedTransaction = {
            id: index + 1,
            type: paymentType,
            amount: transaction.Amount,
            currency: transaction.crypto,
            date: transaction.Date,
            status: transaction.status,
          };
          Transactions.push(transformedTransaction);
        });
      } else {
        console.log("No transactions found for the user.");
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  };

  const filteredTransactions = Transactions.filter((transaction) => {
    const matchesSearch =
      transaction.currency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date?.includes(searchTerm) ||
      transaction.amount?.toString().includes(searchTerm);
    const matchesType =
      filterType === "all" || transaction.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const renderAuthenticationForm = () => (
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
            <form onSubmit={sendOTP}>
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
                className="mb-3 text-white pl-14"
                style={{ backgroundColor: "rgb(13, 118, 252)" }}
              >
                <ConnectButton />
              </div>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="text-white font-bold"
                style={{ backgroundColor: "rgb(13, 118, 252)" }}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOTP}>
              <TextField
                type="text"
                label="Enter OTP"
                variant="outlined"
                fullWidth
                value={userOTPEntry}
                onChange={(e) => setUserOTPEntry(e.target.value)}
                className="mb-4"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="text-white"
                style={{ backgroundColor: "rgb(13, 118, 252)" }}
              >
                Verify OTP
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactionHistory = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-500">
          Transaction History
        </h1>
        <Button
          variant="outlined"
          onClick={handleSwitchAccount}
          className="text-blue-500 border-blue-500 text-xs md:text-lg"
        >
          Switch Account
        </Button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <TextField
            type="text"
            placeholder="Search by amount, crypto or date"
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
            <option value="paid">Paid</option>
            <option value="received">Received</option>
            <option value="gifts sent">Gifts Sent</option>
            <option value="gifts received">Gifts Received</option>
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
                  {filteredTransactions
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            {transaction.type === "Paid" ||
                            transaction.type === "Gifts Sent" ? (
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
                              transaction.status === "Successful"
                                ? "bg-green-200 text-green-800"
                                : transaction.status === "Pending" ||
                                  transaction.status === "Processing"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                    .reverse()}
                </tbody>
              </table>
            ) : (
              <Typography
                variant="body1"
                align="center"
                sx={{ py: 4 }}
                className="text-blue-500 font-semibold text-lg"
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
    </>
  );

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      {isAuthenticated
        ? renderTransactionHistory()
        : renderAuthenticationForm()}
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

// from package.json
// "test": "NODE_OPTIONS='--experimental-vm-modules' jest",
