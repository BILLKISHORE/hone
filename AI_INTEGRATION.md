# AI Integration Documentation

## Overview

The AI Clinical Assistant now uses OpenAI's GPT-5.1 Chat Latest model to provide intelligent, comprehensive health analysis for patients.

## What Changed

### Before (Rule-Based System)
- Used hardcoded algorithms in `healthAnalyzer.ts`
- Fixed scoring formulas
- Predefined risk thresholds
- Static recommendations

### After (AI-Powered System)
- Uses GPT-5.1 Chat Latest model
- Intelligent, context-aware analysis
- Dynamic scoring based on comprehensive assessment
- Personalized recommendations
- Natural language understanding of medical data

## Implementation Details

### File: `lib/aiHealthAnalyzer.ts`

This new service class handles all AI-powered analysis:

```typescript
class AIHealthAnalyzer {
  async analyzePatient(patient: PatientData): Promise<PatientAnalysis>
}
```

**Key Features:**
1. Formats patient data into a comprehensive prompt
2. Includes all lifestyle programs in context
3. Requests structured JSON response
4. Uses GPT-5.1 with temperature 0.7
5. Validates and parses AI response
6. Maps program IDs to full program objects

### API Endpoint Update

**File: `app/api/analyze/[patientId]/route.ts`**

Changed from:
```typescript
const analyzer = new HealthAnalyzer();
const analysis = analyzer.analyzePatient(patient);
```

To:
```typescript
const analyzer = new AIHealthAnalyzer();
const analysis = await analyzer.analyzePatient(patient);
```

Note: Now returns a Promise (async/await)

## AI Prompt Structure

The AI receives:
- Complete patient vitals and medical data
- BMI calculation
- Lifestyle factors
- Available lifestyle programs with descriptions
- Structured output format requirements
- Clinical guidelines for scoring and categorization

## AI Response Format

The AI returns structured JSON with:

```json
{
  "healthScore": {
    "overall": 0-100,
    "cardiovascular": 0-100,
    "metabolic": 0-100,
    "lifestyle": 0-100
  },
  "riskCategory": {
    "level": "normal|potential-risk|high-risk",
    "description": "detailed explanation"
  },
  "futureRisks": [
    {
      "condition": "condition name",
      "probability": "low|moderate|high",
      "timeframe": "timeframe",
      "description": "detailed explanation"
    }
  ],
  "recommendations": [
    {
      "category": "category",
      "priority": "low|medium|high",
      "recommendation": "specific actionable recommendation"
    }
  ],
  "recommendedProgramIds": ["PROG001", "PROG002", ...]
}
```

## Configuration

### Environment Variables

Required in `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Model Configuration

- **Model**: `gpt-5.1-chat-latest`
- **Temperature**: 0.7
- **Response Format**: JSON object
- **System Role**: Clinical health analyst

## Benefits of AI Integration

1. **Intelligent Analysis**: Considers complex interactions between health factors
2. **Natural Language**: Provides human-readable explanations
3. **Adaptive**: Adjusts recommendations based on patient context
4. **Up-to-date**: Benefits from GPT-5.1's medical knowledge
5. **Personalized**: Tailors advice to individual patient profiles
6. **Comprehensive**: Identifies subtle patterns in health data

## Testing

To test the AI integration:

1. Start the development server:
```bash
npm run dev
```

2. Navigate to http://localhost:3000

3. Select any patient

4. The system will call GPT-5.1 API to analyze the patient

5. Results will display with AI-generated insights

## API Costs

Approximate cost per patient analysis:
- Input tokens: 500-800 tokens (~$0.005-0.008)
- Output tokens: 400-600 tokens (~$0.008-0.012)
- **Total per analysis**: ~$0.01-0.02

Based on GPT-5.1 pricing (estimates may vary)

## Error Handling

The system includes robust error handling:
- API connection errors
- Invalid API key
- Malformed AI responses
- JSON parsing errors
- Rate limiting

All errors are logged and return user-friendly error messages.

## Future Enhancements

Potential improvements:
1. Add caching to reduce API calls
2. Implement streaming responses for real-time feedback
3. Add conversation history for follow-up questions
4. Include medical literature citations
5. Support multiple language outputs
6. Add confidence scores to predictions
