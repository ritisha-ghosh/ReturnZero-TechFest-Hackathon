import json
import numpy as np
from datetime import datetime, timedelta
import math

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
        
    def find_optimal_matches(self, blood_request, available_donors):
        """
        AI-powered matching algorithm to find the best donors for a blood request
        """
        compatible_donors = []
        
        for donor in available_donors:
            if self.is_blood_compatible(donor['bloodType'], blood_request['bloodType']):
                score = self.calculate_match_score(donor, blood_request)
                compatible_donors.append({
                    **donor,
                    'matchScore': score,
                    'distance': self.calculate_distance(donor['location'], blood_request['location'])
                })
        
        # Sort by match score (highest first)
        compatible_donors.sort(key=lambda x: x['matchScore'], reverse=True)
        
        return compatible_donors[:10]  # Return top 10 matches
    
    def is_blood_compatible(self, donor_type, recipient_type):
        """Check if donor blood type is compatible with recipient"""
        return recipient_type in self.blood_compatibility.get(donor_type, [])
    
    def calculate_match_score(self, donor, request):
        """Calculate compatibility score based on multiple factors"""
        score = 100
        
        # Distance factor (0-30 points)
        distance = self.calculate_distance(donor['location'], request['location'])
        distance_score = max(0, 30 - (distance / 2))
        score += distance_score
        
        # Availability factor (0-20 points)
        if donor.get('isAvailable', False):
            score += 20
        
        # Last donation factor (0-25 points)
        if donor.get('lastDonation'):
            days_since_donation = self.days_since_last_donation(donor['lastDonation'])
            if days_since_donation >= 56:  # Eligible to donate
                score += min(25, days_since_donation / 4)
        else:
            score += 25  # First-time donor
        
        # Donor rating factor (0-15 points)
        rating = donor.get('rating', 5)
        score += (rating / 5) * 15
        
        # Emergency mode factor (0-10 points)
        if donor.get('emergencyMode', False) and request.get('urgency') == 'emergency':
            score += 10
        
        return round(score, 2)
    
    def calculate_distance(self, loc1, loc2):
        """Calculate distance between two locations (simplified)"""
        # In a real implementation, use proper geolocation APIs
        lat1, lon1 = loc1.get('lat', 0), loc1.get('lon', 0)
        lat2, lon2 = loc2.get('lat', 0), loc2.get('lon', 0)
        
        # Haversine formula for distance calculation
        R = 6371  # Earth's radius in kilometers
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat/2) * math.sin(dlat/2) + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(dlon/2) * math.sin(dlon/2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance = R * c
        
        return distance
    
    def days_since_last_donation(self, last_donation_date):
        """Calculate days since last donation"""
        last_donation = datetime.fromisoformat(last_donation_date.replace('Z', '+00:00'))
        return (datetime.now() - last_donation).days
    
    def predict_donation_eligibility(self, donor_data):
        """Predict if a donor is eligible to donate based on various factors"""
        eligibility_score = 100
        
        # Age factor
        age = donor_data.get('age', 25)
        if age < 18 or age > 65:
            eligibility_score -= 50
        
        # Weight factor (minimum 50kg)
        weight = donor_data.get('weight', 70)
        if weight < 50:
            eligibility_score -= 30
        
        # Medical conditions
        medical_conditions = donor_data.get('medicalConditions', [])
        high_risk_conditions = ['diabetes', 'heart_disease', 'hepatitis', 'hiv']
        for condition in medical_conditions:
            if condition.lower() in high_risk_conditions:
                eligibility_score -= 40
        
        # Last donation date
        if donor_data.get('lastDonation'):
            days_since = self.days_since_last_donation(donor_data['lastDonation'])
            if days_since < 56:  # Minimum 8 weeks between donations
                eligibility_score -= 60
        
        return {
            'eligible': eligibility_score >= 70,
            'score': eligibility_score,
            'nextEligibleDate': self.calculate_next_eligible_date(donor_data)
        }
    
    def calculate_next_eligible_date(self, donor_data):
        """Calculate when donor will be eligible for next donation"""
        if not donor_data.get('lastDonation'):
            return datetime.now().isoformat()
        
        last_donation = datetime.fromisoformat(donor_data['lastDonation'].replace('Z', '+00:00'))
        next_eligible = last_donation + timedelta(days=56)
        
        return next_eligible.isoformat()
    
    def generate_emergency_alerts(self, blood_requests, donors):
        """Generate emergency alerts for critical blood shortages"""
        alerts = []
        
        for request in blood_requests:
            if request.get('urgency') == 'emergency':
                compatible_donors = [d for d in donors if self.is_blood_compatible(d['bloodType'], request['bloodType'])]
                available_donors = [d for d in compatible_donors if d.get('isAvailable', False)]
                
                if len(available_donors) < 3:  # Critical shortage
                    alerts.append({
                        'type': 'critical_shortage',
                        'bloodType': request['bloodType'],
                        'location': request['location'],
                        'availableDonors': len(available_donors),
                        'requiredDonors': request.get('unitsNeeded', 1),
                        'hospital': request.get('hospital', 'Unknown'),
                        'urgency': 'emergency'
                    })
        
        return alerts

# Example usage
if __name__ == "__main__":
    ai = BloodDonationAI()
    
    # Sample data
    blood_request = {
        'bloodType': 'O+',
        'urgency': 'high',
        'location': {'lat': 40.7128, 'lon': -74.0060},
        'unitsNeeded': 2
    }
    
    donors = [
        {
            'id': '1',
            'bloodType': 'O+',
            'isAvailable': True,
            'location': {'lat': 40.7589, 'lon': -73.9851},
            'lastDonation': '2024-01-15T10:00:00Z',
            'rating': 4.8,
            'emergencyMode': True
        },
        {
            'id': '2',
            'bloodType': 'O-',
            'isAvailable': True,
            'location': {'lat': 40.6892, 'lon': -74.0445},
            'lastDonation': None,
            'rating': 5.0,
            'emergencyMode': False
        }
    ]
    
    matches = ai.find_optimal_matches(blood_request, donors)
    print("Optimal matches found:")
    for match in matches:
        print(f"Donor {match['id']}: Score {match['matchScore']}, Distance {match['distance']:.1f}km")
