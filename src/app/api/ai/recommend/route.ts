import { NextResponse } from 'next/server';
import { recommendOpportunitiesForStudent } from '@/lib/ai/recommender';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, skills, interests, careerGoals } = body;

    const recommendations = await recommendOpportunitiesForStudent({
      department: department || '',
      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
      careerGoals: careerGoals || '',
    });

    return NextResponse.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI recommendations', details: String(error) },
      { status: 500 }
    );
  }
}
