
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Bell, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onCreateBoard: () => void;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'reminder' | 'action';
  isRead: boolean;
  cardId?: string;
  createdAt: string;
}

export default function Header({ onCreateBoard }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Lembrete: Cartão vence em 1 dia",
      description: "Cartão 'Checklist' vence amanhã",
      type: "reminder",
      isRead: false,
      cardId: "card-1",
      createdAt: new Date().toISOString()
    },
    {
      id: "2", 
      title: "Cartão movido",
      description: "Cartão movido para bloco Concluído",
      type: "action",
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como lida
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Se tem cardId, abrir modal do cartão (implementar depois)
    if (notification.cardId) {
      console.log("Abrir modal do cartão:", notification.cardId);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={24} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">Calendário</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Pesquisar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-64"
            />
            <Button variant="ghost" size="icon">
              <Search size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter size={16} />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={16} />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notificações</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-3 cursor-pointer ${
                      !notification.isRead ? 'bg-red-50 border-l-2 border-l-red-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onCreateBoard} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Criar
          </Button>
        </div>
      </div>
    </header>
  );
}
