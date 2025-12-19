import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { jobTitle, jobDescription, userProfile, language, llmSettings } = await request.json();

    if (!jobTitle || !jobDescription || !userProfile) {
      return NextResponse.json(
        { error: 'Job title, description, and user profile are required' },
        { status: 400 }
      );
    }

    // Use environment defaults if llmSettings are not provided or empty
    const baseUrl = (llmSettings?.baseUrl && llmSettings.baseUrl.trim()) 
      ? llmSettings.baseUrl 
      : process.env.LLM_BASE_URL || 'http://localhost:11434/v1';
    
    const model = (llmSettings?.model && llmSettings.model.trim()) 
      ? llmSettings.model 
      : process.env.LLM_MODEL || 'llama3.2';
    
    const apiKey = (llmSettings?.apiKey && llmSettings.apiKey.trim()) 
      ? llmSettings.apiKey 
      : process.env.LLM_API_KEY || 'ollama';

    if (!baseUrl || !model) {
      return NextResponse.json(
        { error: 'LLM settings are required. Please configure your local LLM in settings or environment variables.' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client with local LLM settings
    const openai = new OpenAI({
      baseURL: baseUrl,
      apiKey: apiKey
    });

    // Format the current date
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Construct the prompt
    const languageInstruction = `Write the cover letter in ${language}.`;

    const prompt = `You are writing a personalized cover letter for a job application.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate Profile:
${userProfile}

Current Date: ${formattedDate}

${languageInstruction}

CRITICAL Instructions for writing:
1. The motivation letter should be personal in such a way that it demonstrates genuine motivation to work for THIS SPECIFIC COMPANY and position.
2. The letter should sound human and professional.
3. DO NOT include any emdash in the letter.
4. Extract the candidate's full name, location, and email from the Candidate Profile and format them at the very top as:
   [Full Name]
   [Location]
   [Email]
   
   ${formattedDate}
   
   [Company Name]
   [Company Location - extract from job description]
   
   [Greeting and letter body...]

5. Make sure there is an empty line between the profile details (name, location, email) and the date.
6. Make sure there is an empty line after the date before the company information.
7. Use the exact date provided: ${formattedDate}

Write the complete cover letter now with the candidate's contact information at the top:`;

    // Generate cover letter using local LLM
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional cover letter writer who creates personalized, human-sounding cover letters that avoid clichés and generic AI language. You write complete, ready-to-send letters with no placeholders or blanks to fill in.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    const coverLetterText = completion.choices[0].message.content;

    // Return cover letter text as JSON
    return NextResponse.json({
      coverLetter: coverLetterText
    });

  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter: ' + error.message },
      { status: 500 }
    );
  }
}

