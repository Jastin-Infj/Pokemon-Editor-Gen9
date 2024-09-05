"use server";
import { UserData } from "@/types";
import { headers } from "next/headers";

const Import = async () => { 
  console.log("--- Import Start ---");
  const FetchData = async () => {
    let param: UserData = {
      userID: "test",
      userName: "test"
    };
    const headerList = headers();
    const origin = headerList.get('host');

    try {
      const res = await fetch(`http://${origin}/api/user?userID=${param.userID}&userName=${param.userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // Main Process
  try {
    const data = await FetchData();
    return data;
  } catch (error) {
    console.error('Error in Import:', error);
    return { error: error };
  }
};

export default Import;