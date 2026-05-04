export function ConfirmModal({ message, detail, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal confirm-modal">
        <div className="confirm-icon">⚠</div>
        <h3>{message}</h3>
        {detail && <p className="confirm-detail">{detail}</p>}
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger-solid" onClick={onConfirm}>Yes, delete all</button>
        </div>
      </div>
    </div>
  );
}
