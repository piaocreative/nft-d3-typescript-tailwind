import React from "react";

interface ICompanyContext {
  company_id: string;
  company_name: string;
  setCompanyId?: (val: string) => void;
  setCompanyName?: (val: string) => void;
}

const defaultState = {
  company_id: "",
  company_name: "",
};

export const CompanyContext =
  React.createContext<ICompanyContext>(defaultState);
