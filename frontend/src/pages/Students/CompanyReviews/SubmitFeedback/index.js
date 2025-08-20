import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const SubmitFeedback = ({ submitFeedback, getCompanyReviewsList }) => {
  const [show, setShow] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const submitBtn = async () => {
    setShow(false);
    await submitFeedback(companyName);
    getCompanyReviewsList();
  };

  return (
    <>
      <Button variant="dark" onClick={handleShow}>
        Submit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Give You Feedback to your previous company</Modal.Title>
        </Modal.Header>
        <Modal.Body className="my-3">
          <label className="mb-2">Company Name: </label>
          <input
            type="text"
            placeholder="companyName"
            className="border-1 form-control"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitBtn}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubmitFeedback;
