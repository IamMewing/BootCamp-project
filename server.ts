import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { HYDERABAD_AUTHORITIES } from './src/data/authorities.js';
import { SAMPLE_CIVIC_ISSUES } from './src/data/sampleIssues.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '20mb' }));

const PORT = process.env.PORT || 3000;

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: Analyze Civic Issue Image
app.post('/api/analyze-issue', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', location, sampleId } = req.body;

    // Check if user requested a sample issue
    if (sampleId) {
      const sample = SAMPLE_CIVIC_ISSUES.find((s) => s.id === sampleId);
      if (sample) {
        return res.json({
          success: true,
          analysis: {
            ...sample.analysis,
            isDemoFallback: false,
          },
        });
      }
    }

    // If Gemini client is available and image exists
    if (ai && imageBase64) {
      try {
        // Strip data URL prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const prompt = `Analyze this image of a civic/public infrastructure problem.
Context location: City: ${location?.city || 'Hyderabad'}, Street/Area: ${location?.street || 'Unknown'}, Landmark: ${location?.landmark || 'None'}.

Rules:
1. Identify the primary type of civic issue from these exact categories: 'Road Damage / Pothole', 'Garbage / Waste Overflow', 'Water Supply / Leakage', 'Broken Streetlight', 'Drainage / Sewage Issue', 'Traffic / Footpath Hazard', 'Parks / Public Property', 'Other Civic Issue'.
2. Rate severity: 'Low', 'Medium', 'High', or 'Critical'.
3. State strictly visible visual evidence facts (what is seen in the photo).
4. Explain potential public safety or civic implications based on visible evidence.
5. Provide a neutral 2-3 sentence concise description.
6. Provide brief investigation notes and suggested municipal action.
7. Do not invent exact measurements, dates, or non-visible details.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                issueType: {
                  type: Type.STRING,
                  description: 'Category of the civic issue',
                },
                severity: {
                  type: Type.STRING,
                  description: 'Severity: Low, Medium, High, Critical',
                },
                confidenceScore: {
                  type: Type.NUMBER,
                  description: 'Confidence between 0.5 and 1.0',
                },
                visualEvidence: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of observed facts from image',
                },
                safetyImplications: {
                  type: Type.STRING,
                  description: 'Public safety & community risk',
                },
                conciseDescription: {
                  type: Type.STRING,
                  description: 'Neutral description of problem',
                },
                investigationNotes: {
                  type: Type.STRING,
                  description: 'Key technical aspects for inspectors',
                },
                suggestedAction: {
                  type: Type.STRING,
                  description: 'Recommended municipal repair response',
                },
              },
              required: [
                'issueType',
                'severity',
                'visualEvidence',
                'safetyImplications',
                'conciseDescription',
                'investigationNotes',
                'suggestedAction',
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            analysis: {
              ...parsed,
              confidenceScore: parsed.confidenceScore || 0.9,
              isDemoFallback: false,
            },
          });
        }
      } catch (aiErr) {
        console.warn('Gemini vision analysis failed or rate limited, falling back gracefully:', aiErr);
      }
    }

    // Graceful Demo Fallback if API key missing or AI call fails
    return res.json({
      success: true,
      analysis: {
        issueType: 'Road Damage / Pothole',
        severity: 'High',
        confidenceScore: 0.88,
        visualEvidence: [
          'Visible road surface asphalt erosion with exposed underlying gravel layer.',
          'Uneven road depression situated within the active transit lane.',
          'Surrounding asphalt cracking indicating sub-base deterioration.'
        ],
        safetyImplications: 'Hazardous for two-wheelers, cyclists, and cars during peak commute hours, especially during poor lighting or rain.',
        conciseDescription: 'Significant asphalt pothole depression detected on the road surface near the provided landmark. Bitumen patch repair recommended.',
        investigationNotes: 'Inspect asphalt binding depth and drainage flow to prevent recurrent water erosion.',
        suggestedAction: 'Dispatch municipal maintenance crew for cold-mix bitumen patching and surface leveling.',
        isDemoFallback: true,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-issue:', error);
    res.status(500).json({ success: false, error: error.message || 'Analysis failed' });
  }
});

