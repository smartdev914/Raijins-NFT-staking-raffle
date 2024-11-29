import cx from "classnames";
import React, { useState } from "react";
import Description from "../Description";
import RaijinsSelect from "../RaijinsSelect";
import RoundButton from "../RoundButton";
import SectionTitle from "../SectionTitle";
import Arrow1Img from "assets/images/common/Arrow1.png";
import RaijinsTicketImg from "assets/images/common/RaijinsTicket.png";
import { REWARD_AMOUNTS } from "config/staking";

const calculatorOptions = [
  {
    key: "raijins nft type",
    options: [
      {
        value: 0,
        text: "raijins",
      },
    ],
  },
  {
    key: "staking duration",
    options: [
      {
        value: 0,
        text: "7-day",
      },
      {
        value: 1,
        text: "30-day",
      },
      {
        value: 2,
        text: "60-day",
      },
      {
        value: 3,
        text: "90-day",
      },
    ],
  },
  // {
  //   key: "reward boost",
  //   options: [
  //     {
  //       value: "yes",
  //       text: "yes",
  //     },
  //     {
  //       value: "no",
  //       text: "no",
  //     },
  //   ],
  // },
];

const RewardCalculator = ({ isMobile }) => {
  const [calculatorValue, setCalculatorValue] = useState(0);
  const [rarity, setRarity] = useState(0);
  const [timeType, setTimeType] = useState(0);

  const handleCalculate = () => {
    setCalculatorValue(REWARD_AMOUNTS[rarity][timeType]);
  };

  const handleRarity = (rarity) => {
    setRarity(rarity);
  };

  const handleTimeType = (timeType) => {
    setTimeType(timeType);
  };

  return (
    <div className={cx("reward-calculator", "mb-7")}>
      <SectionTitle classes="mb-3">
        staking reward <span>calculator</span>
      </SectionTitle>
      <Description classes={cx("text-center", "mb-5")}>
        Please use the below tool to estimate the amount of Raijins Tickets awarded
        based on your staking criteria
      </Description>
      <div
        className={cx(
          "d-flex",
          "justify-between",
          "gap-1",
          "mb-5",
          isMobile ? "flex-column" : "flex-row"
        )}
      >
        {calculatorOptions.map((options, index) => (
          <RaijinsSelect
            key={options.key}
            options={options.options}
            handleChange={
              index === 0
                ? (e) => handleRarity(e.target.value)
                : (e) => handleTimeType(e.target.value)
            }
          />
        ))}
      </div>
      <div className={cx("text-center", "mb-6")}>
        <RoundButton
          variant="primary"
          text="calculate rewards"
          onBtnClick={handleCalculate}
        />
      </div>
      <div className={cx("result-container", "mb-3")}>
        <img src={Arrow1Img} alt="arrow.png" />
        <div className={cx("result")}>{calculatorValue}</div>
        <img src={Arrow1Img} alt="arrow.png" />
      </div>
      <div className="raijins-tickets-container">
        <h5 className="title">raijins tickets</h5>
        <img src={RaijinsTicketImg} alt="raijins-ticket.png" />
      </div>
    </div>
  );
};

export default RewardCalculator;
