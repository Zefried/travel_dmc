type Props = {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  txnId: string;
  setTxnId: (v: string) => void;
  screenshot: File | null;
  setScreenshot: (f: File | null) => void;
  onClose: () => void;
};

import  qr from "../../assets/bank/qr.png";
import './Styles/PlaceOrder.css';

export const PlaceOrder: React.FC<Props> = ({
  name,
  setName,
  phone,
  setPhone,
  txnId,
  setTxnId,
  screenshot,
  setScreenshot,
  onClose,
}) => {
  
  
  const handleSubmit = () => {
    console.log({ name, phone, txnId, screenshot });
  };

  return (
    <div className="glm-modal-overlay">
      <div className="glm-modal">

        <button className="glm-close" onClick={onClose}>✕</button>

        <h2>Complete Your Order</h2>

        <img src={qr} className="glm-qr-img" />

        <input
          className="glm-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="glm-input"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p className="glm-breaks"></p>

        <input
          className="glm-input"
          placeholder="Transaction ID"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
        />

        <p className="glm-breaks">OR</p>

        <label
          className={`glm-file-label ${screenshot ? "active" : ""}`}
        >
          {screenshot ? screenshot.name : "Upload payment screenshot"}
          
          <input
            type="file"
            className="glm-file-input"
            onChange={(e) =>
              setScreenshot(e.target.files?.[0] || null)
            }
          />
        </label>

        <button className="glm-buy-now" onClick={handleSubmit}>
          Submit
        </button>

      </div>
    </div>
  );
};