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

    const prompt = `You are writing a personalized cover letter for a job application following below STANDARDS.

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
  [Address]
  [Postal Code City]
  [Phone Number]
  [Email Address]

  [Company Name]
  [Company Address]
  [Postal Code City]
  
- Below company info: Location and ${formattedDate} on same line
  For French: "Ins, le 5 avril 2026"
  For German: "Ins, 5. April 2026"
  For English: "Ins, April 5, 2026"
  
- Subject line: "Postulation au poste de [Job Title]" or "Candidature pour le poste de [Job Title]"
- Salutation: Use specific name if available (e.g., "Monsieur le Professeur Abdennadher,"), otherwise "Madame, Monsieur,"

5. Make sure there is an empty line between the profile details (name, location, email) and the company details.
6. Make sure there is an empty line after the company details before the formatted date.

7. CONTENT STRUCTURE (You - Me - Us - awaited standard):

PARAGRAPH 1 - YOU (The Company):
- Demonstrate genuine motivation for THIS SPECIFIC company and position
- Show you researched the company (mission, values, projects, market position)
- Explain concretely WHY this opportunity interests you
- Be factual and specific, avoid excessive flattery or generic phrases
- Show understanding of what the company does and stands for

PARAGRAPH 2 - ME (Your Experience):
- Detail your professional experience RELEVANT to this position
- Use ACTIVE VERBS: accomplished, realized, created, supervised, initiated, developed, implemented, managed, designed, achieved
- Write in PRESENT or PAST COMPOUND tense
- Highlight specific achievements with concrete examples
- Use keywords and terms from the job description
- Quantify results when possible (numbers, percentages, scale)

PARAGRAPH 3 - US (Together):
- Show how your skills AND personality match the company needs
- Project yourself into the role: what you can contribute
- Mention medium-term objectives you could pursue in this position
- Demonstrate understanding of how you fit within their team/organization
- End with your availability for an interview

8. CLOSING:
- Professional closing formula tailored to language:
  French: "Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."
  German: "Mit freundlichen Grüssen"
  English: "Sincerely," followed by full name
- Do NOT add signature placeholders like "[Signature]" - the candidate signs by hand

9. STYLE REQUIREMENTS:
- Use POSITIVE vocabulary throughout
- SHORT, CLEAR sentences - one idea per sentence
- Be direct and get to the point quickly
- NO clichés or generic phrases (avoid "passionate about", "team player", "detail-oriented")
- NO abbreviations or technical jargon unless used in the job description
- NO anglicisms in French/German (unless common in IT/finance sectors)
- NO repetitions
- NO emdashes (use commas or separate sentences instead)
- NO placeholders or brackets to fill in later
- Fit on ONE A4 page maximum

10. EXTRACTION FROM CANDIDATE PROFILE:
- Extract the candidate's full name, address, postal code/city, phone, and email from the profile
- Format the location and date according to the language convention
- Extract company name and address from the job description when available
- If company details not provided, use "[Company Name]" and "[Company Address]" as placeholders

Write the complete cover letter now following these comprehensive standards:`;

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
      max_tokens: 2000
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

