import React, { useEffect, useState, useContext } from "react";
import { getCompanyScores } from "../../../api/getCompanyScores";
import { PieChart } from "../../../components/d3/PieChart";
import { TopicContext } from "../../../context/TopicContext";
import { TypeCompanyScore, TypeCompanyScores } from "../../../types/Type";
import { calcScore } from "../../../utils/Report";
import { PageLoading } from "../../../components/PageLoading";

interface Props {
  company_id: string;
  topic: string;
}

export const Rating: React.FC<Props> = ({ company_id, topic }) => {
  const [data, setData] = useState<TypeCompanyScores | any>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanyScores(company_id, topic, "")
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      setData(null); // This worked for me
    };
  }, [company_id]);

  useEffect(() => {
    if (data) {
      setScore(Math.round(calcScore(data?.data[0]?.score)) / 100);
    }
  }, [data, company_id]);
  const { report_topic, setReportTopic } = useContext(TopicContext);

  return loading ? (
    <PageLoading />
  ) : (
    <div className="m-2">
      <PieChart
        prefix={`pie_${topic.toLowerCase()}`}
        label={topic}
        scale={score || 0}
        color={score < 0.5 ? "#e15759" : "#4e79a7"}
        type={topic}
        active_type={report_topic}
        setActiveType={setReportTopic}
      />
    </div>
  );
};
