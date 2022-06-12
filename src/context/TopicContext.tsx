import React from "react";

interface ITopicContext {
  report_topic: string;
  setReportTopic?: (val: string) => void;
}

const defaultState = {
  report_topic: "",
};

export const TopicContext = React.createContext<ITopicContext>(defaultState);
