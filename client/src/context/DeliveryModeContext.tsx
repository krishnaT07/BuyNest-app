import { createContext, useContext, useState, ReactNode } from "react";

type DeliveryMode = "pickup" | "delivery";

interface DeliveryModeContextType {
  deliveryMode: DeliveryMode;
  setDeliveryMode: (mode: DeliveryMode) => void;
}

const DeliveryModeContext = createContext<DeliveryModeContextType | undefined>(undefined);

export const useDeliveryMode = () => {
  const context = useContext(DeliveryModeContext);
  if (context === undefined) {
    throw new Error("useDeliveryMode must be used within a DeliveryModeProvider");
  }
  return context;
};

interface DeliveryModeProviderProps {
  children: ReactNode;
}

export const DeliveryModeProvider = ({ children }: DeliveryModeProviderProps) => {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");

  return (
    <DeliveryModeContext.Provider value={{ deliveryMode, setDeliveryMode }}>
      {children}
    </DeliveryModeContext.Provider>
  );
};