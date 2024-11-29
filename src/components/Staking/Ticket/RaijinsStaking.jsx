import { useWeb3React } from "@web3-react/core";
import cx from "classnames";
import useSWR from "swr";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import SectionTitle from "../../SectionTitle";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import TableDecoImg from "assets/images/staking/tableDeco.png";
import CircularArrowImg from "assets/images/common/Arrow.png";
import XImage from "assets/images/common/XLight.png";
import RoundButton from "../../RoundButton";
import { getContract } from "config/contracts";
import { RAIJINS_NFTS, REWARD_AMOUNTS, VOLUME1_METADATA, COLLECTION_OPTIONS } from "config/staking";
import { callContract, contractFetcher } from "lib/contracts";
import { useChainId } from "lib/chains";
import { approveNFT } from "lib/approveNFT";
import StakingRaijins from "abis/StakingRaijins.json";
// import Raijins from "abis/Raijins.json";
import RaijinsStakingCard from "./RaijinsStakingCard";
import RaijinsStakedCard from "./RaijinsStakedCard";
// import Combobox from '../Combobox/Combobox';
import {
  formatAmount,
} from "lib/numbers";

const timeTypeInfo = [
  {
    label: "7-day",
    id: "seven",
    period: 7,
  },
  {
    label: "30-day",
    id: "thirty",
    period: 30,
  },
  {
    label: "60-day",
    id: "sixty",
    period: 60,
  },
  {
    label: "90-day",
    id: "ninety",
    period: 90,
  },
];

const getRarity = (collection, tokenId) => {
  // add code

  return 0;
};

const loadWalletNFTs = (dataWallet, timeType) => {
  if (dataWallet === undefined) return [];

  if (dataWallet.length === 0) return [];

  const ret = dataWallet.map((item) => {
    let index = -1;

    for (let i = 0; i < RAIJINS_NFTS.length; i++) {
      if (
        RAIJINS_NFTS[i].address.toLowerCase() === item.token_address.toLowerCase()
      ) {
        index = i;
        break;
      }
    }

    if (index === -1) return null;

    const nftInfo = RAIJINS_NFTS[index];
    let imageURL = "";
    if (nftInfo.name === "LIFE OF HEL - Volume 1")
      imageURL = `${nftInfo.imageHash}${VOLUME1_METADATA[Number(item.token_id.toString()) - 1]
        }.${nftInfo.imageType}`;
    else
      imageURL = `${nftInfo.imageHash}${Number(item.token_id.toString())}.${nftInfo.imageType
        }`;

    const rarity = getRarity(nftInfo.address, item.token_id.toString());
    const rewards = REWARD_AMOUNTS[rarity][timeType];
    return {
      id: item.token_id.toString(),
      name: item.name,
      address: nftInfo.address,
      image: imageURL,
      rewards: rewards,
    };
  });

  const finalArray = ret.filter((item) => item !== null);
  return finalArray;
};

const loadStakedNFTs = (dataContract) => {
  if (dataContract === undefined) return [];

  if (dataContract.length === 0) return [];

  const ret = dataContract.map((item) => {
    let index = -1;

    for (let i = 0; i < RAIJINS_NFTS.length; i++) {
      if (RAIJINS_NFTS[i].address.toLowerCase() === item[0].toLowerCase()) {
        index = i;
        break;
      }
    }

    if (index === -1) return null;

    const nftInfo = RAIJINS_NFTS[index];
    const tokenId = parseInt(item[1].toString());
    const timeType = parseInt(item[2].toString());
    const startTime = parseInt(item[3].toString());
    const autoRestake = item[4];
    const isClaimed = item[5];
    const pendingTicket = parseInt(formatAmount(item[6], 18, 0));

    const rarity = getRarity(nftInfo.address, tokenId);
    const endTime = startTime + timeTypeInfo[timeType].period * 24 * 3600;
    const currentTime = new Date().getTime() / 1000;
    let leftTime = 0;
    let nextTicket = 0;

    if (!autoRestake) {
      if (isClaimed || currentTime > endTime) {
        leftTime = 0;
        nextTicket = 0;
      } else {
        leftTime = endTime - currentTime;
        nextTicket = REWARD_AMOUNTS[rarity][timeType];
      }
    } else {
      leftTime =
        (timeTypeInfo[timeType].period * 24 * 3600) - ((currentTime - startTime) % (timeTypeInfo[timeType].period * 24 * 3600));
      nextTicket = REWARD_AMOUNTS[rarity][timeType];
    }

    let imageURL = "";
    if (nftInfo.name === "LIFE OF HEL - Volume 1")
      imageURL = `${nftInfo.imageHash}${VOLUME1_METADATA[Number(item[1].toString()) - 1]
        }.${nftInfo.imageType}`;
    else
      imageURL = `${nftInfo.imageHash}${Number(item[1].toString())}.${nftInfo.imageType
        }`;

    return {
      name: nftInfo.name,
      image: imageURL,
      address: nftInfo.address,
      id: tokenId,
      timeType: timeType,
      leftTime: parseInt(leftTime / (24 * 3600)) + 1,
      autoRestake: autoRestake,
      nextTicket: nextTicket,
      claimableTicket: pendingTicket,
    };
  });

  const finalArray = ret.filter((item) => item !== null);
  return finalArray;
};

