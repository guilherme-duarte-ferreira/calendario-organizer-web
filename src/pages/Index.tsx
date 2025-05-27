
import { useCalendario } from "@/contexts/CalendarioContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkArea from "@/components/WorkArea";

export default function Index() {
  const { createBoard } = useCalendario();

  const handleCreateBoard = () => {
    createBoard("Novo Quadro");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onCreateBoard={handleCreateBoard} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <WorkArea />
      </div>
    </div>
  );
}
