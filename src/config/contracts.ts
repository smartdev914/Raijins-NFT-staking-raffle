import { POLYGON } from "./chains";

const CONTRACTS = {
  [POLYGON]: {
    // polygon
    RaijinsTicket: "0xd22bdF42215144Cf46F1725431002a5a388e3E6E", // fixed
    RaijinsTicketRouter: "0xA426D38D3FeE2AB97C099AE117227Bc85CD4354B", // fixed
    StakingRaijins: "0xD38948A27Fe594D1D610c579d89Cc48433654289", // fixed
    StakingRaijinsMatic: "0x09CdAC5F084A9C886e9b828b1a0981ca2851eeb6",
    RaffleRaijins: "0x2C65937625Da1b3Db2b55BCfd4aD3EB3812E8b7C", // fixed
    Raijins: "0x74847697754aa2063fe180d6cd246aa82fa773ff"
  },
};

export function getContract(chainId: number, name: string): string {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }

  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }

  return CONTRACTS[chainId][name];
}
