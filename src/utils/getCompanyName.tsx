import { TypeCompany } from "../types/Type";

export const getCompanyName = (
  company_id: string,
  companies: TypeCompany[]
) => {
  var ticker_name = "";

  for (let i = 0; i < companies.length; i++) {
    if (companies[i].ticker_id === company_id.replace("%20", " ")) {
      ticker_name = companies[i].ticker_name;
      break;
    }
  }
  return ticker_name;
};
