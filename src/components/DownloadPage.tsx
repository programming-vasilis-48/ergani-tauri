import React, { useState, useEffect } from 'react';

interface Version {
  version: string;
  releaseDate: string;
  notes: string[];
  downloadWindows: string;
}

interface DownloadPageProps {
  latestVersion: Version;
  versions?: Version[];
}

export default function DownloadPage({
  latestVersion,
  versions = []
}: DownloadPageProps): JSX.Element {
  const [showAllVersions, setShowAllVersions] = useState(false);

  // Get download link (Windows only)
  const getDownloadLink = (version: Version) => {
    return version.downloadWindows;
  };

  return (
    <div className="download-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h1 className="card-title text-center mb-4">Ergani Schedule Manager</h1>

                <div className="latest-version mb-5">
                  <h2 className="h4 mb-3">Latest Version: {latestVersion.version}</h2>
                  <p className="text-muted">Released on {latestVersion.releaseDate}</p>



                  <div className="download-button text-center mb-4">
                    <a
                      href={getDownloadLink(latestVersion)}
                      className="btn btn-success btn-lg"
                      download
                    >
                      <i className="bi bi-download me-2"></i>
                      Download for Windows
                    </a>
                  </div>

                  <div className="release-notes">
                    <h3 className="h5 mb-3">What's New</h3>
                    <ul className="list-group">
                      {latestVersion.notes.map((note, index) => (
                        <li key={index} className="list-group-item">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {versions.length > 0 && (
                  <div className="previous-versions mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h5 mb-0">Previous Versions</h3>
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setShowAllVersions(!showAllVersions)}
                      >
                        {showAllVersions ? 'Hide' : 'Show All'}
                      </button>
                    </div>

                    {showAllVersions && (
                      <div className="accordion" id="versionsAccordion">
                        {versions.map((version, index) => (
                          <div className="accordion-item" key={index}>
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#version-${index}`}
                              >
                                Version {version.version} - {version.releaseDate}
                              </button>
                            </h2>
                            <div
                              id={`version-${index}`}
                              className="accordion-collapse collapse"
                              data-bs-parent="#versionsAccordion"
                            >
                              <div className="accordion-body">
                                <ul className="list-group list-group-flush mb-3">
                                  {version.notes.map((note, idx) => (
                                    <li key={idx} className="list-group-item">
                                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                                      {note}
                                    </li>
                                  ))}
                                </ul>
                                <div className="text-center">
                                  <a
                                    href={getDownloadLink(version)}
                                    className="btn btn-outline-primary btn-sm"
                                    download
                                  >
                                    <i className="bi bi-download me-2"></i>
                                    Download for Windows
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}