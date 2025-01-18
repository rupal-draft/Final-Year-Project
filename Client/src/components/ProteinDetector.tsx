import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import dnaImage from '../assets/dna-structure.jpg';

function ProteinDetector() {
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
      setResult(data.result);
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
          className="text-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold py-6 px-12 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Predict Protein
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-teal-800">
                  Enter Protein Sequence
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <textarea
                  value={sequence}
                  onChange={(e) => setSequence(e.target.value)}
                  placeholder="Enter the protein sequence here..."
                  className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-teal-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Detect Protein"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 relative z-10"
          >
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-4 text-teal-800">
                  Detection Result
                </h2>
                <div className="bg-teal-50 p-4 rounded-md">
                  <p className="text-xl text-teal-900">{result}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProteinDetector;
