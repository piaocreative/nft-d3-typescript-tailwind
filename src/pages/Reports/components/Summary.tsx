import React, { useState, useContext, useEffect, useRef } from "react";

import { CompanyContext } from "../../../context/CompanyContext";
import { getCompanyDataPoints } from "../../../api/getCompanyDataPoints";
import { getCompanyKeyInformation } from "../../../api/getCompanyKeyInformation";
import { DataPoints } from "../../../components/d3/DataPoints";
import { TypeCompany, TypeKeyInformation } from "../../../types/Type";
import { TypeDataDpData } from "../../../types/Type";
import { PageLoading } from "../../../components/PageLoading";
import _ from "lodash";
import { getCompanyName } from "../../../utils/getCompanyName";

interface Props {
  companies: TypeCompany[] | [];
}

export const Summary: React.FC<Props> = ({ companies }) => {
  const { company_id, company_name } = useContext(CompanyContext);
  const [dataKeyInfo, setDataKeyInfo] = useState<TypeKeyInformation | null>();
  const [dataDp, setDataDp] = useState<TypeDataDpData[] | null>();
  const [loadingKey, setLoadingKey] = useState(true);
  const [loadingPoint, setLoadingPoint] = useState(true);

  useEffect(() => {
    setLoadingKey(true);
    setLoadingPoint(true);
    getCompanyKeyInformation(company_id)
      .then((response) => {
        const res: TypeKeyInformation = response.data.data[0];
        setDataKeyInfo(res);
      })
      .finally(() => {
        setLoadingKey(false);
      });

    getCompanyDataPoints(company_id)
      .then((response) => {
        const res = response.data.data[0];
        const res1 = [
          {
            topic: "Environmental",
            value_type: "-",
            value: res.negative?.environmental || 0,
            id: "Environmental-" + res.negative?.environmental,
          },
          {
            topic: "Environmental",
            value_type: "+",
            value: res.positive?.environmental || 0,
            id: "Environmental+" + res.positive?.environmental,
          },
          {
            topic: "Governance",
            value_type: "-",
            value: res.negative?.governance || 0,
            id: "Governance-" + res.negative?.governance,
          },
          {
            topic: "Governance",
            value_type: "+",
            value: res.positive?.governance || 0,
            id: "Governance+" + res.positive?.governance,
          },
          {
            topic: "Social",
            value_type: "-",
            value: res.negative?.social || 0,
            id: "Social-" + res.negative?.social,
          },
          {
            topic: "Social",
            value_type: "+",
            value: res.positive?.social || 0,
            id: "Social+" + res.positive?.social,
          },
        ];
        setDataDp(res1);
      })
      .finally(() => {
        setLoadingPoint(false);
      });
  }, [company_id]);

  return loadingKey || loadingPoint ? (
    <PageLoading />
  ) : (
    <div className="my-3 dark:text-gray-300">
      <h2 className="text-xl leading-10 hover:shadow hover:border hover:border-black hover:border-solid">
        {getCompanyName(company_id, companies)}
      </h2>
      <div>
        <div className="text-xs mt-4 mb-3">Sector</div>
        <div className="text-xl leading-8 hover:shadow hover:border hover:border-black hover:border-solid">
          {dataKeyInfo?.industry}
        </div>
        <div className="text-xs mt-4 mb-3">Market Cap</div>
        <div className="text-xl leading-8 hover:shadow hover:border hover:border-black hover:border-solid">
          {dataKeyInfo?.market_cap}
        </div>
        <div className="text-xs mt-4 mb-3">Investors</div>
        <div className="text-xl leading-8 hover:shadow hover:border hover:border-black hover:border-solid">
          {dataKeyInfo?.institutional_investors}
        </div>
      </div>
      {!_.isEmpty(dataDp) ? (
        <div>
          <DataPoints data={dataDp} width={100} height={80}></DataPoints>
        </div>
      ) : (
        <div className="h-20">
          <h2 className="subtitle mt-4 mb-2">Data Points</h2>
        </div>
      )}
      <div>
        <h3 className="my-5">Disclosures Scores</h3>
        <div className="text-xs my-4">CSR Liink</div>
        <div className="text-xl leading-8 h-8 hover:shadow hover:border hover:border-black hover:border-solid overflow-hidden">
          <a
            href={dataKeyInfo?.sustainability_report}
            target="_blank"
            className="break-all"
          >
            {dataKeyInfo?.sustainability_report || "null"}
          </a>
        </div>
        <div className="text-xs mt-3 mb-5">Disclosure Score</div>
        <div className="text-xl leading-8 hover:shadow hover:border hover:border-black hover:border-solid">
          {dataKeyInfo?.disclosure_score || "0"}
        </div>
        <div className="text-xs mt-3 mb-5">Carbon Emissions(mt)</div>
        <div className="text-xl leading-8 hover:shadow hover:border hover:border-black hover:border-solid">
          {dataKeyInfo?.latest_emissions || "null"}
        </div>
        <div className="text-xs mt-3 mb-5">Charity Supported</div>
        <div className="text-xl leading-8 hover:shadow hover:border hover:border-black hover:border-solid">
          {dataKeyInfo?.charities_supported || "0"}
        </div>
      </div>
    </div>
  );
};