let walletNFTSelection = [];
let stakedNFTSelection = [];

const RaijinsStaking = ({ isMobile }) => {
  const { active, library, account } = useWeb3React();

  const [currentTimeType, setCurrentTimeType] = useState(0);
  const [disabledClaimBtn, setDisabledClaimBtn] = useState(true);
  const [disabledUnStakeBtn, setDisabledUnStakeBtn] = useState(true);
  // const [disabledAddRestakeBtn, setDisabledAddRestakeBtn] = useState(true);
  // const [disabledCancelRestakeBtn, setDisabledCancelRestakeBtn] = useState(true);
  const [selectStatusInWallet, setSelectStatusInWallet] = useState([]);
  const [selectStatusStaked, setSelectStatusStaked] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCollection/*, setSelectedCollection */] = useState(COLLECTION_OPTIONS[0]);

  // const regInputForCollectionId = React.useRef();

  const { chainId } = useChainId();
  const stakingRaijinsAddress = getContract(chainId, "StakingRaijins");

  // const { data: dataMoralis } = useSWR(
  //   [account],
  //   { fetcher: moralisFetcher(account), }
  // );
  const nftAddresses = RAIJINS_NFTS.map((item) => item.address);
  //////////Reading Wallet///////////////////////////////////////////////////////////////////////////////////////////////////
  const { data: dataWallet } = useSWR(
    active &&
    stakingRaijinsAddress && [
      active,
      chainId,
      stakingRaijinsAddress,
      "getTokensInWallet",
      nftAddresses,
      account
    ],
    { fetcher: contractFetcher(library, StakingRaijins) }
  );
  const filteredDataWallet = dataWallet ? dataWallet.filter((item) => item.token_address.toLowerCase() === selectedCollection.address.toLowerCase()) : [];
  let nftsInWallet = loadWalletNFTs(filteredDataWallet, currentTimeType);
  //////////Reading Staking Contract////////////////////////////////////////////////////////////////////////////////////////////////////
  const { data: dataContract } = useSWR(
    active &&
    stakingRaijinsAddress && [
      active,
      chainId,
      stakingRaijinsAddress,
      "getStakingInfo",
      nftAddresses,
      account,
    ],
    { fetcher: contractFetcher(library, StakingRaijins) }
  );
  const filteredDataContract = dataContract ? dataContract.filter((item) => item._address.toLowerCase() === selectedCollection.address.toLowerCase()) : [];
  const nftsStaked = loadStakedNFTs(filteredDataContract);

  /////////Approval Status/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const { data: collectionApprovals } = useSWR(
    active &&
    stakingRaijinsAddress && [
      active,
      chainId,
      stakingRaijinsAddress,
      "getApprovalStatus",
      nftAddresses,
      account,
    ],
    { fetcher: contractFetcher(library, StakingRaijins) }
  );

  let needApproval = true;
  if (collectionApprovals) {
    const filteredCollectionApprovals = collectionApprovals ? collectionApprovals.filter((item) => item.token_address.toLowerCase() === selectedCollection.address.toLowerCase()) : [];
    needApproval = !filteredCollectionApprovals[0].isApproval;
  }

  const [disabledStakeBtn, setDisabledStakeBtn] = useState(!needApproval);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSelectNFTInWallet = (index) => {
    const itemInfo = nftsInWallet[index];

    const selectedItem = walletNFTSelection.find(
      (item) =>
        item.id === itemInfo.id &&
        item.address === itemInfo.address.toLowerCase()
    );
    if (selectedItem === undefined)
      walletNFTSelection.push({
        id: itemInfo.id,
        address: itemInfo.address.toLowerCase(),
      });
    else
      walletNFTSelection = walletNFTSelection.filter(
        (item) => item !== selectedItem
      );

    let items = [];
    for (let i = 0; i < nftsInWallet.length; i++) {
      const itemInfo = nftsInWallet[i];
      const currentItem = walletNFTSelection.find(
        (item) =>
          item.id === itemInfo.id &&
          item.address === itemInfo.address.toLowerCase()
      );
      if (currentItem === undefined) items.push(false);
      else items.push(true);
    }
    setSelectStatusInWallet(items);

    if (walletNFTSelection.length === 0 && !needApproval)
      setDisabledStakeBtn(true);
    else setDisabledStakeBtn(false);
  };

  const handleSelectNFTStaked = (index) => {
    const itemInfo = nftsStaked[index];

    const selectedItem = stakedNFTSelection.find(
      (item) =>
        item.id === itemInfo.id &&
        item.address === itemInfo.address.toLowerCase()
    );
    if (selectedItem === undefined)
      stakedNFTSelection.push({
        id: itemInfo.id,
        address: itemInfo.address.toLowerCase(),
      });
    else
      stakedNFTSelection = stakedNFTSelection.filter(
        (item) => item !== selectedItem
      );

    let items = [];
    for (let i = 0; i < nftsStaked.length; i++) {
      const itemInfo = nftsStaked[i];
      const currentItem = stakedNFTSelection.find(
        (item) =>
          item.id === itemInfo.id &&
          item.address === itemInfo.address.toLowerCase()
      );
      if (currentItem === undefined) items.push(false);
      else items.push(true);
    }
    setSelectStatusStaked(items);

    if (stakedNFTSelection.length === 0) {
      setDisabledClaimBtn(true);
      setDisabledUnStakeBtn(true);
      // setDisabledAddRestakeBtn(true);
      // setDisabledCancelRestakeBtn(true);
    } else {
      setDisabledClaimBtn(false);
      setDisabledUnStakeBtn(false);
      // setDisabledAddRestakeBtn(false);
      // setDisabledCancelRestakeBtn(false);
    }
  };

  const handleSelectAllInWallet = () => {
    let items = [];
    walletNFTSelection = [];
    for (let i = 0; i < nftsInWallet.length; i++) {
      const itemInfo = nftsInWallet[i];
      walletNFTSelection.push({
        id: itemInfo.id,
        address: itemInfo.address.toLowerCase(),
      });
      items.push(true);
    }
    setSelectStatusInWallet(items);

    setDisabledStakeBtn(false);
  };

  const handleUnselectAllInWallet = () => {
    let items = [];
    walletNFTSelection = [];
    setSelectStatusInWallet(items);
    setDisabledStakeBtn(true);
  };

  const handleSelectAllStaked = () => {
    let items = [];
    stakedNFTSelection = [];
    for (let i = 0; i < nftsStaked.length; i++) {
      const itemInfo = nftsStaked[i];
      stakedNFTSelection.push({
        id: itemInfo.id,
        address: itemInfo.address.toLowerCase(),
      });
      items.push(true);
    }
    setSelectStatusStaked(items);

    setDisabledClaimBtn(false);
    setDisabledUnStakeBtn(false);
    // setDisabledAddRestakeBtn(false);
    // setDisabledCancelRestakeBtn(false);
  };

  const handleUnselectAllStaked = () => {
    let items = [];
    stakedNFTSelection = [];
    setSelectStatusStaked(items);

    setDisabledClaimBtn(true);
    setDisabledUnStakeBtn(true);
    // setDisabledAddRestakeBtn(true);
    // setDisabledCancelRestakeBtn(true);
  };

  const handleTimeType = (index) => {
    setCurrentTimeType(index);
  };

  const approveFromNFT = () => {
    if (needApproval) {
      approveNFT({
        setIsApproving,
        library,
        tokenAddress: selectedCollection.address,
        spender: stakingRaijinsAddress,
        chainId: chainId,
        onApproveSubmitted: () => {
          setIsWaitingForApproval(true);
        },
      });

      return;
    }
  };

  const handleStake = () => {
    if (needApproval) {
      approveFromNFT();
      return;
    }

    setIsSubmitting(true);

    const nftToStake = walletNFTSelection.map((item) => {
      return item.address;
    });

    const tokenId = walletNFTSelection.map((item) => {
      return item.id;
    });

    const timeType = tokenId.map((item) => {
      return currentTimeType;
    });

    const contract = new ethers.Contract(
      stakingRaijinsAddress,
      StakingRaijins,
      library.getSigner()
    );
    callContract(chainId, contract, "stake", [nftToStake, tokenId, timeType], {
      sentMsg: "Staking Raijins NFT submitted!",
      failMsg: "Staking Raijins NFT failed.",
      // setPendingTxns,
    })
      .then(async (res) => {
        // setIsVisible(false);
        // setOpenBuyModal(true);
        // setOpenBoughtModal(false);
      })
      .finally(() => {
        // setIsStaking(false);
        // setOpenBuyModal(false);
        // setOpenBoughtModal(true);
        setIsSubmitting(false);
      });

    handleUnselectAllInWallet();
  };

  const getTextStake = () => {
    if (needApproval && isWaitingForApproval) {
      return "Waiting for Approval...";
    }
    if (isApproving) {
      return "Approving";
    }
    if (needApproval) {
      return "Approve";
    }

    if (isSubmitting) {
      return "Staking...";
    }

    return "Stake";
  };

  const handleClaim = () => {
    const nftToClaim = stakedNFTSelection.map((item) => {
      return item.address;
    });

    const tokenId = stakedNFTSelection.map((item) => {
      return item.id;
    });

    const contract = new ethers.Contract(
      stakingRaijinsAddress,
      StakingRaijins,
      library.getSigner()
    );
    callContract(chainId, contract, "claimRewards", [nftToClaim, tokenId], {
      sentMsg: "Claim Raijins Ticket submitted!",
      failMsg: "Claim Raijins Ticket failed.",
      // setPendingTxns,
    })
      .then(async (res) => {
        // setIsVisible(false);
        // setOpenBuyModal(true);
        // setOpenBoughtModal(false);
      })
      .finally(() => {
        // setIsStaking(false);
        // setOpenBuyModal(false);
        // setOpenBoughtModal(true);
      });

    handleUnselectAllStaked();
  };

  const handleUnStake = () => {
    const nftToUnStake = stakedNFTSelection.map((item) => {
      return item.address;
    });

    const tokenId = stakedNFTSelection.map((item) => {
      return item.id;
    });

    const contract = new ethers.Contract(
      stakingRaijinsAddress,
      StakingRaijins,
      library.getSigner()
    );
    callContract(chainId, contract, "unStake", [nftToUnStake, tokenId], {
      sentMsg: "Unstake Raijins NFT submitted!",
      failMsg: "Unstake Raijins NFT failed.",
      // setPendingTxns,
    })
      .then(async (res) => {
        // setIsVisible(false);
        // setOpenBuyModal(true);
        // setOpenBoughtModal(false);
      })
      .finally(() => {
        // setIsStaking(false);
        // setOpenBuyModal(false);
        // setOpenBoughtModal(true);
      });

    handleUnselectAllStaked();
  };

  // const handleAddRestake = () => {
  //   const nftToAddRestake = stakedNFTSelection.map((item) => {
  //     return item.address;
  //   });

  //   const tokenId = stakedNFTSelection.map((item) => {
  //     return item.id;
  //   });

  //   const contract = new ethers.Contract(
  //     stakingRaijinsAddress,
  //     StakingRaijins,
  //     library.getSigner()
  //   );
  //   callContract(
  //     chainId,
  //     contract,
  //     "addAutoRestake",
  //     [nftToAddRestake, tokenId],
  //     {
  //       sentMsg: "Add AutoRestake Raijins NFT submitted!",
  //       failMsg: "Add AutoRestake Raijins NFT failed.",
  //       // setPendingTxns,
  //     }
  //   )
  //     .then(async (res) => {
  //       // setIsVisible(false);
  //       // setOpenBuyModal(true);
  //       // setOpenBoughtModal(false);
  //     })
  //     .finally(() => {
  //       // setIsStaking(false);
  //       // setOpenBuyModal(false);
  //       // setOpenBoughtModal(true);
  //     });

  //   handleUnselectAllStaked();
  // };

  // const handleCancelRestake = () => {
  //   const nftToCancelRestake = stakedNFTSelection.map((item) => {
  //     return item.address;
  //   });

  //   const tokenId = stakedNFTSelection.map((item) => {
  //     return item.id;
  //   });

  //   const contract = new ethers.Contract(
  //     stakingRaijinsAddress,
  //     StakingRaijins,
  //     library.getSigner()
  //   );
  //   callContract(
  //     chainId,
  //     contract,
  //     "removeAutoRestake",
  //     [nftToCancelRestake, tokenId],
  //     {
  //       sentMsg: "Cancel AutoRestake Raijins NFT submitted!",
  //       failMsg: "Cancel AutoRestake Raijins NFT failed.",
  //       // setPendingTxns,
  //     }
  //   )
  //     .then(async (res) => {
  //       // setIsVisible(false);
  //       // setOpenBuyModal(true);
  //       // setOpenBoughtModal(false);
  //     })
  //     .finally(() => {
  //       // setIsStaking(false);
  //       // setOpenBuyModal(false);
  //       // setOpenBoughtModal(true);
  //     });

  //   handleUnselectAllStaked();
  // };

  useEffect(() => {
    if (needApproval) setIsWaitingForApproval(false);
  }, [needApproval, active]);

  useEffect(() => {
    handleUnselectAllInWallet();
    handleUnselectAllStaked();
  }, [selectedCollection]);

  return (
    <div className={cx("raijins-staking")}>
      <SectionTitle classes="mb-5">
        Raijins staking for <span>Ticket</span>
      </SectionTitle>
      {/* <Combobox ref={regInputForCollectionId} options={COLLECTION_OPTIONS} value={selectedCollection} onChange={(selectedOption) => setSelectedCollection(selectedOption)} /> */}
      <Tabs className={cx("raijins-staking-tabs")}>
        <TabList>
          <Tab>
            {/* <h6>Volumes</h6> */}
            <p>
              <span>{nftsInWallet ? nftsInWallet.length : 0}</span> in wallet
            </p>
          </Tab>
          <Tab>
            {/* <h6>Avatars</h6> */}
            <p>
              <span>{nftsStaked ? nftsStaked.length : 0}</span> staked
            </p>
          </Tab>
        </TabList>

        <TabPanel>
          {isMobile ? (
            <div className={cx("cards-wrapper", "mb-5")}>
              {nftsInWallet && nftsInWallet.length ? (
                nftsInWallet.map((item, index) => {
                  return (
                    <RaijinsStakingCard
                      nft={item}
                      key={index}
                      timeTypeInfo={timeTypeInfo}
                      currentTimeType={currentTimeType}
                      index={index}
                      selectStatusInWallet={selectStatusInWallet}
                      handleSelectNFTInWallet={handleSelectNFTInWallet}
                    />
                  );
                })
              ) : (
                <div className={cx("p-1", "text-center", "text-danger")}>
                  No NFTs in wallet
                </div>
              )}
            </div>
          ) : (
            <div className={cx("table-wrapper", "mb-5")}>
              <table>
                <thead>
                  <tr rowSpan={nftsInWallet ? nftsInWallet.length + 1 : 0}>
                    <th>nft visual</th>
                    <th>nft #</th>
                    <th>selected</th>
                    {/* <th>boost</th> */}
                    <th>staking period</th>
                    <th>estimated reward</th>
                  </tr>
                </thead>
                <tbody>
                  {nftsInWallet && nftsInWallet.length ? (
                    nftsInWallet.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td className="nft-visual">
                            <img src={item.image} alt={`${item.image}`} />
                          </td>
                          <td className="w-20">
                            {item.name} #{item.id}
                          </td>
                          <td>
                            <div className="raijins-checkbox">
                              <input
                                type="checkbox"
                                id={`raijinsCheckbox-${index}`}
                                checked={selectStatusInWallet[index] === true}
                                onChange={() => handleSelectNFTInWallet(index)}
                                value={selectStatusInWallet[index]}
                              />
                              <label htmlFor={`raijinsCheckbox-${index}`}></label>
                            </div>
                          </td>
                          {/* <td className="percent text-success">
                        15%
                        <br />
                        <span className="text-danger">
                          ({item.days} days unlisted)
                        </span>
                      </td> */}
                          <td className="days">
                            <span className="text-primary">
                              {timeTypeInfo[currentTimeType].period}
                            </span>{" "}
                            day
                          </td>
                          <td>
                            <span className="text-primary">{item.rewards}</span>{" "}
                            raijins tickets
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className={cx("text-danger", "text-center", "p-1")}
                      >
                        No NFTs in wallet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="btn-group">
            <button
              className={cx("select-all-btn")}
              onClick={handleSelectAllInWallet}
            >
              select all
            </button>
            <RoundButton
              key="stake"
              text={getTextStake()}
              variant="primary"
              disabled={disabledStakeBtn}
              onBtnClick={handleStake}
            />
            {timeTypeInfo.map((btn, index) => (
              <RoundButton
                key={btn.id}
                text={btn.label}
                variant={currentTimeType === index ? "danger" : "transparent"}
                onBtnClick={() => handleTimeType(index)}
              />
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          {isMobile ? (
            <div className={cx("cards-wrapper", "mb-5")}>
              {nftsStaked && nftsStaked.length ? (
                nftsStaked.map((item, index) => {
                  return (
                    <RaijinsStakedCard
                      nft={item}
                      index={index}
                      selectStatusStaked={selectStatusStaked}
                      handleSelectNFTStaked={handleSelectNFTStaked}
                      timeTypeInfo={timeTypeInfo}
                    />
                  );
                })
              ) : (
                <div className={cx("p-1", "text-center", "text-danger")}>
                  No NFTs in wallet
                </div>
              )}
            </div>
          ) : (
            <div className={cx("table-wrapper", "mb-5")}>
              <table>
                <thead>
                  <tr rowSpan={nftsStaked ? nftsStaked.length + 1 : 0}>
                    <th>nft visual</th>
                    <th>nft #</th>
                    <th>selected</th>
                    <th>auto-restake</th>
                    <th>remaining period</th>
                    <th>rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {nftsStaked && nftsStaked.length ? (
                    nftsStaked.map((nft, index) => {
                      return (
                        <tr key={nft.id}>
                          <td className="nft-visual">
                            <img src={nft.image} alt={`${nft.image}`} />
                          </td>
                          <td className="w-20">
                            {nft.name} #{nft.id}
                          </td>
                          <td>
                            <div className="raijins-checkbox">
                              <input
                                type="checkbox"
                                id={`raijinsCheckbox-${index}`}
                                checked={selectStatusStaked[index] === true}
                                onClick={() => handleSelectNFTStaked(index)}
                                value={selectStatusStaked[index]}
                              />
                              <label htmlFor={`raijinsCheckbox-${index}`}></label>
                            </div>
                          </td>
                          <td>
                            <button className={cx("auto-restake-btn")}>
                              <img
                                src={
                                  nft.autoRestake === true
                                    ? CircularArrowImg
                                    : XImage
                                }
                                alt="arrow.png"
                                width="100%"
                              />
                            </button>
                          </td>
                          <td className="days">
                            <span className="text-primary">{nft.leftTime}</span>{" "}
                            days left
                            <br />
                            <span className="text-danger">
                              ({timeTypeInfo[nft.timeType].period} days
                              programme)
                            </span>
                          </td>
                          <td>
                            <div className="mb-2">
                              <span className="text-primary">next reward:</span>
                              <br />
                              <span className="text-danger">
                                {nft.nextTicket}
                              </span>
                              {" raijins tickets"}
                            </div>
                            <div>
                              <span className="text-primary">
                                claimable reward:
                              </span>
                              <br />
                              <span className="text-danger">
                                {nft.claimableTicket}
                              </span>
                              {" raijins tickets"}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className={cx("text-danger", "text-center", "p-1")}
                      >
                        No staked NFTs
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="btn-group">
            <button
              className={cx("select-all-btn")}
              onClick={handleSelectAllStaked}
            >
              select all
            </button>
            <RoundButton
              key="claim"
              text="claim rewards"
              variant="transparent"
              disabled={disabledClaimBtn}
              onBtnClick={handleClaim}
            />
            <RoundButton
              key="unstake"
              text="unstake"
              variant="transparent"
              disabled={disabledUnStakeBtn}
              onBtnClick={handleUnStake}
            />
            {/* <RoundButton
              key="add_auto_restake"
              text="add auto restake"
              variant="transparent"
              disabled={disabledAddRestakeBtn}
              onBtnClick={handleAddRestake}
            />
            <RoundButton
              key="cancel_auto_restake"
              text="cancel auto restake"
              variant="transparent"
              disabled={disabledCancelRestakeBtn}
              onBtnClick={handleCancelRestake}
            /> */}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default RaijinsStaking;
