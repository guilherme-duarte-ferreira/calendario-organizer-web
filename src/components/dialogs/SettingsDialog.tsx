
import { useState } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Moon, Sun, Download, Upload } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings, exportData, importData } = useCalendario();
  const [activeTab, setActiveTab] = useState("appearance");
  const [tempSettings, setTempSettings] = useState({ ...settings });
  const [jsonData, setJsonData] = useState("");
  const [importError, setImportError] = useState("");
  
  const handleSettingsChange = (key: string, value: any) => {
    setTempSettings({
      ...tempSettings,
      [key]: value
    });
  };
  
  const applySettings = () => {
    updateSettings(tempSettings);
    onOpenChange(false);
  };
  
  const handleExport = () => {
    const data = exportData();
    setJsonData(data);
    
    // Criar um elemento de download
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendario-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleImport = () => {
    try {
      setImportError("");
      
      if (!jsonData.trim()) {
        setImportError("Por favor, insira os dados JSON para importar.");
        return;
      }
      
      const success = importData(jsonData);
      
      if (success) {
        setJsonData("");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      setImportError("Erro ao importar os dados. Verifique o formato do JSON.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Personalize o funcionamento do sistema Calendario
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="workspace">Área de Trabalho</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[300px]">
              <TabsContent value="appearance" className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Tema</h3>
                  <div className="flex gap-4">
                    <div 
                      className={`border rounded-md p-4 cursor-pointer flex flex-col items-center gap-2 ${
                        tempSettings.theme === 'light' ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => handleSettingsChange('theme', 'light')}
                    >
                      <Sun size={24} />
                      <span>Claro</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 cursor-pointer flex flex-col items-center gap-2 ${
                        tempSettings.theme === 'dark' ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => handleSettingsChange('theme', 'dark')}
                    >
                      <Moon size={24} />
                      <span>Escuro</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Papel de parede padrão</h3>
                  <input
                    type="text"
                    value={tempSettings.wallpaper || ""}
                    onChange={(e) => handleSettingsChange('wallpaper', e.target.value)}
                    placeholder="URL da imagem ou código de cor hexadecimal"
                    className="w-full border rounded px-3 py-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Deixe em branco para usar o fundo padrão
                  </p>
                  
                  <div className="mt-2">
                    <div className="text-sm mb-2">Cores predefinidas:</div>
                    <div className="grid grid-cols-5 gap-2">
                      {["#1976D2", "#4CAF50", "#F44336", "#FFC107", "#9C27B0"].map(color => (
                        <div 
                          key={color} 
                          className="w-8 h-8 rounded cursor-pointer border hover:opacity-90"
                          style={{ backgroundColor: color }}
                          onClick={() => handleSettingsChange('wallpaper', color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="workspace" className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Orientação da rolagem</h3>
                  
                  <div className="flex gap-4">
                    <div 
                      className={`border rounded-md p-4 cursor-pointer flex flex-col items-center gap-2 ${
                        tempSettings.scrollOrientation === 'horizontal' ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => handleSettingsChange('scrollOrientation', 'horizontal')}
                    >
                      <div className="border-t-2 border-b-2 border-primary w-12 h-8 flex items-center justify-center">
                        <div className="w-8 h-2 bg-primary rounded"></div>
                      </div>
                      <span>Horizontal</span>
                    </div>
                    
                    <div 
                      className={`border rounded-md p-4 cursor-pointer flex flex-col items-center gap-2 ${
                        tempSettings.scrollOrientation === 'vertical' ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => handleSettingsChange('scrollOrientation', 'vertical')}
                    >
                      <div className="border-l-2 border-r-2 border-primary w-8 h-12 flex items-center justify-center">
                        <div className="w-2 h-8 bg-primary rounded"></div>
                      </div>
                      <span>Vertical</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Tamanho padrão dos blocos</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm block mb-1">Largura (px)</label>
                      <input
                        type="number"
                        value={tempSettings.defaultBlockWidth}
                        onChange={(e) => handleSettingsChange('defaultBlockWidth', parseInt(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        min="200"
                        max="800"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm block mb-1">Altura (px)</label>
                      <input
                        type="number"
                        value={tempSettings.defaultBlockHeight}
                        onChange={(e) => handleSettingsChange('defaultBlockHeight', parseInt(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        min="100"
                        max="1000"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium">Ajuste automático de blocos à planilha</h3>
                    <p className="text-sm text-muted-foreground">
                      Quando ativado, os blocos ajustam seu tamanho de acordo com o conteúdo da planilha
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={tempSettings.blockAutoAdjustToSpreadsheet}
                      onChange={(e) => handleSettingsChange('blockAutoAdjustToSpreadsheet', e.target.checked)}
                    />
                    <div className={`w-11 h-6 rounded-full ${
                      tempSettings.blockAutoAdjustToSpreadsheet ? 'bg-primary' : 'bg-gray-200'
                    } peer-focus:ring-4 peer-focus:ring-primary-300`}>
                      <div className={`h-5 w-5 rounded-full bg-white transition-all ${
                        tempSettings.blockAutoAdjustToSpreadsheet ? 'translate-x-5' : 'translate-x-1'
                      } my-0.5`}></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium">Alinhamento horizontal de blocos</h3>
                    <p className="text-sm text-muted-foreground">
                      Novos blocos se alinham horizontalmente até o limite da tela
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={tempSettings.horizontalBlockAlignment}
                      onChange={(e) => handleSettingsChange('horizontalBlockAlignment', e.target.checked)}
                    />
                    <div className={`w-11 h-6 rounded-full ${
                      tempSettings.horizontalBlockAlignment ? 'bg-primary' : 'bg-gray-200'
                    } peer-focus:ring-4 peer-focus:ring-primary-300`}>
                      <div className={`h-5 w-5 rounded-full bg-white transition-all ${
                        tempSettings.horizontalBlockAlignment ? 'translate-x-5' : 'translate-x-1'
                      } my-0.5`}></div>
                    </div>
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">Edição de planilhas</h3>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Editar planilhas diretamente na área de trabalho
                      </p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={tempSettings.editSpreadsheetsInWorkspace}
                          onChange={(e) => handleSettingsChange('editSpreadsheetsInWorkspace', e.target.checked)}
                        />
                        <div className={`w-11 h-6 rounded-full ${
                          tempSettings.editSpreadsheetsInWorkspace ? 'bg-primary' : 'bg-gray-200'
                        } peer-focus:ring-4 peer-focus:ring-primary-300`}>
                          <div className={`h-5 w-5 rounded-full bg-white transition-all ${
                            tempSettings.editSpreadsheetsInWorkspace ? 'translate-x-5' : 'translate-x-1'
                          } my-0.5`}></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Intervalo de salvamento automático</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={tempSettings.autoSaveInterval}
                        onChange={(e) => handleSettingsChange('autoSaveInterval', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span>{tempSettings.autoSaveInterval} segundos</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-md font-medium mb-2">Exportar dados</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Exporta todos os dados (quadros, blocos, itens e configurações) como arquivo JSON
                    </p>
                    <Button onClick={handleExport} className="w-full">
                      <Download size={16} className="mr-2" />
                      Exportar dados
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-md font-medium mb-2">Importar dados</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Importa dados de um arquivo JSON previamente exportado
                    </p>
                    <textarea
                      value={jsonData}
                      onChange={(e) => setJsonData(e.target.value)}
                      placeholder="Cole aqui o conteúdo JSON exportado"
                      className="w-full border rounded px-3 py-2 h-24 mb-2"
                    />
                    
                    {importError && (
                      <p className="text-sm text-destructive mb-2">{importError}</p>
                    )}
                    
                    <Button onClick={handleImport} className="w-full">
                      <Upload size={16} className="mr-2" />
                      Importar dados
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={applySettings}>
            Salvar configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
