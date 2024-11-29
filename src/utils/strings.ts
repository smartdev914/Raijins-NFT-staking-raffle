export const formatAddress = (address: String): String => {
  return (
    address.substring(0, 5) + "..." + address.substring(address.length - 3)
  );
};

export const formatRaffleCardTitle = (title: String): String => {
  if (title.length <= 24)
    return title;
  else
    return title.substring(0, 24) + " ...";
};