// Endpoint: Generate Formal Complaint
app.post('/api/generate-complaint', async (req, res) => {
  try {
    const { analysis, location, userNotes, authorityName = 'Greater Hyderabad Municipal Corporation (GHMC)' } = req.body;

    if (ai) {
      try {
        const prompt = `Draft an official, respectful, highly clear civic grievance complaint letter for municipal authorities in India.
Target Authority: ${authorityName}
Issue Category: ${analysis?.issueType || 'Civic Infrastructure Problem'}
Severity: ${analysis?.severity || 'High'}
Location Details: City: ${location?.city || 'Hyderabad'}, Area: ${location?.area || 'Local Area'}, Street: ${location?.street || 'Main Road'}, Landmark: ${location?.landmark || 'Near prominent junction'}.
Observed Evidence: ${JSON.stringify(analysis?.visualEvidence || [])}
Safety Impact: ${analysis?.safetyImplications || ''}
User additional notes: ${userNotes || 'None'}

Formatting rules:
- Subject line must start with '[URGENT ATTENTION REQUIRED] Civic Grievance:'
- Body must be written in a professional, respectful, formal civic tone.
- Include exact location, landmark, observed facts, safety hazard, and respectful request for inspection & resolution.
- Format body with proper paragraphs and clear salutations.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                formalBody: { type: Type.STRING },
                summary: { type: Type.STRING },
                safetyImpact: { type: Type.STRING },
              },
              required: ['subject', 'formalBody', 'summary', 'safetyImpact'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            complaint: {
              subject: parsed.subject,
              category: analysis?.issueType || 'Road Damage / Pothole',
              severity: analysis?.severity || 'High',
              summary: parsed.summary,
              locationDetails: `${location?.street || 'Road'}, ${location?.area || ''}, ${location?.city || 'Hyderabad'}`,
              landmark: location?.landmark || 'Local Landmark',
              formalBody: parsed.formalBody,
              safetyImpact: parsed.safetyImpact,
              suggestedAuthority: authorityName,
              dateGenerated: new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            },
          });
        }
      } catch (err) {
        console.warn('Gemini complaint generation failed, using structured fallback:', err);
      }
    }

    // Structured Fallback for Complaint Generation
    const landmarkStr = location?.landmark ? ` (Landmark: ${location.landmark})` : '';
    const fullLocStr = `${location?.street || 'Street Road'}, ${location?.area || 'Area'}, ${location?.city || 'Hyderabad'}${landmarkStr}`;

    const fallbackBody = `To,
The Competent Authority,
${authorityName},
${location?.city || 'Hyderabad'}.

Subject: ${analysis?.issueType || 'Civic Infrastructure Problem'} at ${fullLocStr}

Respected Sir/Madam,

I am writing to formally bring to your urgent attention a serious public infrastructure issue observed at the following location:

Exact Location: ${fullLocStr}
Category of Issue: ${analysis?.issueType || 'Road / Municipal Issue'}
Observed Condition: ${analysis?.conciseDescription || 'Severe infrastructure damage requiring repair.'}

Visual Evidence Summary:
${(analysis?.visualEvidence || ['Visible erosion/damage on site.']).map((e: string) => `• ${e}`).join('\n')}

Safety Risk & Community Impact:
${analysis?.safetyImplications || 'Poses a safety hazard to daily commuters and pedestrians.'}

In the interest of public safety and municipal maintenance, I respectfully request the department to inspect this site at the earliest and initiate appropriate corrective action.

Thanking you,
A Concerned Citizen
Location: ${location?.city || 'Hyderabad'}`;

    return res.json({
      success: true,
      complaint: {
        subject: `[URGENT ATTENTION REQUIRED] Civic Grievance: ${analysis?.issueType || 'Civic Issue'} at ${location?.area || 'Local Area'}`,
        category: analysis?.issueType || 'Road Damage / Pothole',
        severity: analysis?.severity || 'High',
        summary: `Formal grievance regarding ${analysis?.issueType || 'civic issue'} at ${location?.area || 'local area'}, requiring inspection by ${authorityName}.`,
        locationDetails: fullLocStr,
        landmark: location?.landmark || 'Near Main Junction',
        formalBody: fallbackBody,
        safetyImpact: analysis?.safetyImplications || 'Safety risk to commuters.',
        suggestedAuthority: authorityName,
        dateGenerated: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    });
  } catch (error: any) {
    console.error('Error in /api/generate-complaint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Authorities List
app.get('/api/authorities', (_req, res) => {
  res.json({ success: true, authorities: HYDERABAD_AUTHORITIES });
});

// Vite middleware for dev or static serving for prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = (await import('fs')).readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`CivicSnap server listening on port ${PORT}`);
});
