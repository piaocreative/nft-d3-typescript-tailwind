import React, { useEffect, useContext, useState, useRef } from "react";
import { ScatterPlot } from "../../../components/d3/ScatterPlot";
import { CompanyContext } from "../../../context/CompanyContext";
import { getCompanyPeerMap } from "../../../api/getCompanyPeerMap";
import { TypePeerMap } from "../../../types/Type";
import { PageLoading } from "../../../components/PageLoading";
import { TypeCompany } from "../../../types/Type";

interface Props {
  companies: TypeCompany[] | [];
}
export const SectorMap: React.FC<Props> = ({ companies }) => {
  const { company_id } = useContext(CompanyContext);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [data, setData] = useState<TypePeerMap[]>([]);

  useEffect(() => {
    setLoading(true);
    getCompanyPeerMap(company_id)
      .then((response) => {
        setData(response.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [company_id]);

  const getListSize = () => {
    const newWidth = ref.current?.clientWidth || 0;
    setWidth(newWidth);
  };

  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 0);
    window.addEventListener("resize", getListSize);
  }, []);

  return (
    <div className="my-3 relative" ref={ref}>
      <h2 className="subtitle">Sector Map</h2>
      {loading ? (
        <PageLoading />
      ) : (
        data.length && (
          <ScatterPlot
            wrap_width={width}
            data={data}
            companies={companies}
          ></ScatterPlot>
        )
      )}
    </div>
  );
};
