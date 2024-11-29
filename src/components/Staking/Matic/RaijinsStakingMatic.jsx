import { useWeb3React } from "@web3-react/core";
import cx from "classnames";
import useSWR from "swr";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import SectionTitle from "../../SectionTitle";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
// import TableDecoImg from "assets/images/staking/tableDeco.png";
// import CircularArrowImg from "assets/images/common/Arrow.png";
// import XImage from "assets/images/common/XLight.png";
import RoundButton from "../../RoundButton";
import { getContract } from "config/contracts";
import { RAIJINS_NFTS, VOLUME1_METADATA, COLLECTION_OPTIONS } from "config/staking";
import { callContract, contractFetcher } from "lib/contracts";
import { useChainId } from "lib/chains";
import { approveNFT } from "lib/approveNFT";
import StakingRaijinsMatic from "abis/StakingRaijinsMatic.json";
import Raijins from "abis/Raijins.json";
import RaijinsStakingCard from "./RaijinsStakingCardMatic";
// import Combobox from '../Combobox/Combobox';
import {
  formatAmount,
} from "lib/numbers";

const loadWalletNFTs = (dataWallet) => {
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

    return {
      id: item.token_id.toString(),
      name: item.name,
      address: nftInfo.address,
      image: imageURL
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
      id: tokenId
    };
  });

  const finalArray = ret.filter((item) => item !== null);
  return finalArray;
};

let walletNFTSelection = [];
let stakedNFTSelection = [];

