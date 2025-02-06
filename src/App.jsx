import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function GitDiff() {
  const BACK_END_URL = process.env.REACT_BACK_END_API;
  
  const [diffData, setDiffData] = useState([]);
  const [commitInfo, setCommitInfo] = useState(null);

  // /repositories/:owner/:repo/commits/:commitOid
  const { owner ,repo, commitOid }= useParams()


  async function fetchDiff() {
    try {
      const response = await axios.get(
        `${BACK_END_URL}/repositories/${owner}/${repo}/commits/${commitOid}/diff`
      );
      setDiffData(response.data);
      console.log("Diff data : ", response.data);
    } catch (error) {
      console.error("Error fetching diff:", error);
    }
  }

  async function fetchCommitInfo() {
    try {
      const response = await axios.get(
        `${BACK_END_URL}/repositories/${owner}/${repo}/commits/${commitOid}`
      );
      setCommitInfo(response.data);
      console.log("Commit data : ", response.data);
    } catch (error) {
      console.error("Error fetching commit info:", error);
    }
  }

  useEffect(() => {
    if (!owner || !repo || !commitOid) return;
    fetchDiff();
    fetchCommitInfo();
  }, []);

  const formatDaysAgo = (dateString) => {
    const commitDate = new Date(dateString);
    const now = new Date();

    const diffInDays = Math.floor((now - commitDate) / (1000 * 60 * 60 * 24));

    return `${diffInDays} days ago`;
  };


  return (
    <div className="diff-container">
      {commitInfo && (
        <div className="diff-header flex justify-between">
          <div className="diff-main-head flex gap-[0.25rem] items-center">
            <div className="w-16">
              <img src={`${commitInfo.avatar_url}`} />
            </div>
            <div>
              <p className="text-md font-semibold">{commitInfo.message.split("\n")[0]}</p>
              <p className="text-sm text-[var(--muted)]">
                Authored by  <span className="text-[var(--body)] font-semibold">{commitInfo.author.name}</span> {formatDaysAgo(commitInfo.author.date)}
              </p>
              <p className="text-sm text-[var(--body)]">
                {commitInfo.message.split("\n").slice(1).join("\n")}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-6 text-xs">
            <p className="text-gray-600 mt-1">
              Committed by <span className="font-semibold">{commitInfo.committer.name} </span>
              {formatDaysAgo(commitInfo.committer.date)}
            </p>
            <p className="text-gray-600">
              Commit <span className="font-semibold">{commitOid}</span>
            </p>
            {commitInfo.parents.length > 0 && (
              <p className=" text-gray-500 mt-1">
                Parent {" "}
                <span className="text-[var(--blue)]">{commitInfo.parents[0].oid}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {diffData.length === 0 ? (
        <p className="text-gray-500">No file changes detected.</p>
      ) : (
        diffData.map((file, index) => <FileDropdown key={index} file={file} />)
      )}
    </div>
  );
}

const FileDropdown = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="file mb-[2rem]">
      <button className="file-toggle flex" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ?
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2_214)">
              <path d="M7 15.8167L10.8167 12L7 8.175L8.175 7L13.175 12L8.175 17L7 15.8167Z" fill="#6078A9" />
            </g>
            <defs>
              <clipPath id="clip0_2_214">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          :
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2_144)">
              <path d="M6.175 9L10 12.825L13.825 9L15 10.1833L10 15.1833L5 10.1833L6.175 9Z" fill="#6078A9" />
            </g>
            <defs>
              <clipPath id="clip0_2_144">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
        <span className="text-[#1C7CD6] font-sm">
          {file.headFile.path}
        </span>
      </button>

      {
        isOpen && (
          <div className="dropdown-content ">
            {file.hunks.map((hunk, index) => (
              <div key={index} className="hunk border border-[#E7EBF1]">
                <pre className="header">{hunk.header}</pre>
                <div className="lines">
                  {hunk.lines.map((line, lineIndex) => (
                    <pre
                      key={lineIndex}
                      className={`line ${line.content.startsWith("+")
                        ? "added"
                        : line.content.startsWith("-")
                          ? "removed"
                          : "unchanged"
                        }`}
                    >
                      <span className="line-numbers">
                        {line.baseLineNumber !== null ? line.baseLineNumber : "  "}
                        {" | "}
                        {line.headLineNumber !== null ? line.headLineNumber : "  "}
                      </span>
                      {" " + line.content}
                    </pre>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};
