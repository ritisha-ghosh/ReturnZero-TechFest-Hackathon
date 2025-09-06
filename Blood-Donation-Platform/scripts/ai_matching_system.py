import json
import math
from datetime import datetime, timedelta
import random

class BloodDonationAI:
    def __init__(self):
        self.blood_compatibility = {
            'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
            'O+': ['O+', 'A+', 'B+', 'AB+'],
            'A-': ['A-', 'A+', 'AB-', 'AB+'],
            'A+': ['A+', 'AB+'],
            'B-': ['B-', 'B+', 'AB-', 'AB+'],
            'B+': ['B+', 'AB+'],
            'AB-': ['AB-', 'AB+'],
            'AB+': ['AB+']
        }
        
    def calculate_distance(self, donor_coords, recipient_coords):
        """Calculate distance between two coordinates using Haversine formula"""
        lat1, lon1 = donor_coords
        lat2, lon2 = recipient_coords
        
        R = 6371  # Earth's radius in kilometers
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat/2) * math.sin(dlat/2) + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(dlon/2) * math.sin(dlon/2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance = R * c
        
        return distance
    
    def match_donors(self, recipient_blood_type, recipient_location, urgency_level, donors):
        """AI-powered donor matching algorithm"""
        compatible_donors = []
        
        for donor in donors:
            # Check blood compatibility
            if recipient_blood_type in self.blood_compatibility.get(donor['blood_type'], []):
                # Calculate distance
                distance = self.calculate_distance(recipient_location, donor['location'])
                
                # Calculate eligibility score
                eligibility_score = self.calculate_eligibility_score(donor, distance, urgency_level)
                
                compatible_donors.append({
                    **donor,
                    'distance': distance,
                    'eligibility_score': eligibility_score
                })
        
        # Sort by eligibility score (higher is better)
        compatible_donors.sort(key=lambda x: x['eligibility_score'], reverse=True)
        
        return compatible_donors[:10]  # Return top 10 matches
    
    def calculate_eligibility_score(self, donor, distance, urgency_level):
        """Calculate donor eligibility score based on multiple factors"""
        score = 100  # Base score
        
        # Distance factor (closer is better)
        if distance <= 5:
            score += 20
        elif distance <= 10:
            score += 10
        elif distance <= 20:
            score += 5
        else:
            score -= (distance - 20) * 2
        
        # Availability factor
        if donor['available']:
            score += 30
        else:
            score -= 50
        
        # Last donation factor (longer time since last donation is better)
        days_since_donation = (datetime.now() - datetime.strptime(donor['last_donation'], '%Y-%m-%d')).days
        if days_since_donation >= 56:  # 8 weeks minimum
            score += 25
        elif days_since_donation >= 42:  # 6 weeks
            score += 15
        else:
            score -= 30
        
        # Urgency factor
        urgency_multiplier = {
            'low': 1.0,
            'medium': 1.2,
            'high': 1.5,
            'emergency': 2.0
        }
        score *= urgency_multiplier.get(urgency_level, 1.0)
        
        # Emergency mode bonus
        if donor.get('emergency_mode', False) and urgency_level in ['high', 'emergency']:
            score += 40
        
        return max(0, score)  # Ensure score is not negative
    
    def generate_quiz_questions(self, topic='blood_donation', difficulty='medium', count=5):
        """Generate AI-powered quiz questions"""
        question_bank = {
            'easy': [
                {
                    'question': 'What is the universal blood donor type?',
                    'options': ['A+', 'B+', 'AB+', 'O-'],
                    'correct': 3,
                    'explanation': 'O- blood can be given to anyone in emergencies.'
                },
                {
                    'question': 'How much blood is typically donated in one session?',
                    'options': ['250ml', '450ml', '650ml', '850ml'],
                    'correct': 1,
                    'explanation': 'A standard blood donation is about 450ml or one pint.'
                }
            ],
            'medium': [
                {
                    'question': 'How often can a healthy adult donate whole blood?',
                    'options': ['Every 2 weeks', 'Every 8 weeks', 'Every 6 months', 'Once a year'],
                    'correct': 1,
                    'explanation': 'The minimum interval between whole blood donations is 8 weeks.'
                },
                {
                    'question': 'What percentage of the population has O- blood type?',
                    'options': ['15%', '7%', '25%', '3%'],
                    'correct': 1,
                    'explanation': 'Only about 7% of people have O- blood, making it rare but universally needed.'
                }
            ],
            'hard': [
                {
                    'question': 'Which blood component has the shortest shelf life?',
                    'options': ['Red blood cells', 'Platelets', 'Plasma', 'White blood cells'],
                    'correct': 1,
                    'explanation': 'Platelets must be used within 5 days of donation.'
                }
            ]
        }
        
        questions = question_bank.get(difficulty, question_bank['medium'])
        return random.sample(questions, min(count, len(questions)))
    
    def generate_educational_content(self, blood_type):
        """Generate personalized educational content based on blood type"""
        content = {
            'O-': {
                'title': 'Universal Donor - Your Blood Saves Everyone',
                'facts': [
                    'Your O- blood can be given to anyone in emergencies',
                    'Only 7% of the population shares your blood type',
                    'You are especially needed for trauma and emergency situations',
                    'Your donations are critical for newborn babies'
                ],
                'compatibility': 'Can donate to: Everyone | Can receive from: O- only'
            },
            'O+': {
                'title': 'Most Common Donor - High Demand',
                'facts': [
                    'O+ is the most common blood type (38% of population)',
                    'You can donate to all positive blood types',
                    'Your blood is in constant demand',
                    'Perfect for routine surgeries and treatments'
                ],
                'compatibility': 'Can donate to: O+, A+, B+, AB+ | Can receive from: O-, O+'
            },
            'A+': {
                'title': 'Versatile Donor - Multiple Recipients',
                'facts': [
                    'A+ blood can help A+ and AB+ recipients',
                    'About 34% of the population has A+ blood',
                    'Your platelets are especially valuable',
                    'Great for cancer patients and surgical procedures'
                ],
                'compatibility': 'Can donate to: A+, AB+ | Can receive from: A-, A+, O-, O+'
            }
        }
        
        return content.get(blood_type, {
            'title': 'Every Blood Type Matters',
            'facts': ['Your donation can save up to 3 lives'],
            'compatibility': 'Check with medical staff for specific compatibility'
        })

# Example usage and testing
if __name__ == "__main__":
    ai_system = BloodDonationAI()
    
    # Sample donor data
    sample_donors = [
        {
            'id': 1,
            'name': 'John Smith',
            'blood_type': 'O+',
            'location': (40.7128, -74.0060),  # NYC coordinates
            'available': True,
            'last_donation': '2024-01-15',
            'emergency_mode': True
        },
        {
            'id': 2,
            'name': 'Sarah Johnson',
            'blood_type': 'A+',
            'location': (40.7589, -73.9851),  # Manhattan coordinates
            'available': True,
            'last_donation': '2024-02-20',
            'emergency_mode': False
        }
    ]
    
    # Test matching system
    recipient_location = (40.7505, -73.9934)  # Times Square
    matches = ai_system.match_donors('A+', recipient_location, 'high', sample_donors)
    
    print("AI Matching Results:")
    for match in matches:
        print(f"- {match['name']}: Score {match['eligibility_score']:.1f}, Distance {match['distance']:.1f}km")
    
    # Test quiz generation
    quiz = ai_system.generate_quiz_questions('blood_donation', 'medium', 3)
    print("\nGenerated Quiz Questions:")
    for i, q in enumerate(quiz, 1):
        print(f"{i}. {q['question']}")
        for j, option in enumerate(q['options']):
            print(f"   {chr(65+j)}. {option}")
    
    # Test educational content
    education = ai_system.generate_educational_content('O-')
    print(f"\nEducational Content for O-:")
    print(f"Title: {education['title']}")
    print(f"Compatibility: {education['compatibility']}")
