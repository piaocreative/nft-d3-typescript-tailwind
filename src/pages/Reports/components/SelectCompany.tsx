import React, { useContext, useEffect } from "react";
import Select from "react-select";
import { useQuery } from "react-query";
import { getCompanies } from "../../../api/getCompanies";
import { CompanyContext } from "../../../context/CompanyContext";
import { LoadingContext } from "../../../context/LoadingContext";
import { TypeCompany } from "../../../types/Type";
import { useNavigate } from "react-router-dom";

interface Props {
  companies: TypeCompany[] | [];
  setCompanies: (value: TypeCompany[] | []) => void;
}

interface SelectedOption {
  value: string;
  label: string;
}

export const SelectCompany: React.FC<Props> = ({ companies, setCompanies }) => {
  const { isLoading, error, data } = useQuery<any, Error>(["companies"], () =>
    getCompanies("public", true)
  );

  const { setLoading } = useContext(LoadingContext);
  const { setCompanyId, setCompanyName } = useContext(CompanyContext);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading && setLoading(isLoading);
  }, [isLoading, setLoading]);

  // const companies = data?.data ? (data.data as TypeCompany[]) : [];
  useEffect(() => {
    setCompanies(data?.data ? (data.data as TypeCompany[]) : []);
  }, [data]);

  if (isLoading || error) {
    return <></>;
  }
  const changeCompany = (value: SelectedOption) => {
    navigate("/" + value.value);
    setCompanyId && setCompanyId(value.value);
    setCompanyName && setCompanyName(value.label);
  };

  return (
    <div className="flex text-sm mx-auto md:w-1/2">
      <label
        htmlFor="company"
        className="flex-none self-center dark:text-white mr-2"
      >
        Search
      </label>
      <Select
        className="flex-auto
          rounded transition ease-in-out m-0 dark:bg-gray-600 dark:border-gray-500"
        defaultValue={null}
        onChange={(value) => changeCompany(value!)}
        options={companies
          .map((company) => ({
            value: company.ticker_id,
            label: company.ticker_name,
          }))
          .sort((a, b) => (a.label > b.label ? 1 : -1))}
      ></Select>
    </div>
  );
};