const RaijinsStaking = ({ isMobile }) => {
  const { active, library, account } = useWeb3React();

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

  const { chainId } = useChainId();
  const stakingRaijinsMaticAddress = getContract(chainId, "StakingRaijinsMatic");
  const raijinsAddress = getContract(chainId, "Raijins");

  const nftAddresses = RAIJINS_NFTS.map((item) => item.address);
  //////////Reward Status/////////////////////////////////////////////////////////////////////////////////////
  const { data: nftBalance } = useSWR(
    active &&
    raijinsAddress && [
      active,
      chainId,
      raijinsAddress,
      "balanceOf",
      stakingRaijinsMaticAddress
    ],
    { fetcher: contractFetcher(library, Raijins) }
  );

  const { data: totalDistributedMatic } = useSWR(
    active &&
    stakingRaijinsMaticAddress && [
      active,
      chainId,
      stakingRaijinsMaticAddress,
      "totalDistributed"
    ],
    { fetcher: contractFetcher(library, StakingRaijinsMatic) }
  );

  const { data: userSatus } = useSWR(
    active &&
    stakingRaijinsMaticAddress && [
      active,
      chainId,
      stakingRaijinsMaticAddress,
      "getUserStatus",
      raijinsAddress,
      account
    ],
    { fetcher: contractFetcher(library, StakingRaijinsMatic) }
  );

  //////////Reading Wallet///////////////////////////////////////////////////////////////////////////////////////////////////
  const { data: dataWallet } = useSWR(
    active &&
    stakingRaijinsMaticAddress && [
      active,
      chainId,
      stakingRaijinsMaticAddress,
      "getTokensInWallet",
      nftAddresses,
      account
    ],
    { fetcher: contractFetcher(library, StakingRaijinsMatic) }
  );
  const filteredDataWallet = dataWallet ? dataWallet.filter((item) => item.token_address.toLowerCase() === selectedCollection.address.toLowerCase()) : [];
  let nftsInWallet = loadWalletNFTs(filteredDataWallet);
  //////////Reading Staking Contract////////////////////////////////////////////////////////////////////////////////////////////////////
  const { data: dataContract } = useSWR(
    active &&
    stakingRaijinsMaticAddress && [
      active,
      chainId,
      stakingRaijinsMaticAddress,
      "getStakingInfo",
      nftAddresses,
      account,
    ],
    { fetcher: contractFetcher(library, StakingRaijinsMatic) }
  );
  const filteredDataContract = dataContract ? dataContract.filter((item) => item._address.toLowerCase() === selectedCollection.address.toLowerCase()) : [];
  const nftsStaked = loadStakedNFTs(filteredDataContract);

  /////////Approval Status/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const { data: collectionApprovals } = useSWR(
    active &&
    stakingRaijinsMaticAddress && [
      active,
      chainId,
      stakingRaijinsMaticAddress,
      "getApprovalStatus",
      nftAddresses,
      account,
    ],
    { fetcher: contractFetcher(library, StakingRaijinsMatic) }
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
      setDisabledUnStakeBtn(true);
      // setDisabledAddRestakeBtn(true);
      // setDisabledCancelRestakeBtn(true);
    } else {
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

    setDisabledUnStakeBtn(false);
    // setDisabledAddRestakeBtn(false);
    // setDisabledCancelRestakeBtn(false);
  };

  const handleUnselectAllStaked = () => {
    let items = [];
    stakedNFTSelection = [];
    setSelectStatusStaked(items);

    setDisabledUnStakeBtn(true);
    // setDisabledAddRestakeBtn(true);
    // setDisabledCancelRestakeBtn(true);
  };

  const approveFromNFT = () => {
    if (needApproval) {
      approveNFT({
        setIsApproving,
        library,
        tokenAddress: selectedCollection.address,
        spender: stakingRaijinsMaticAddress,
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

    const contract = new ethers.Contract(
      stakingRaijinsMaticAddress,
      StakingRaijinsMatic,
      library.getSigner()
    );
    callContract(chainId, contract, "stake", [nftToStake, tokenId], {
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
    const contract = new ethers.Contract(
      stakingRaijinsMaticAddress,
      StakingRaijinsMatic,
      library.getSigner()
    );
    callContract(chainId, contract, "claimRewards", [raijinsAddress], {
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
      stakingRaijinsMaticAddress,
      StakingRaijinsMatic,
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
  //     stakingRaijinsMaticAddress,
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
  //     stakingRaijinsMaticAddress,
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
    if (parseFloat(userSatus?._pendingReward?.toString()) > 0)
      setDisabledClaimBtn(false);
    else
      setDisabledClaimBtn(true);
  }, [userSatus?._pendingReward])

  useEffect(() => {
    handleUnselectAllInWallet();
    handleUnselectAllStaked();
  }, [selectedCollection]);

  return (
    <div className={cx("raijins-staking")}>
      <SectionTitle classes="mb-5">
        Raijins staking for <span>$MATIC</span>
      </SectionTitle>
      <div className={cx("table-wrapper")}>
        <table>
          <tr>
            <td className="text-right">
              Total Raijins Staked:
            </td>
            <td className="text-left text-danger">{nftBalance?.toString()}</td>
          </tr>
          <tr>
            <td className="text-right">
              Total Distributed Matic:
            </td>
            <td className="text-left text-danger">{formatAmount(totalDistributedMatic?.toString(), 18, 2)}</td>
          </tr>
          <tr>
            <td className="text-right">
              Your Claimed Amount:
            </td>
            <td className="text-left text-danger">{formatAmount(userSatus?._claimedReward?.toString(), 18, 2)}</td>
          </tr>
          <tr>
            <td className="text-right">
              Your Claimable Amount:
            </td>
            <td className="text-left text-danger">{formatAmount(userSatus?._pendingReward?.toString(), 18, 2)}</td>
          </tr>
        </table>
      </div>
        <RoundButton
          key="claim"
          text="claim rewards"
          variant="transparent"
          disabled={disabledClaimBtn}
          onBtnClick={handleClaim}
          classes="mb-5"
        />
      <Tabs className={cx("raijins-staking-tabs-m")}>
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
              {nftsInWallet && nftsInWallet.length ? (
                nftsInWallet.map((item, index) => {
                  return (
                    <RaijinsStakingCard
                      nft={item}
                      key={index}
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
          </div>
        </TabPanel>
        <TabPanel>
          {isMobile ? (
            <div className={cx("cards-wrapper", "mb-5")}>
              {nftsStaked && nftsStaked.length ? (
                nftsStaked.map((item, index) => {
                  return (
                    <RaijinsStakingCard
                      nft={item}
                      key={index}
                      index={index}
                      selectStatusInWallet={selectStatusStaked}
                      handleSelectNFTInWallet={handleSelectNFTStaked}
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
            {nftsStaked && nftsStaked.length ? (
              nftsStaked.map((item, index) => {
                return (
                  <RaijinsStakingCard
                    nft={item}
                    key={index}
                    index={index}
                    selectStatusInWallet={selectStatusStaked}
                    handleSelectNFTInWallet={handleSelectNFTStaked}
                  />
                );
              })
            ) : (
              <div className={cx("p-1", "text-center", "text-danger")}>
                No staked NFTs
              </div>
            )}
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
