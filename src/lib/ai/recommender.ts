import { EventItem, RecommendationResult } from '@/types';
import { getEligibleUpcomingEvents } from '../data/store';

export interface StudentProfileInput {
  department?: string;
  skills: string[];
  interests: string[];
  careerGoals?: string;
}

export async function recommendOpportunitiesForStudent(
  profile: StudentProfileInput
): Promise<RecommendationResult[]> {
  const { events } = getEligibleUpcomingEvents();

  // If AI Gateway or Gemini Key is provided, we can call it; otherwise or as robust fallback,
  // we execute our intelligent semantic skill & career trajectory analysis.
  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Structure prompt for AI model via Gemini / AI Gateway
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are an expert academic advisor and career strategist at IUBAT (International University of Business Agriculture and Technology), Dhaka, Bangladesh.
Given the student profile:
- Department: ${profile.department || 'Undergraduate'}
- Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}
- Career Goals: ${profile.careerGoals || 'Not specified'}

Evaluate these upcoming opportunities and return a JSON array ranking the top matches.
Upcoming Events:
${JSON.stringify(
  events.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    venue: e.venue_name,
    description: e.description.slice(0, 200),
  }))
)}

Output strictly valid JSON with this format:
[
  {
    "eventId": "evt-001",
    "matchScore": 95,
    "reasons": ["Reason 1", "Reason 2"],
    "skillAlignment": ["skill 1", "skill 2"]
  }
]`,
              },
            ],
          },
        ],
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        const cleaned = rawText?.replace(/```json/g, '').replace(/```/g, '').trim();
        if (cleaned) {
          const parsed = JSON.parse(cleaned);
          const results: RecommendationResult[] = [];
          for (const item of parsed) {
            const ev = events.find((e) => e.id === item.eventId);
            if (ev) {
              results.push({
                event: ev,
                matchScore: item.matchScore,
                reasons: item.reasons || [],
                skillAlignment: item.skillAlignment || [],
              });
            }
          }
          if (results.length > 0) {
            return results.sort((a, b) => b.matchScore - a.matchScore);
          }
        }
      }
    } catch {
      // Fallback to intelligent deterministic matching
    }
  }

  // High-performance intelligent deterministic semantic matching engine
  const results: RecommendationResult[] = events.map((event) => {
    let score = 50; // baseline
    const reasons: string[] = [];
    const skillAlignment: string[] = [];

    const textToMatch = `${event.title} ${event.description} ${event.category} ${event.venue_name}`.toLowerCase();
    const dept = (profile.department || '').toLowerCase();
    const goals = (profile.careerGoals || '').toLowerCase();

    // 1. Department affinity matching
    if (dept.includes('cse') || dept.includes('computer') || dept.includes('software')) {
      if (['Hackathons & Contests', 'Workshops & Training'].includes(event.category)) {
        score += 25;
        reasons.push('Directly matches IUBAT CSE technical problem solving and software innovation tracks');
      }
      if (textToMatch.includes('hackathon') || textToMatch.includes('code') || textToMatch.includes('ai')) {
        score += 15;
      }
    } else if (dept.includes('bba') || dept.includes('business') || dept.includes('economics')) {
      if (['Career & Networking', 'University & Club'].includes(event.category)) {
        score += 25;
        reasons.push('Elevates strategic corporate networking and business case presentation skills');
      }
      if (textToMatch.includes('case') || textToMatch.includes('summit') || textToMatch.includes('business')) {
        score += 15;
      }
    } else if (dept.includes('agri') || dept.includes('agriculture')) {
      if (textToMatch.includes('agri') || textToMatch.includes('green') || textToMatch.includes('sustainable')) {
        score += 35;
        reasons.push('Exceptional alignment with IUBAT Sustainable Agriculture & Green Technology research');
      }
    } else if (dept.includes('tourism') || dept.includes('hospitality')) {
      if (textToMatch.includes('tourism') || textToMatch.includes('hotel') || textToMatch.includes('hospitality')) {
        score += 35;
        reasons.push('Direct pipeline for hospitality leadership and industry recruitment');
      }
    } else if (dept.includes('eee') || dept.includes('robotics') || dept.includes('me')) {
      if (textToMatch.includes('robotics') || textToMatch.includes('iot') || textToMatch.includes('sumo')) {
        score += 35;
        reasons.push('Hands-on hardware, embedded circuits, and autonomous systems showcase');
      }
    }

    // 2. Skill matches
    for (const skill of profile.skills) {
      const s = skill.toLowerCase().trim();
      if (!s) continue;
      if (textToMatch.includes(s)) {
        score += 12;
        skillAlignment.push(skill);
      }
    }

    if (skillAlignment.length > 0) {
      reasons.push(`Directly utilizes your verified skills in: ${skillAlignment.slice(0, 3).join(', ')}`);
    }

    // 3. Career goals matching
    if (goals) {
      const goalKeywords = goals.split(/\s+/).filter((w) => w.length > 3);
      let goalMatched = false;
      for (const word of goalKeywords) {
        if (textToMatch.includes(word)) {
          goalMatched = true;
          break;
        }
      }
      if (goalMatched) {
        score += 10;
        reasons.push('Supports your stated long-term career ambition');
      }
    }

    // 4. Campus presence bonus for IUBAT students
    if (event.venue_name.toLowerCase().includes('iubat')) {
      score += 8;
      reasons.push('Convenient on-campus event at IUBAT Uttara campus');
    }

    // Normalize score to max 98%
    const finalScore = Math.min(Math.max(score, 45), 98);

    if (reasons.length === 0) {
      reasons.push('Offers broad extracurricular enrichment and networking value across disciplines');
    }

    return {
      event,
      matchScore: finalScore,
      reasons,
      skillAlignment,
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
