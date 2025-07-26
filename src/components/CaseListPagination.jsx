import React, { useState } from 'react';

const CaseListPagination = ({ cases, onComplete }) => {
  const CASES_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastCase = currentPage * CASES_PER_PAGE;
  const indexOfFirstCase = indexOfLastCase - CASES_PER_PAGE;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(cases.length / CASES_PER_PAGE);

  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Case Title</th>
            <th>Description</th>
            <th>Case Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCases.length > 0 ? (
            currentCases.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{new Date(c.caseDate).toLocaleDateString()}</td>
                <td>{c.completed ? '✅ Completed' : '🕒 Pending'}</td>
                <td>
                  {!c.completed && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onComplete(c.id)}
                    >
                      Mark Done
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No cases found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CaseListPagination;
