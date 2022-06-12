import React, { useEffect, useState, useContext } from "react";
import { getCompanyPeerMap } from "../../../api/getCompanyPeerMap";
import { VerticalBarChart } from "../../../components/d3/VerticalBarChart";
import { TypeCompany, TypePeerMaps } from "../../../types/Type";
import { getMaxNumberUnit } from "../../../utils/Number";
import { calcScore } from "../../../utils/Report";
import { TopicContext } from "../../../context/TopicContext";
import { PageLoading } from "../../../components/PageLoading";
import { getCompanyName } from "../../../utils/getCompanyName";

interface Props {
  company_id: string;
  company_name: string;
  companies: TypeCompany[] | [];
}

export const PeerComparisons: React.FC<Props> = ({
  company_id,
  company_name,
  companies,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanyPeerMap(company_id)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [company_id]);

  const { report_topic } = useContext(TopicContext);
  const peer_map = data ? (data as TypePeerMaps).data : [];
  const ticker_name = getCompanyName(company_id, companies);

  const chart_data = peer_map.length
    ? peer_map.map((d) => ({
        value: calcScore(d.signals_average),
        barColor: d.ticker_name !== ticker_name ? "#4e79a7" : "#f28e2b",
        bgColor: "transparent",
        label: d.ticker_name,
      }))
    : [];
  const max = getMaxNumberUnit(
    calcScore(
      peer_map.length
        ? peer_map.reduce((prev, current) => {
            if (prev.signals_average < current.signals_average) return current;
            return prev;
          }).signals_average
        : 0
    )
  );

  return loading ? (
    <PageLoading />
  ) : (
    // <span>loading...</span>
    <div className="my-3">
      <h2 className="subtitle">Peer Comparisons</h2>
      <div className="my-2">
        <VerticalBarChart
          width={100}
          height={160}
          max={max}
          data={chart_data}
          caption="ESG Score"
          sortable={true}
          refresh={report_topic !== ""}
        />
      </div>
    </div>
  );
};
