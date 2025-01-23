import "./assets/styles/App.css";
import ProteinDetector from "./components/ProteinDetector";

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-900 to-indigo-900 text-white font-sans">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">
          Essential Protein Identification of Cancer Using Machine Learning
        </h1>
        <br></br>
        <ProteinDetector />
      </div>
    </main>
  );
}

export default App;
