# Cover Letter Maker

<div align="center">

**A 100% free, open-source cover letter generator powered by local AI**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/stanleyume/coverlettermaker/pulls)

[Features](#features) • [Quick Start](#quick-start) • [Usage](#usage) • [Configuration](#configuration)

</div>

---

## Overview

Cover Letter Maker is a Next.js web application that generates personalized cover letters using AI. It runs entirely on your local machine with your own LLM - no API keys, no subscriptions, no data sent to external servers.

Simply provide job details and your resume, and the app will create a tailored, professional cover letter ready to copy and use.

## Features

- 🏠 **100% Local & Private**: Works with any OpenAI-compatible local LLM (Ollama, LM Studio, vLLM, etc.)
- 🔒 **Privacy First**: Your data never leaves your machine
- 📄 **Smart Resume Parsing**: Automatically extracts your profile information from PDF resumes
- 🤖 **AI-Powered**: Generates personalized, human-sounding cover letters
- 🌍 **Multi-language Support**: Supports 10 languages including English, German, French, Spanish, Chinese, and more
- 📋 **Copy to Clipboard**: Instantly copy your cover letter with one click
- ✏️ **Fully Editable**: Review and edit everything before copying
- ⚙️ **Easy Configuration**: Simple settings modal for LLM configuration with environment variable defaults
- 💾 **Resume Caching**: Upload your resume once, use it for multiple applications
- 🎨 **Modern UI**: Clean, responsive design built with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A local LLM server (see [LLM Setup](#llm-setup) below)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/stanleyume/coverlettermaker.git
cd coverlettermaker
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables (optional)**

```bash
cp env.example .env
```

Edit `.env` to set default LLM settings:

```env
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=llama3.2
LLM_API_KEY=ollama
```

4. **Run the development server**

```bash
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## LLM Setup

You need a local LLM server running with an OpenAI-compatible API. Choose one:

### Option A: Ollama (Recommended)

```bash
# Install Ollama from https://ollama.ai

# Pull a model
ollama pull llama3.2

# Ollama automatically runs on http://localhost:11434
```

### Option B: LM Studio

1. Download [LM Studio](https://lmstudio.ai)
2. Download a model from the UI
3. Start the local server (default: `http://localhost:1234`)

### Option C: vLLM

```bash
pip install vllm
vllm serve <model-name> --api-key token-abc123
# Default endpoint: http://localhost:8000
```

### Other Options

- **LocalAI**: `http://localhost:8080/v1`
- **text-generation-webui**: With OpenAI extension enabled
- Any other OpenAI-compatible endpoint

## Usage

### Step 1: Enter Job Details

1. Enter the **Job Title** you're applying for
2. Paste the **Job Description**
3. Upload your **Resume** (PDF format) - it will be cached for future use
4. Select your preferred **Language** for the cover letter
5. Click **Continue**

### Step 2: Review Profile Information

The app automatically extracts your profile information from your resume.

- Review and edit the **User Profile** text
- Confirm or change the **Language**
- Click **Continue** to generate

### Step 3: Review & Copy

The AI generates a personalized cover letter with:

- Your contact information at the top (name, location, email)
- Current date
- Company information
- Professional greeting and body

**What you get:**
- ✅ Personalized and specific to the company and position
- ✅ Natural, human-sounding language
- ✅ No clichés or generic AI phrases
- ✅ No placeholders - ready to use immediately
- ✅ Proper formatting with correct spacing

**Actions:**
- Edit the cover letter if needed
- Click **Copy to Clipboard** to copy the text
- Click **Create New Letter** to start another application

## Configuration

### UI Settings

Click the settings icon (⚙️) in the top-right corner to configure:

- **Base URL**: Your LLM server endpoint (e.g., `http://localhost:11434/v1`)
- **Model Name**: The model to use (e.g., `llama3.2`, `mistral`, `qwen2.5`)
- **API Key**: Optional, use any value for Ollama

Settings are saved in your browser's localStorage.

### Environment Variables

Set defaults in `.env` file (optional):

```env
# LLM Configuration
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=llama3.2
LLM_API_KEY=ollama
```

If you leave the UI settings empty, the app will use these environment defaults.

## Supported Languages

- 🇬🇧 English
- 🇩🇪 German
- 🇫🇷 French
- 🇪🇸 Spanish
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇨🇳 Chinese
- 🇯🇵 Japanese
- 🇸🇦 Arabic
- 🇮🇳 Hindi

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI**: Local LLM via OpenAI-compatible API
- **PDF Parsing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **Runtime**: Node.js

## Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:3000`

## Troubleshooting

### LLM Connection Errors

- Ensure your local LLM server is running
- Verify the base URL is correct in settings
- Check that the model name matches an available model
- For Ollama: Run `ollama list` to see available models

### Resume Parsing Issues

- Ensure your resume is a valid PDF file
- Use PDFs with selectable text (not scanned images)
- Try re-uploading the resume

### Poor Quality Output

- Try a different model (recommended: llama3.2, mistral, qwen2.5)
- Ensure your resume has detailed information
- Provide a comprehensive job description
- Edit the extracted profile information before generating

### Settings Not Saving

- Check browser localStorage permissions
- Try clearing browser cache and re-entering settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the Sustainable Use License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by local LLMs via [OpenAI-compatible APIs](https://platform.openai.com/docs/api-reference)

## Support

- 🐛 [Report a bug](https://github.com/stanleyume/coverlettermaker/issues)
- 💡 [Request a feature](https://github.com/stanleyume/coverlettermaker/issues)
- 💬 [Ask a question](https://github.com/stanleyume/coverlettermaker/discussions)

## Related Projects

Looking for more features? Check out [Cover Letter Maker Pro](https://www.coverlettermaker.co) for the advanced version.

---

<div align="center">

Made with ❤️ by [Stanley Ume](https://github.com/stanleyume)

⭐ Star this repo if you find it helpful!

</div>
