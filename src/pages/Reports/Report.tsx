import React from "react";
import { PeerComparisons } from "./components/PeerComparisons";
import { NewsSentiment } from "./components/NewsSentiment";
import { Ratings } from "./components/Ratings";
import { UNGoals } from "./components/UNGoals";
import { Summary } from "./components/Summary";
import { SectorMap } from "./components/SectorMap";
import { TopicScores } from "./components/TopicScores";
import { NewsOrder } from "./components/NewsOrder";
import { TypeCompany } from "../../types/Type";

interface Props {
  company_id: string;
  company_name: string;
  companies: TypeCompany[] | [];
}

export const Report: React.FC<Props> = ({
  company_id,
  company_name,
  companies,
}) => {
  return (
    <>
      <div className="md:flex gap-4 mt-3">
        <div className="basis-1/3 lg:basis-1/5">
          <Summary companies={companies} />
        </div>
        <div className="basis-2/3 lg:basis-4/5">
          <div className="lg:flex gap-12">
            <div className="basis-1/3">
              <PeerComparisons
                company_id={company_id}
                company_name={company_name}
                companies={companies}
              />
            </div>
            <div className="basis-2/3">
              <NewsSentiment company_id={company_id} />
            </div>
          </div>
          <div className="lg:flex gap-4">
            <div className="basis-3/4">
              <Ratings company_id={company_id} />
            </div>
            <div className="basis-1/4">
              <UNGoals company_id={company_id} />
            </div>
          </div>
          <div className="lg:flex gap-4">
            <div className="basis-2/3">
              <SectorMap companies={companies} />
            </div>
            <div className="basis-1/3">
              <TopicScores
                company_id={company_id}
                company_name={company_name}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <NewsOrder></NewsOrder>
      </div>
    </>
  );
};
