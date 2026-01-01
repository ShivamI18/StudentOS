import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UsageStats from "../plugins/usageStats";
import "./Focusmode.css";
import CircularTimer from "../components/CircularTimer";

const Focusmode = () => {
  const { register, handleSubmit, reset } = useForm();
  const [usageData, setUsageData] = useState([]);
  const [Analysis, setAnalysis] = useState({
    analysis:
      "You studied DSA focusing on arrays for about 0 hours and 25 minutes with a strong self understanding level, and your app usage shows almost no time spent on non productive apps, meaning your focus remained on learning related activities throughout the session, which helped you stay consistent and engaged without major distractions. It was a productive day",
    notes:
      "An array is a data structure that stores elements of the same data type in contiguous memory locations, allowing fast access using an index. Arrays are useful for storing lists of values like numbers or strings and are commonly used for iteration, searching, and sorting. Indexing in arrays usually starts from 0, meaning the first element is accessed at index 0. Common operations on arrays include traversal, insertion, deletion, and updating elements, though insertion and deletion can be costly due to shifting elements. Revision question What is an array Answer An array is a collection of elements of the same data type stored in contiguous memory locations. Revision question What does contiguous memory mean Answer It means array elements are stored next to each other in memory. Revision question What is the index of the first element in an array Answer The index of the first element is 0. Revision question Name one common operation on arrays Answer One common operation on arrays is traversal. Revision question Why is insertion costly in arrays Answer Insertion is costly because elements may need to be shifted",
    questions: [
      {
        q: "What best describes an array in data structures A A collection of different data types stored randomly B A collection of same data type elements stored in contiguous memory C A dynamic structure that grows automatically D A structure that stores key value pairs",
        a: "B A collection of same data type elements stored in contiguous memory",
      },
      {
        q: "What is the index used to access the first element of an array in most programming languages A 1 B 0 C -1 D Depends on data type",
        a: "B 0",
      },
      {
        q: "Why is insertion in the middle of an array inefficient A Because arrays cannot be resized B Because elements must be shifted to make space C Because arrays do not support insertion D Because memory is not contiguous",
        a: "B Because elements must be shifted to make space",
      },
      {
        q: "Which of the following is a common use of arrays A Storing hierarchical data B Managing recursive calls C Storing a list of similar items D Implementing graphs only",
        a: "C Storing a list of similar items",
      },
      {
        q: "Which operation involves visiting each element of the array once A Traversal B Insertion C Deletion D Indexing",
        a: "A Traversal",
      },
    ],
  });
  const [openIndex, setOpenIndex] = React.useState(null);

  const [seconds, setSeconds] = useState(25 * 60);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [userData, setUserData] = useState({
    subject: "",
    topics: "",
    rating: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await UsageStats.getUsageStats();
      const sortedData = result.data.sort(
        (a, b) => b.totalTimeForeground - a.totalTimeForeground
      );
      setUsageData(sortedData);
    } catch (err) {
      console.error("Error:", err);
      alert("Please enable 'Usage Access' for this app in the next screen.");
      await UsageStats.openUsageAccessSettings();
    } finally {
      setLoading(false);
    }
  };

  const onsubmit = async (data) => {
    if (loading) return;
    await fetchStats();
    setUserData({
      subject: data.subject,
      topics: data.topics,
      rating: data.rating,
      time: formatTime(seconds),
    });
  };

  const handleAnalysis = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_KEY}/api/usage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usageData),
        }
      );

      await response.json();

      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_API_KEY}/api/focusmode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const res = await resp.json();
      const parsed = await parseAIResponse(res.advice);
      setAnalysis(parsed);
    } catch (err) {
      console.error(err);
    }
  };

  const extractJSON = (raw) => {
    const match = raw.match(/```json([\s\S]*?)```/i);
    if (!match) throw new Error("No JSON block found");
    return match[1].trim();
  };

  const sanitizeJSON = (jsonString) => {
    return jsonString
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
  };

  const parseAIResponse = async (raw) => {
    try {
      const extracted = extractJSON(raw);
      const sanitized = sanitizeJSON(extracted);
      return JSON.parse(sanitized);
    } catch (err) {
      console.error("Invalid AI JSON format:", err.message);
      return null;
    }
  };

  const formatTime = (sec) => {
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEdit = async (data) => {
    setSeconds(data.mins * 60);
    reset();
    setShowSetting(false);
  };

  return (
    <div>
      {!isSessionComplete ? (
        <div>
          {!Analysis ? (
            <div
              style={{
                margin: "1em",
              }}
            >
              <form
                onSubmit={handleSubmit(onsubmit)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                  padding: "1.5em",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "0.75em",
                  boxShadow: "var(--shadow-sm)",
                  maxWidth: "100%",
                }}
              >
                <label
                  htmlFor="subject"
                  style={{
                    fontSize: "1em",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                  }}
                >
                  Subject:
                </label>
                <input
                  type="text"
                  defaultValue="DSA"
                  id="subject"
                  {...register("subject", { required: true })}
                  style={{
                    padding: "0.75em 1em",
                    fontSize: "1em",
                    borderRadius: "0.5em",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />

                <label
                  htmlFor="topics"
                  style={{
                    fontSize: "1em",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                  }}
                >
                  Topics Studied:
                </label>
                <input
                  type="text"
                  defaultValue="Array and List"
                  id="topics"
                  {...register("topics", { required: true })}
                  style={{
                    padding: "0.75em 1em",
                    fontSize: "1em",
                    borderRadius: "0.5em",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />

                <label
                  htmlFor="rating"
                  style={{
                    fontSize: "1em",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                  }}
                >
                  Rating:
                </label>
                <input
                  type="text"
                  defaultValue="4"
                  id="rating"
                  {...register("rating", { required: true })}
                  style={{
                    padding: "0.75em 1em",
                    fontSize: "1em",
                    borderRadius: "0.5em",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />

                <input
                  type="submit"
                  disabled={loading}
                  value="Save"
                  style={{
                    marginTop: "1em",
                    padding: "0.8em",
                    fontSize: "1em",
                    fontWeight: "600",
                    borderRadius: "0.6em",
                    border: "none",
                    backgroundColor: loading
                      ? "var(--btn-primary-disabled)"
                      : "var(--btn-primary-bg)",
                    color: "var(--btn-primary-text)",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                />
              </form>

              {loading && (
                <div
                  style={{
                    marginTop: "1em",
                    fontSize: "0.95em",
                    color: "var(--text-secondary)",
                  }}
                >
                  Wait while we are fetch app usage
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalysis}
                style={{
                  marginTop: "1.5em",
                  padding: "0.8em 1.2em",
                  fontSize: "1em",
                  fontWeight: "600",
                  borderRadius: "0.6em",
                  border: "none",
                  backgroundColor: "var(--btn-secondary-bg)",
                  color: "var(--btn-secondary-text)",
                  cursor: "pointer",
                }}
              >
                Analysis
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <h2
                style={{
                  color: "#1d4ed8",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px",
                }}
              >
                Analysis
              </h2>
              <div style={{ color: "#1f2933", marginTop: "8px" }}>
                {Analysis.analysis}
              </div>

              <h2
                style={{
                  color: "#1d4ed8",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px",
                  marginTop: "20px",
                }}
              >
                Notes
              </h2>
              <div style={{ color: "#1f2933", marginTop: "8px" }}>
                {Analysis.notes}
              </div>

              <h2
                style={{
                  color: "#1d4ed8",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "4px",
                  marginTop: "20px",
                }}
              >
                Questions
              </h2>

              {Analysis.questions?.map((q, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "12px",
                    marginTop: "10px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#1d4ed8",
                    }}
                  >
                    Question {i + 1}: {q.q}
                  </div>

                  {openIndex === i && (
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#475569",
                      }}
                    >
                      <strong style={{ color: "#14b8a6" }}>Answer:</strong>{" "}
                      {q.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="setting"
            onClick={() => setShowSetting(!showSetting)}
          >
            {showSetting ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                {" "}
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />{" "}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
              >
                {" "}
                <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />{" "}
              </svg>
            )}
          </button>

          {showSetting ? (
            <form className="timeform" onSubmit={handleSubmit(handleEdit)}>
              <label>Set new Timer (Mins)</label>
              <input
                type="number"
                className="forminput"
                style={{
                  border: "2px solid blue",
                }}
                {...register("mins", { required: true })}
              />
              <input
                type="submit"
                style={{
                  fontSize: "1em",
                }}
                className="authbtn"
                value="Save"
              />
            </form>
          ) : (
            <div>
              <h2 className="monebold" style={{ margin: "1em 0 0 1em" }}>
                Focus Session
              </h2>
              <CircularTimer
                durationInSeconds={seconds}
                setSession={setIsSessionComplete}
                isSession={isSessionComplete}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Focusmode;
