// utils/plug.js
const whitelist = [
  process.env.REACT_APP_MAIN_CANISTER_ID,
  process.env.REACT_APP_USERTHINGS_CANISTER_ID,
  process.env.REACT_APP_DATASTORAGE_CANISTER_ID,
  process.env.REACT_APP_IOTBACKEND_CANISTER_ID
];

const host = process.env.REACT_APP_IC_HOST || "https://mainnet.dfinity.network";

export const plugConnection = {
  whitelist,
  host,
  onConnectionUpdate: () => {},
  dev: true  // Set to false for production
};

