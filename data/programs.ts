import { LifestyleProgram } from '@/types/patient';

export const lifestylePrograms: LifestyleProgram[] = [
  {
    id: 'PROG001',
    name: 'Cardiovascular Health Program',
    description: 'Comprehensive program focusing on heart health through diet, exercise, and stress management',
    targetConditions: ['hypertension', 'high-cholesterol', 'cardiovascular-risk'],
    duration: '12 weeks',
  },
  {
    id: 'PROG002',
    name: 'Diabetes Management Program',
    description: 'Specialized program for managing blood sugar levels through nutrition and lifestyle modifications',
    targetConditions: ['diabetes', 'prediabetes', 'metabolic-syndrome'],
    duration: '16 weeks',
  },
  {
    id: 'PROG003',
    name: 'Weight Management & Nutrition',
    description: 'Personalized nutrition and weight loss program with meal planning and dietary guidance',
    targetConditions: ['obesity', 'overweight', 'metabolic-syndrome'],
    duration: '12 weeks',
  },
  {
    id: 'PROG004',
    name: 'Smoking Cessation Program',
    description: 'Evidence-based program to help quit smoking with behavioral support and coping strategies',
    targetConditions: ['smoking', 'cardiovascular-risk', 'respiratory-issues'],
    duration: '8 weeks',
  },
  {
    id: 'PROG005',
    name: 'Fitness & Physical Activity',
    description: 'Structured exercise program designed to improve cardiovascular fitness and overall health',
    targetConditions: ['sedentary-lifestyle', 'cardiovascular-risk', 'obesity'],
    duration: '10 weeks',
  },
  {
    id: 'PROG006',
    name: 'Alcohol Reduction Program',
    description: 'Support program for reducing alcohol consumption and developing healthier habits',
    targetConditions: ['alcohol-dependency', 'liver-health', 'metabolic-issues'],
    duration: '12 weeks',
  },
  {
    id: 'PROG007',
    name: 'Preventive Wellness Program',
    description: 'Holistic wellness program for maintaining good health and preventing chronic diseases',
    targetConditions: ['general-wellness', 'prevention'],
    duration: '8 weeks',
  },
];
