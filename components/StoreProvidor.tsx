"use client";
import { Provider } from "jotai";
import MessageDailog from "./Dailog/Message";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion"

export default function StoreProvidor({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function getLoader() {
      const { bouncy, dotPulse, leapfrog } = await import("ldrs");
      bouncy.register();
      dotPulse.register();
      leapfrog.register();
    }
    getLoader();
  }, []);
  return (
    <>
      <Provider>
      <AnimatePresence mode="sync">
          <SessionProvider>
            {children}
            <ToastContainer
              position="bottom-right"
              theme="colored"
              draggable
              pauseOnHover
              autoClose={4000}
            />
            <MessageDailog />
          </SessionProvider>
        </AnimatePresence>
      </Provider>
    </>
  );
}
