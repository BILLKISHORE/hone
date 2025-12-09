# AI Integration Documentation

## Overview

The AI Clinical Assistant uses OpenAI's GPT-5.1 Chat Latest model to provide intelligent, comprehensive health analysis for patients. The system includes three main AI-powered features:

1. **Patient Health Analysis** - Comprehensive health scoring and risk assessment
2. **Health Trend Analysis** - Longitudinal vital sign trend analysis
3. **Smart Appointment Scheduling** - AI-suggested follow-up appointments

---

## Feature 1: Patient Health Analysis

### API Endpoint

```
GET /api/analyze/{patientId}
```

### Implementation

**File: `lib/aiHealthAnalyzer.ts`**

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

### AI Prompt Structure

The AI receives:
- Complete patient vitals and medical data
- BMI calculation
- Lifestyle factors (smoking, alcohol, physical activity)
- Available lifestyle programs with descriptions
- Structured output format requirements
- Clinical guidelines for scoring and categorization

### Response Format

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
  "recommendedProgramIds": ["PROG001", "PROG002"]
}
```

---

## Feature 2: Health Trend Analysis

### API Endpoints

```
GET /api/history/{patientId}    - Get 6-month vital history
GET /api/trends/{patientId}     - Get AI trend analysis
```

### Implementation

**File: `lib/aiHealthAnalyzer.ts`**

```typescript
class AIHealthAnalyzer {
  async analyzeTrends(history: PatientHistory, patient: PatientData): Promise<TrendAnalysis>
}
```

**Key Features:**
1. Analyzes 6 months of historical vital data
2. Calculates percent change for each vital
3. Identifies improving, stable, or declining trends
4. Generates alerts for concerning patterns
5. Provides overall health trajectory assessment

### Data Structure

**Patient History (`data/patientHistory.ts`):**

```typescript
interface PatientHistory {
  patientId: string;
  bloodPressureSystolic: VitalReading[];
  bloodPressureDiastolic: VitalReading[];
  glucose: VitalReading[];
  weight: VitalReading[];
  hdl: VitalReading[];
  ldl: VitalReading[];
  totalCholesterol: VitalReading[];
  triglycerides: VitalReading[];
}

interface VitalReading {
  date: string;  // ISO date string
  value: number;
}
```

### Response Format

```json
{
  "patientId": "PT001",
  "overallTrend": "improving|stable|declining",
  "trendSummary": "2-3 sentence summary of health trajectory",
  "vitalTrends": [
    {
      "vital": "Blood Pressure Systolic",
      "trend": "improving|stable|declining",
      "percentChange": -4.1,
      "analysis": "Brief analysis of this vital's trend"
    }
  ],
  "alerts": [
    {
      "type": "warning|critical",
      "message": "Alert message for concerning trends"
    }
  ],
  "analysisDate": "2024-12-09T..."
}
```

### Trend Guidelines

- **Improving trends**: LDL, BP, weight, glucose decreasing; HDL increasing
- **Stable trends**: Changes less than 2%
- **Declining trends**: Metrics moving in unhealthy direction
- **Alerts**: Warning for concerning patterns, Critical for dangerous patterns

---

## Feature 3: Smart Appointment Scheduling

### API Endpoints

```
GET /api/appointments                     - List all appointments
GET /api/appointments/{patientId}         - Get patient's appointments
GET /api/appointments/suggest/{patientId} - Get AI appointment suggestion
```

### Implementation

**File: `lib/aiHealthAnalyzer.ts`**

```typescript
class AIHealthAnalyzer {
  async suggestAppointment(
    patient: PatientData,
    analysis: PatientAnalysis,
    trendAnalysis?: TrendAnalysis
  ): Promise<AppointmentSuggestion>
}
```

**Key Features:**
1. Considers patient's risk category
2. Factors in health trend analysis
3. Reviews future risk predictions
4. Applies clinical scheduling guidelines
5. Provides reasoning and factors for suggestion

### Scheduling Guidelines

| Risk Level | Appointment Type | Timeframe |
|------------|-----------------|-----------|
| High-risk | Follow-up | 1-2 weeks |
| Potential-risk | Follow-up | 2-4 weeks |
| Normal | Routine checkup | 2-3 months |
| Declining trends | Earlier appointment | Adjusted based on severity |
| Critical alerts | Urgent | Within 1 week |

### Data Structure

**Appointment (`data/appointments.ts`):**

```typescript
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  scheduledDate: string;
  type: 'follow-up' | 'routine-checkup' | 'urgent' | 'program-review';
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'completed' | 'cancelled';
  aiGenerated: boolean;
  notes?: string;
}
```

### Response Format

```json
{
  "patientId": "PT001",
  "patientName": "John Anderson",
  "suggestedDate": "2024-12-23",
  "suggestedType": "follow-up|routine-checkup|urgent|program-review",
  "priority": "low|medium|high|urgent",
  "reasoning": "2-3 sentence explanation for recommendation",
  "basedOn": ["factor 1", "factor 2", "factor 3"]
}
```

---

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

---

## API Reference Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/patients` | GET | List all patients |
| `/api/patient/{patientId}` | GET | Get patient details |
| `/api/analyze/{patientId}` | GET | AI health analysis |
| `/api/history/{patientId}` | GET | Get 6-month vital history |
| `/api/trends/{patientId}` | GET | AI trend analysis |
| `/api/appointments` | GET | List all appointments |
| `/api/appointments/{patientId}` | GET | Patient's appointments |
| `/api/appointments/suggest/{patientId}` | GET | AI appointment suggestion |

