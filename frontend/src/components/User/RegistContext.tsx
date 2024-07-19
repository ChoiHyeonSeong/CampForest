import React, { createContext, useContext, useState } from 'react';

export type RegistForm = {
  userName: string;
  userBirthdate: Date | null;
  userGender: string;
  phoneNumber: string;
  userEmail: string;
  userPassword: string;
}

interface RegistContextType {
  formData: RegistForm;
  updateFormData: (data: Partial<RegistForm>) => void;
}

const RegistContext = createContext<RegistContextType | undefined>(undefined);

export const useRegistContext = () => {
  const context = useContext(RegistContext);
  if (!context) {
    throw new Error('useRegistContext must be used within a RegistProvider');
  }
  return context;
};

export const RegistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<RegistForm>({
    userName: "",
    userBirthdate: null,
    userGender: "",
    phoneNumber: "",
    userEmail: "",
    userPassword: ""
  });

  const updateFormData = (data: Partial<RegistForm>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <RegistContext.Provider value={{ formData, updateFormData }}>
      {children}
    </RegistContext.Provider>
  );
};