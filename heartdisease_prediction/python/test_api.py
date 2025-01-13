import requests

url = 'http://127.0.0.1:5000/predict/angina'
data = {'input': [1, 0, 0, 12, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}  # Replace with actual input values

# ['HadAngina', 'PneumoVaxEver', 'HadDiabetes', 'RemovedTeeth', 'AgeCategory', 'ChestScan', 'PhysicalHealthDays', 'DifficultyWalking', 'HadHeartAttack']

# ['HadHeartAttack', 'HadArthritis', 'PhysicalHealthDays', 'HadAngina', 'Sex', 'ChestScan', 'HadStroke', 'HadDiabetes', 'AgeCategory', 'DifficultyWalking', 'SmokerStatus', 'RemovedTeeth']]
response = requests.post(url, json=data)
print(response.json())
