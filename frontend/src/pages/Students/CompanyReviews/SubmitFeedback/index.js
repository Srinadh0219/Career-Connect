import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FiSend } from "react-icons/fi";

const SubmitFeedback = ({ submitFeedback, getCompanyReviewsList, rating }) => {
  const [show, setShow] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitBtn = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("Please enter a company name");
      return;
    }
    setSubmitting(true);
    await submitFeedback(companyName);
    if (getCompanyReviewsList) {
      getCompanyReviewsList();
    }
    setSubmitting(false);
    setCompanyName("");
    setShow(false);
  };

  return (
    <>
      <button
        onClick={handleShow}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
      >
        <FiSend /> Submit Review
      </button>

      <Modal show={show} onHide={handleClose} centered contentClassName="bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-white">
        <Modal.Header closeButton closeVariant="white" className="border-b border-slate-700/60 bg-slate-800/80 p-5">
          <Modal.Title className="text-lg font-bold text-white">
            Submit Company Review
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={submitBtn}>
          <Modal.Body className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Microsoft, Infosys"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400 flex items-center justify-between">
              <span>Your Selected Rating:</span>
              <span className="text-amber-400 font-bold text-sm">
                {"★".repeat(rating || 5)} ({rating || 5}/5)
              </span>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-t border-slate-700/60 bg-slate-800/50 p-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-md shadow-blue-600/25"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default SubmitFeedback;
