import React from "react";
import ChatBot from "../components/ChatBot";
import Link from "next/link";
import PageBody from "../components/Body";
import Layout from "../components/Layout";
const Transact = () => {
  return (
    // <div className="p-4">
    //   <Link href="/" legacyBehavior>
    //     <a className="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    //       Return Home
    //     </a>
    //   </Link>
    //   <h2 className="flex flex-col justify-center items-center font-bold font-Poppins text-black text-2xl">
    //     <br />
    //     <span className="animate-pulse text-blue-500 text-5xl">
    //       <b>Transact History</b>
    //     </span>
    //   </h2>
    //   {/* <ChatBot /> */}
    // </div>
    <Layout>
      <PageBody />
    </Layout>
  );
};

export default Transact;
