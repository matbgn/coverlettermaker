'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    resume: null,
    language: 'English'
  });
  const [jobData, setJobData] = useState({
    jobTitle: '',
    jobDescription: '',
    userProfile: ''
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedResumeName, setSavedResumeName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [llmSettings, setLlmSettings] = useState({
    baseUrl: '',
    model: '',
    apiKey: ''
  });

  // Load saved resume and LLM settings from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('resumeName');
    if (savedName) {
      setSavedResumeName(savedName);
    }

    const savedLlmSettings = localStorage.getItem('llmSettings');
    if (savedLlmSettings) {
      setLlmSettings(JSON.parse(savedLlmSettings));
    }
  }, []);

  const handleRemoveResume = () => {
    localStorage.removeItem('resumeData');
    localStorage.removeItem('resumeName');
    setSavedResumeName('');
    setFormData({ ...formData, resume: null });
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let resumeData;
      
      // Check if we need to upload a new resume or use cached data
      if (formData.resume) {
        // Upload and parse new resume
        const resumeFormData = new FormData();
        resumeFormData.append('resume', formData.resume);
        
        const resumeResponse = await fetch('/api/parse-resume', {
          method: 'POST',
          body: resumeFormData
        });
        
        if (!resumeResponse.ok) throw new Error('Failed to parse resume');
        resumeData = await resumeResponse.json();
        
        // Save resume data and name to localStorage
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        localStorage.setItem('resumeName', formData.resume.name);
        setSavedResumeName(formData.resume.name);
      } else if (savedResumeName) {
        // Use cached resume data
        const cachedData = localStorage.getItem('resumeData');
        if (cachedData) {
          resumeData = JSON.parse(cachedData);
        } else {
          throw new Error('Please upload a resume');
        }
      } else {
        throw new Error('Please upload a resume');
      }

      setJobData({
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        userProfile: resumeData.profile || ''
      });
      
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLetter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobData,
          language: formData.language,
          llmSettings
        })
      });

      if (!response.ok) throw new Error('Failed to generate cover letter');
      
      const data = await response.json();
      setCoverLetter(data.coverLetter);
      
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('llmSettings', JSON.stringify(llmSettings));
    setShowSettings(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      // Show success message briefly
      const originalError = error;
      setError('');
      // You could add a success state here if you want
      alert('Cover letter copied to clipboard!');
    } catch (err) {
      setError('Failed to copy to clipboard: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 text-center">
                Cover Letter Maker
              </h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              title="Settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-center mb-8">
            Create personalized cover letters in seconds
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  placeholder="Paste the job description here..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF)
                </label>
                
                {(formData.resume || savedResumeName) ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        {formData.resume ? formData.resume.name : savedResumeName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    id="resume"
                    required
                    accept=".pdf"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 text-gray-700 placeholder:text-gray-500"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFormData({ ...formData, resume: e.target.files[0] });
                      }
                    }}
                  />
                )}
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language for Cover Letter
                </label>
                <select
                  id="language"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="Arabic">Arabic</option>
                  <option value="Chinese">Chinese</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleGenerateLetter} className="space-y-6">
              <div>
                <label htmlFor="userProfile" className="block text-sm font-medium text-gray-700 mb-2">
                  User Profile
                </label>
                <textarea
                  id="userProfile"
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  value={jobData.userProfile}
                  onChange={(e) => setJobData({ ...jobData, userProfile: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="language-step2" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language-step2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="Arabic">Arabic</option>
                  <option value="Chinese">Chinese</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Continue'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono text-sm text-gray-900"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Review and edit your cover letter before copying.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                >
                  Copy to Clipboard
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setCoverLetter('');
                    setError('');
                  }}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
                >
                  Create New Letter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">LLM Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Base URL (Optional)
                  </label>
                  <input
                    type="text"
                    id="baseUrl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                    placeholder="http://localhost:11434/v1"
                    value={llmSettings.baseUrl}
                    onChange={(e) => setLlmSettings({ ...llmSettings, baseUrl: e.target.value })}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    The base URL of your local LLM server. Leave empty to use environment defaults.
                  </p>
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                    Model Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="model"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                    placeholder="llama3.2"
                    value={llmSettings.model}
                    onChange={(e) => setLlmSettings({ ...llmSettings, model: e.target.value })}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    The model name/identifier. Leave empty to use environment defaults.
                  </p>
                </div>

                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key (Optional)
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                    placeholder="ollama"
                    value={llmSettings.apiKey}
                    onChange={(e) => setLlmSettings({ ...llmSettings, apiKey: e.target.value })}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    API key if required by your LLM server (use any value for Ollama)
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Supported LLM Servers:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Ollama:</strong> http://localhost:11434/v1</li>
                    <li>• <strong>LM Studio:</strong> http://localhost:1234/v1</li>
                    <li>• <strong>vLLM:</strong> http://localhost:8000/v1</li>
                    <li>• <strong>LocalAI:</strong> http://localhost:8080/v1</li>
                    <li>• Any OpenAI-compatible API endpoint</li>
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        <div className="max-w-3xl mx-auto px-4 py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            © {new Date().getFullYear()} Cover Letter Maker. Open source and 100% free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
            <a
              href="https://github.com/stanleyume/coverlettermaker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              GitHub
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="https://www.coverlettermaker.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 transition"
            >
              Advanced version
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

