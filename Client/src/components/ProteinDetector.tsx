"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import HealthyCells from "./../assets/Cellular-Health.jpg";
import CancerousCells from "./../assets/cancer_dev.jpg";

export default function ProteinDetector() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sequence, setSequence] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/detect-protein", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sequence }),
      });
      const data = await response.json();
      setResult(data.predictions);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing the sequence.");
    }
    setLoading(false);
    setIsModalOpen(false);
  };
  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/25626587/pexels-photo-25626587/free-photo-of-ai-generated-shapes.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="DNA Structure"
          className="w-full h-full object-cover filter brightness-50 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-900 opacity-70"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-2xl px-12 py-6 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Predict Protein
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-teal-800">
                    Enter Protein Sequence
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <textarea
                    value={sequence}
                    onChange={(e) => setSequence(e.target.value)}
                    placeholder="Enter the protein sequence here..."
                    className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Detect Protein"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <button
                onClick={() => setResult(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="flex justify-center mb-6"
                >
                  {result[0] === "NEGATIVE" || result === "NEGATIVE" ? (
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
                      />
                      <svg
                        className="w-24 h-24 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                      />
                      <svg
                        className="w-24 h-24 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold mb-4">
                    {result[0] === "NEGATIVE" || result === "NEGATIVE" ? (
                      <span className="text-green-600">Low Risk Detected</span>
                    ) : (
                      <span className="text-red-600">High Risk Detected</span>
                    )}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {result[0] === "NEGATIVE" || result === "NEGATIVE"
                      ? "Based on the protein sequence analysis, there is a very low probability of cancer detection. However, please consult with healthcare professionals for a comprehensive evaluation."
                      : "The protein sequence analysis indicates a higher risk. It's crucial to consult with healthcare professionals immediately for further examination and proper medical advice."}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex justify-center"
                >
                  <div className="relative w-full max-w-sm">
                    <motion.div
                      className="absolute inset-0 blur-xl"
                      style={{
                        background:
                          result[0] === "NEGATIVE" || result === "NEGATIVE"
                            ? "radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(255,255,255,0) 70%)"
                            : "radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(255,255,255,0) 70%)",
                      }}
                    />
                    <img
                      src={
                        result[0] === "NEGATIVE" || result === "NEGATIVE"
                          ? HealthyCells
                          : CancerousCells
                      }
                      alt={
                        result[0] === "NEGATIVE" || result === "NEGATIVE"
                          ? "Healthy cells visualization"
                          : "Abnormal cells visualization"
                      }
                      className="rounded-lg shadow-lg w-full relative z-10"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
