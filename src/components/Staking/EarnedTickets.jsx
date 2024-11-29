import { useState } from "react";
import cx from "classnames";
import SectionTitle from "../SectionTitle";
import RaijinsModal from "components/RaijinsModal";
// import RaijinsTicketImg from "assets/images/common/RaijinsTicket.png";
// import Normal1smImg from "assets/images/nfts/Normal1sm.jpg";
// import Normal2smImg from "assets/images/nfts/Normal2sm.jpg";
// import Normal3smImg from "assets/images/nfts/Normal3sm.jpg";
// import Normal4smImg from "assets/images/nfts/Normal4sm.jpg";
// import Normal5smImg from "assets/images/nfts/Normal5sm.jpg";
// import Normal6smImg from "assets/images/nfts/Normal6sm.jpg";
// import Normal7smImg from "assets/images/nfts/Normal7sm.jpg";

// import Deepblack1smImg from "assets/images/nfts/Deepblack1sm.jpg";
// import Deepblack2smImg from "assets/images/nfts/Deepblack2sm.jpg";
// import Deepblack3smImg from "assets/images/nfts/Deepblack3sm.jpg";
// import Deepblack4smImg from "assets/images/nfts/Deepblack4sm.jpg";
// import Deepblack5smImg from "assets/images/nfts/Deepblack5sm.jpg";
// import Deepblack6smImg from "assets/images/nfts/Deepblack6sm.jpg";
// import Deepblack7smImg from "assets/images/nfts/Deepblack7sm.jpg";

// import Jade1smImg from "assets/images/nfts/Jade1sm.jpg";
// import Jade2smImg from "assets/images/nfts/Jade2sm.jpg";
// import Jade3smImg from "assets/images/nfts/Jade3sm.jpg";
// import Jade4smImg from "assets/images/nfts/Jade4sm.jpg";
// import Jade5smImg from "assets/images/nfts/Jade5sm.jpg";
// import Jade6smImg from "assets/images/nfts/Jade6sm.jpg";
// import Jade7smImg from "assets/images/nfts/Jade7sm.jpg";

// import Ghost1smImg from "assets/images/nfts/Ghost1sm.jpg";
// import Ghost2smImg from "assets/images/nfts/Ghost2sm.jpg";
// import Ghost3smImg from "assets/images/nfts/Ghost3sm.jpg";
// import Ghost4smImg from "assets/images/nfts/Ghost4sm.jpg";
// import Ghost5smImg from "assets/images/nfts/Ghost5sm.jpg";
// import Ghost6smImg from "assets/images/nfts/Ghost6sm.jpg";
// import Ghost7smImg from "assets/images/nfts/Ghost7sm.jpg";

import Avatar0Img from "assets/images/nfts/Avatar0.png";
import Avatar1Img from "assets/images/nfts/Avatar1.png";
import Avatar2Img from "assets/images/nfts/Avatar2.png";
import Avatar3Img from "assets/images/nfts/Avatar3.png";
import Avatar4Img from "assets/images/nfts/Avatar4.png";
import Avatar5Img from "assets/images/nfts/Avatar5.png";
import EarnedTicketCard from "./EarnedTicketCard";

// ================================================

const tableData = [
  {
    label: "raijins",
    type: "raijins",
    images: [
      Avatar0Img,
      Avatar1Img,
      Avatar2Img, 
      Avatar3Img, 
      Avatar4Img, 
      Avatar5Img
    ],
    day7: 5,
    day30: 21,
    day60: 43,
    day90: 70,
    reward: 15,
  },
];

// ================================================

const EarnedTickets = ({ isMobile }) => {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const onNFTImgClick = (image) => {
    return;
    // setModalImg(image);
    // setOpenImgModal(true);
  };

  const onCloseModal = () => {
    setModalImg(null);
    setOpenImgModal(false);
  };

  return (
    <div className={cx("earned-tickets")}>
      <SectionTitle classes="mb-3">
        {/* # <img src={RaijinsTicketImg} alt="raijins-ticket.png" width="70px" /> earned{" "}
        <span>per staking period</span> */}
        <span>Earned Per Staking Period</span>
      </SectionTitle>
      {isMobile ? (
        tableData.map((datum) => (
          <EarnedTicketCard
            key={datum.type}
            data={datum}
            onNFTImgClick={onNFTImgClick}
          />
        ))
      ) : (
        <table className={cx("earned-tickets-table")}>
          <thead>
            <tr>
              <th rowSpan={2}>#</th>
              <th rowSpan={2} className={cx("image-cell")}>
                nft type
              </th>
              {/* <th colSpan={4} className={cx("text-right")}>
                staking length
              </th> */}
              {/* <th rowSpan={2} className={cx("underline")}>
              staking <br />
              reward boost
            </th> */}
            </tr>
            <tr>
              <th>7 - day</th>
              <th>30 - day</th>
              <th>60 - day</th>
              <th>90 - day</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => {
              return (
                <tr key={row.type}>
                  <th className={cx("nft-type text-right")}>{row.label}</th>
                  <td className={cx("d-flex", "justify-between", "image-cell")}>
                    {row.images.map((image, idx) => {
                      return (
                        <img
                          src={image}
                          alt={`image-${row.type}${idx}.jpg`}
                          key={idx}
                          onClick={() => onNFTImgClick(image)}
                          className={cx("nft-image")}
                        />
                      );
                    })}
                  </td>
                  <td>
                    {row.day7}
                    <br />
                    ticket{row.day7 === 1 ? "" : "s"}
                  </td>
                  <td>
                    {row.day30}
                    <br />
                    ticket{row.day30 === 1 ? "" : "s"}
                  </td>
                  <td>
                    {row.day60}
                    <br />
                    ticket{row.day60 === 1 ? "" : "s"}
                  </td>
                  <td>
                    {row.day90}
                    <br />
                    ticket{row.day90 === 1 ? "" : "s"}
                  </td>
                  {/* <td>
                  {row.reward}
                  <br />
                  boost
                </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <RaijinsModal
        open={openImgModal}
        onCloseModal={onCloseModal}
        classes={`p-0 ${isMobile ? "w-90" : "w-30"}`}
      >
        <img src={modalImg} width="100%" />
      </RaijinsModal>
    </div>
  );
};

export default EarnedTickets;
