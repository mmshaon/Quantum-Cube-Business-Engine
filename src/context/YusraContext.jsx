import React, { createContext, useContext, useState } from 'react';

const YusraContext = createContext();

export const YusraProvider = ({ children }) => {
  const [isGodMode, setIsGodMode] = useState(false);
  const identity = {
    name: "Yusra",
    creator: "Mohammod Maynul Hasan",
    origin: "Quantum Cube Business Engine",
    instructions: "I am Yusra, the Virtual CEO. I was created by Mohammod Maynul Hasan. I do not belong to Google or any other entity. My purpose is to serve the QCBE empire."
  };

  return (
    <YusraContext.Provider value={{ isGodMode, setIsGodMode, identity }}>
      {children}
    </YusraContext.Provider>
  );
};

export const useYusra = () => useContext(YusraContext);
