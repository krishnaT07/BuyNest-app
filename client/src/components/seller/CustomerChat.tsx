import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, User, Search } from "lucide-react";

// Mock chat data - in real app, fetch from backend
const mockChats = [
  {
    id: "1",
    customerName: "John Doe",
    customerId: "customer-1",
    lastMessage: "Is this product available?",
    timestamp: "2 min ago",
    unread: 2,
    isAdmin: false
  },
  {
    id: "2",
    customerName: "Jane Smith",
    customerId: "customer-2",
    lastMessage: "Thank you for the quick delivery!",
    timestamp: "1 hour ago",
    unread: 0,
    isAdmin: false
  },
  {
    id: "3",
    customerName: "Admin Support",
    customerId: "admin-1",
    lastMessage: "Please update your shop hours",
    timestamp: "3 hours ago",
    unread: 1,
    isAdmin: true
  }
];

export const CustomerChat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = mockChats.filter(chat =>
    chat.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);

  const mockMessages = selectedChat ? [
    {
      id: "1",
      sender: "customer",
      text: "Hi, is this product available?",
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      sender: "seller",
      text: "Yes, it's in stock! Would you like to order?",
      timestamp: "10:32 AM"
    },
    {
      id: "3",
      sender: "customer",
      text: "Great! I'll order 2 units.",
      timestamp: "10:35 AM"
    }
  ] : [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, send message to backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Chat List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[450px]">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 border-b border-border hover:bg-muted/50 transition-colors text-left ${
                    selectedChat === chat.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {chat.isAdmin ? "A" : chat.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {chat.customerName}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {chat.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2">
        {selectedChat ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedChatData?.isAdmin ? "A" : selectedChatData?.customerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedChatData?.customerName}</CardTitle>
                  <CardDescription>
                    {selectedChatData?.isAdmin ? "Admin Support" : "Customer"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[480px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender === "seller"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === "seller" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
