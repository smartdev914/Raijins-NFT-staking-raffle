import "./AddressDropdown.css";
import { Menu } from "@headlessui/react";
import { shortenAddress, useENS } from "lib/legacy";
import { useCopyToClipboard, createBreakpoint } from "react-use";
import externalLink from "assets/images/ic_new_link_16.svg";
import copy from "assets/images/ic_copy_16.svg";
import disconnect from "assets/images/ic_sign_out_16.svg";
import { FaChevronDown } from "react-icons/fa";
import Davatar from "@davatar/react";
import { helperToast } from "lib/helperToast";

function AddressDropdown({
  account,
  accountUrl,
  disconnectAccountAndCloseSettings,
}) {
  const useBreakpoint = createBreakpoint({ L: 600, M: 550, S: 400 });
  const breakpoint = useBreakpoint();
  const [, copyToClipboard] = useCopyToClipboard();
  const { ensName } = useENS(account);

  return (
    <Menu>
      <Menu.Button as="div">
        <button className="App-cta small transparent address-btn">
          <div className="user-avatar">
            <Davatar size={20} address={account} />
          </div>
          <span className="user-address">
            {ensName || shortenAddress(account, breakpoint === "S" ? 13 : 13)}
          </span>
          <FaChevronDown />
        </button>
      </Menu.Button>
      <div>
        <Menu.Items as="div" className="menu-items">
          <Menu.Item>
            <div
              className="menu-item"
              onClick={() => {
                copyToClipboard(account);
                helperToast.success("Address copied to your clipboard");
              }}
            >
              <img src={copy} alt="Copy user address" />
              <p>Copy Address</p>
            </div>
          </Menu.Item>
          <Menu.Item>
            <a
              href={accountUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="menu-item"
            >
              <img src={externalLink} alt="Open address in explorer" />
              <p>View in Explorer</p>
            </a>
          </Menu.Item>
          <Menu.Item>
            <div
              className="menu-item"
              onClick={disconnectAccountAndCloseSettings}
            >
              <img src={disconnect} alt="Disconnect the wallet" />
              <p>Disconnect</p>
            </div>
          </Menu.Item>
        </Menu.Items>
      </div>
    </Menu>
  );
}

export default AddressDropdown;