---

## Type Definitions

All types are defined in `types/patient.ts`:

### Core Types
- `PatientData` - Patient vitals and demographics
- `PatientAnalysis` - AI health analysis result
- `HealthScore` - Scores (overall, cardiovascular, metabolic, lifestyle)
- `RiskCategory` - Risk level and description
- `FutureRisk` - Predicted health condition
- `HealthRecommendation` - Actionable health advice
- `LifestyleProgram` - Available intervention programs

### Trend Types
- `VitalReading` - Single vital measurement with date
- `PatientHistory` - 6-month history of all vitals
- `VitalTrend` - Trend analysis for single vital
- `TrendAlert` - Warning/critical alert
- `TrendAnalysis` - Complete trend analysis result

### Appointment Types
- `Appointment` - Scheduled/completed appointment
- `AppointmentSuggestion` - AI-generated suggestion

---

## Sample Data

### Patients (`data/patients.ts`)
6 sample patients with diverse health profiles:
- PT001: John Anderson (45M) - High cardiovascular risk
- PT002: Sarah Mitchell (38F) - Healthy
- PT003: Michael Chen (52M) - Multiple risk factors
- PT004: Emily Rodriguez (29F) - Optimal health
- PT005: Robert Thompson (61M) - Moderate risk
- PT006: Jennifer Park (34F) - Borderline indicators

### Patient History (`data/patientHistory.ts`)
6 months of historical data for all patients with monthly readings.

### Appointments (`data/appointments.ts`)
Sample appointments showing scheduled, completed, and AI-generated appointments.

### Programs (`data/programs.ts`)
7 lifestyle intervention programs targeting various health conditions.

---

## UI Components

### Health Trend Components
- `TrendChartCard.tsx` - Bar charts showing vital trends over time
- `TrendSummaryCard.tsx` - AI trend analysis with alerts

### Appointment Components
- `AppointmentCard.tsx` - Upcoming and past appointments
- `AppointmentSuggestionCard.tsx` - AI suggestion with scheduling

### Existing Components
- `PatientSelector.tsx` - Patient selection grid
- `PatientDetailsCard.tsx` - Complete patient vitals
- `HealthScoreCard.tsx` - Health scores display
- `RiskCategoryCard.tsx` - Risk classification badge
- `FutureRisksCard.tsx` - Predicted health conditions
- `RecommendationsCard.tsx` - Health recommendations
- `ProgramsCard.tsx` - Lifestyle program enrollment

---

## Benefits of AI Integration

1. **Intelligent Analysis**: Considers complex interactions between health factors
2. **Natural Language**: Provides human-readable explanations
3. **Adaptive**: Adjusts recommendations based on patient context
4. **Up-to-date**: Benefits from GPT-5.1's medical knowledge
5. **Personalized**: Tailors advice to individual patient profiles
6. **Comprehensive**: Identifies subtle patterns in health data
7. **Longitudinal**: Tracks health trends over time
8. **Proactive**: Suggests appropriate follow-up timing

---

## Error Handling

The system includes robust error handling:
- API connection errors
- Invalid API key
- Malformed AI responses
- JSON parsing errors
- Rate limiting

All errors are logged and return user-friendly error messages.

---

## Testing

To test the AI integration:

1. Start the development server:
```bash
npm run dev
```

2. Navigate to http://localhost:3000

3. Select any patient

4. The system will call GPT-5.1 API to analyze the patient

5. Results will display with:
   - Health scores and risk category
   - Health trend charts and AI analysis
   - Future risk predictions
   - Personalized recommendations
   - Appointment history and AI suggestions
   - Recommended lifestyle programs
