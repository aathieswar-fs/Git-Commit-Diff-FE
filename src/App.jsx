import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

export default function App() {
  const BACK_END_URL = process.env.REACT_BACK_END_API;

  const [diffData, setDiffData] = useState([]);
  const [commitInfo, setCommitInfo] = useState(null);
  const [ error , setError] = useState(false);
  const [loading , setLoading ] = useState(false);

  // /repositories/:owner/:repo/commits/:commitOid
  const { owner, repo, commitOid } = useParams()

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

  const numberToWords = (num) => {
    const words = [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
      "nine", "ten", "eleven", "twelve"
    ];
    return words[num] || num;
  };

  const formatDaysAgo = (dateString) => {
    const commitDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now - commitDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInHours < 24) {
      const hourWord = diffInHours <= 12 ? numberToWords(diffInHours) : diffInHours;
      return `${hourWord} hours ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      return `${diffInMonths} months ago`;
    } else {
      return `${diffInYears} years ago`;
    }
  };


  return (
    <div className="diff-container line">
      {commitInfo && (
        <div className="diff-header flex justify-between max-sm:flex-col mb-[2rem] line">
          <div className="diff-main-head flex gap-[0.25rem]">
            <div className="w-16">
              <img className="rounded-[50%]" src={`${commitInfo.avatar_url}`} />
            </div>
            <div>
              <p className="header-font">{commitInfo.message.split("\n")[0]}</p>
              <p className="body-font text-[var(--muted)]">
                Authored by  <span className="text-[var(--body)] font-semibold">{commitInfo.author.name}</span> {formatDaysAgo(commitInfo.author.date)}
              </p>
              <p className="font-body text-[var(--body)]">
                {commitInfo.message.split("\n").slice(1).join("\n")}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg text-xs">
            {/* Only show commiter if its different from the author name */}
            {(commitInfo.author.name != commitInfo.committer.name) && <p className="text-[var(--muted)] mt-1">
              Committed by <span className="font-semibold">{commitInfo.committer.name} </span>
              {formatDaysAgo(commitInfo.committer.date)}
            </p>}
            <p className="text-gray-600">
              Commit <span className="body-font !font-bold">{commitOid}</span>
            </p>
            {commitInfo.parents.length > 0 && (
              <pre className=" text-gray-500 mt-1 line">
                Parent <span className="text-[var(--link)] link-monospace-font font-bold">{commitInfo.parents[0].oid}</span>
              </pre>
            )}
          </div>
        </div>
      )}

      {diffData.length === 0 ? (
        <div class="min-h-screen flex items-center justify-center">
          <div class="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
        </div>
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
      <button className="file-toggle flex text-sm" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ?
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2_214)">
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
            <g clipPath="url(#clip0_2_144)">
              <path d="M6.175 9L10 12.825L13.825 9L15 10.1833L10 15.1833L5 10.1833L6.175 9Z" fill="#6078A9" />
            </g>
            <defs>
              <clipPath id="clip0_2_144">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
        <span className="text-[#1C7CD6] font-sm line mb-[0.25rem]">
          {file.headFile.path}
        </span>
      </button>

      {
        isOpen && (
          <div className="dropdown-content monospace-font line">
            {file.hunks.map((hunk, index) => (
              <div key={index} className="hunk border border-[#E7EBF1]">
                <pre className="header text-[#6D84B0] line">{hunk.header}</pre>
                <div className="lines">
                  {hunk.lines.map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={`line mx-1 flex ${line.content.startsWith("+")
                        ? "added"
                        : line.content.startsWith("-")
                          ? "removed"
                          : "unchanged"
                        }`}
                    >
                      <span className="w-8 text-center text-[var(--code-secondary)]">{line.baseLineNumber !== null ? line.baseLineNumber : " "}</span>
                      <span className="w-8 text-center text-[var(--code-secondary)] bg-blue-100 bg-opacity-[0.15]">{line.headLineNumber !== null ? line.headLineNumber : " "}</span>
                      <span className="flex-1 whitespace-pre-wrap break-words px-2 py-1 text-[var(--code-primary)] font-bold">{line.content}</span>
                    </div>
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
