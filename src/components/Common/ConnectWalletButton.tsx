import { ReactNode } from "react";
import cx from "classnames";
import "./Button.css";

type Props = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  mode: string;
};

export default function ConnectWalletButton({ children, onClick, className, mode }: Props) {
  let classNames = cx("btn btn-primary btn-sm connect-wallet", className);
  return (
    <div className='bordered-btn'>
      <button className={classNames} onClick={onClick}>
        <span className="btn-label">{children}</span>
      </button>
    </div>
  );
}
