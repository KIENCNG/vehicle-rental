import { useState } from "react";
import { money } from "../utils/constants";

// Phần giao diện hướng dẫn đặt cọc và gửi thông tin chuyển khoản.
export default function PaymentModal({ payment, contractId, onPaymentUpdated }) {
  const [transferRef, setTransferRef] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!payment || payment.trangThai === "DA_THANH_TOAN") return null;

  const reportTransfer = async () => {
    if (!transferRef.trim()) {
      setMessage("Vui lòng nhập mã giao dịch hoặc nội dung chuyển khoản.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`http://localhost:8080/api/thanh-toan/${payment.id}/da-chuyen-khoan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maGiaoDich: transferRef.trim() }),
      });
      if (!response.ok) throw new Error(await response.text());
      onPaymentUpdated(await response.json());
      setMessage("Đã gửi thông tin chuyển khoản. Vui lòng chờ nhân viên đối soát.");
    } catch (error) {
      setMessage(error.message || "Không thể gửi xác nhận chuyển khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-instructions">
      <h3>💳 Thanh toán tiền đặt cọc</h3>
      <p>Ngân hàng: <strong>{import.meta.env.VITE_BANK_NAME || "Vietcombank"}</strong></p>
      <p>Số tài khoản: <strong>{import.meta.env.VITE_BANK_ACCOUNT || "0123456789 (tài khoản demo)"}</strong></p>
      <p>Chủ tài khoản: <strong>{import.meta.env.VITE_BANK_ACCOUNT_NAME || "AUTORENT DEMO"}</strong></p>
      <p>Số tiền: <strong>{money(payment.tienDatCoc)}</strong></p>
      <p>Nội dung chuyển khoản: <strong>HD{contractId} DATCOC</strong></p>
      {payment.trangThai === "CHO_THANH_TOAN" ? (
        <>
          <label htmlFor={`transfer-ref-${payment.id}`}>Mã giao dịch / nội dung chuyển khoản</label>
          <input id={`transfer-ref-${payment.id}`} value={transferRef} onChange={(e) => setTransferRef(e.target.value)} placeholder={`HD${contractId} DATCOC`} />
          <button type="button" className="btn-primary" disabled={submitting} onClick={reportTransfer}>
            {submitting ? "Đang gửi..." : "Tôi đã chuyển khoản"}
          </button>
        </>
      ) : (
        <p className="payment-pending-note">Bạn đã báo chuyển khoản. Giao dịch đang chờ nhân viên kiểm tra.</p>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
