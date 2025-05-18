
import React from "react";
import { CalendarioProvider } from "@/contexts/CalendarioContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkArea from "@/components/WorkArea";

const Index = () => {
  return (
    <CalendarioProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <WorkArea />
        </div>
      </div>
    </CalendarioProvider>
  );
};

export default Index;
