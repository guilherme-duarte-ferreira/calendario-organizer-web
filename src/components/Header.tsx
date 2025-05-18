
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Filter, Plus, Search, X } from "lucide-react";
import { useCalendario } from "@/contexts/CalendarioContext";

export default function Header() {
  const { createBoard } = useCalendario();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      setIsSearching(true);
      // Aqui você implementaria a lógica real de pesquisa
      // Por enquanto, apenas um resultado de exemplo
      setTimeout(() => {
        setSearchResults([
          { type: "board", id: "1", name: "Exemplo de resultado" }
        ]);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  
  const handleCreateBoard = () => {
    createBoard("Novo Quadro");
  };

  return (
    <header className="calendario-header">
      <div className="flex items-center gap-2 font-semibold text-lg mr-4">
        <Calendar size={24} className="text-primary" />
        <span>Calendário</span>
      </div>
      
      <Button
        onClick={handleCreateBoard}
        className="bg-primary hover:bg-primary/90 text-white mr-4"
      >
        <Plus size={20} className="mr-1" />
        Criar Quadro
      </Button>
      
      <div className="flex-1 flex relative">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-10 w-full"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Filter size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-medium">Filtros de pesquisa</h3>
              <div className="flex flex-col gap-2">
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Quadros
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Blocos
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Cartões
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Planilhas
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Dropdown de resultados */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full max-w-md mt-1 bg-white shadow-lg rounded-md z-20 border">
            <div className="p-2">
              <h4 className="text-sm text-muted-foreground mb-2">Resultados:</h4>
              {searchResults.map((result) => (
                <div key={result.id} className="p-2 hover:bg-secondary rounded cursor-pointer">
                  <div className="text-sm font-medium">{result.name}</div>
                  <div className="text-xs text-muted-foreground">{result.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isSearching && (
          <div className="absolute top-full left-0 w-full max-w-md mt-1 bg-white shadow-lg rounded-md z-20 border p-4 text-center">
            <span className="text-sm">Pesquisando...</span>
          </div>
        )}
      </div>
    </header>
  );
}
