document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    console.log("Form submitted!");

    // Collect user input data
    const fullInputData = {
        name: document.getElementById('name').value.trim(),
        ageCategory: parseInt(document.getElementById('ageCategory').value),
        bmi: parseFloat(document.getElementById('bmi').value),
        chestScan: parseInt(document.getElementById('chestScan').value),
        deafOrHardOfHearing: parseInt(document.getElementById('deafOrHardOfHearing').value),
        difficultyWalking: parseInt(document.getElementById('difficultyWalking').value),
        generalHealth: parseInt(document.getElementById('generalHealth').value),
        hadArthritis: parseInt(document.getElementById('hadArthritis').value),
        hadCOPD: parseInt(document.getElementById('hadCOPD').value),
        hadDiabetes: parseInt(document.getElementById('hadDiabetes').value),
        hadKidneyDisease: parseInt(document.getElementById('hadKidneyDisease').value),
        heightInMeters: parseFloat(document.getElementById('heightInMeters').value),
        mentalHealthDays: parseFloat(document.getElementById('mentalHealthDays').value),
        physicalHealthDays: parseFloat(document.getElementById('physicalHealthDays').value),
        pneumoVaxEver: parseInt(document.getElementById('pneumoVaxEver').value),
        removedTeeth: parseInt(document.getElementById('removedTeeth').value),
        sleepHours: parseFloat(document.getElementById('sleepHours').value),
        smokerStatus: parseInt(document.getElementById('smokerStatus').value),
        weightInKilograms: parseFloat(document.getElementById('weightInKilograms').value)
    };

    // Endpoints for each disease
    const endpoints = {
        angina: 'http://127.0.0.1:5000/predict/angina',
        stroke: 'http://127.0.0.1:5000/predict/stroke',
        heartAttack: 'http://127.0.0.1:5000/predict/heartattack'
    };

    // Initialize the results container
    const resultDiv = document.getElementById('result');
    resultDiv.className = ''; // Reset any previous styling
    resultDiv.textContent = 'Loading...';
    resultDiv.style.display = 'block'; // Make the result container visible

    let results = {};
    let prevPrediction = { angina: 0, stroke: 0 };

    try {
        // Fetch predictions for each disease
        for (let disease of Object.keys(endpoints)) {
            // Dynamically construct the input for each disease
            let currentInput = [];

            if (disease === 'angina') {
                currentInput = [
                    fullInputData.ageCategory,
                    fullInputData.bmi,
                    fullInputData.chestScan,
                    fullInputData.deafOrHardOfHearing,
                    fullInputData.difficultyWalking,
                    fullInputData.generalHealth,
                    fullInputData.hadArthritis,
                    fullInputData.hadCOPD,
                    fullInputData.hadDiabetes,
                    fullInputData.hadKidneyDisease,
                    fullInputData.heightInMeters,
                    fullInputData.mentalHealthDays,
                    fullInputData.physicalHealthDays,
                    fullInputData.pneumoVaxEver,
                    fullInputData.removedTeeth,
                    fullInputData.sleepHours,
                    fullInputData.smokerStatus,
                    fullInputData.weightInKilograms
                ];
            } else if (disease === 'stroke') {
                if (prevPrediction.angina == -1) {
                    currentInput = [
                        fullInputData.ageCategory,
                        fullInputData.bmi,
                        fullInputData.blindOrVisionDifficulty,
                        fullInputData.chestScan,
                        fullInputData.difficultyDressingBathing,
                        fullInputData.difficultyErrands,
                        fullInputData.difficultyWalking,
                        fullInputData.generalHealth,
                        fullInputData.hadArthritis,
                        fullInputData.hadCOPD,
                        fullInputData.hadDiabetes,
                        fullInputData.heightInMeters,
                        fullInputData.mentalHealthDays,
                        fullInputData.physicalHealthDays,
                        fullInputData.removedTeeth,
                        fullInputData.sleepHours,
                        fullInputData.smokerStatus,
                        fullInputData.weightInKilograms
                    ];
                } else {
                    currentInput = [
                        fullInputData.ageCategory,
                        fullInputData.bmi,
                        fullInputData.blindOrVisionDifficulty,
                        fullInputData.chestScan,
                        fullInputData.difficultyDressingBathing,
                        fullInputData.difficultyErrands,
                        fullInputData.difficultyWalking,
                        fullInputData.generalHealth,
                        prevPrediction.angina,
                        fullInputData.hadArthritis,
                        fullInputData.hadCOPD,
                        fullInputData.hadDiabetes,
                        fullInputData.heightInMeters,
                        fullInputData.mentalHealthDays,
                        fullInputData.physicalHealthDays,
                        fullInputData.removedTeeth,
                        fullInputData.sleepHours,
                        fullInputData.smokerStatus,
                        fullInputData.weightInKilograms
                    ];
                }
                // currentInput = [1, 0, 0, 12, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1.2, 1, 1, 1, 1, 2]
            } else if (disease === 'heartAttack') {
                if (prevPrediction.stroke == -1) {
                    currentInput = [
                        fullInputData.ageCategory,
                        fullInputData.bmi,
                        fullInputData.chestScan,
                        fullInputData.deafOrHardOfHearing,
                        fullInputData.difficultyWalking,
                        fullInputData.generalHealth,
                        fullInputData.hadArthritis,
                        fullInputData.hadCOPD,
                        fullInputData.hadDiabetes,
                        fullInputData.hadKidneyDisease,
                        fullInputData.heightInMeters,
                        fullInputData.mentalHealthDays,
                        fullInputData.physicalHealthDays,
                        fullInputData.pneumoVaxEver,
                        fullInputData.removedTeeth,
                        fullInputData.sleepHours,
                        fullInputData.smokerStatus,
                        fullInputData.weightInKilograms
                    ];
                } else {
                    currentInput = [
                        fullInputData.ageCategory,
                        fullInputData.bmi,
                        fullInputData.chestScan,
                        fullInputData.deafOrHardOfHearing,
                        fullInputData.difficultyWalking,
                        fullInputData.generalHealth,
                        prevPrediction.angina,
                        fullInputData.hadArthritis,
                        fullInputData.hadCOPD,
                        fullInputData.hadDiabetes,
                        fullInputData.hadKidneyDisease,
                        prevPrediction.stroke,
                        fullInputData.heightInMeters,
                        fullInputData.mentalHealthDays,
                        fullInputData.physicalHealthDays,
                        fullInputData.pneumoVaxEver,
                        fullInputData.removedTeeth,
                        fullInputData.sleepHours,
                        fullInputData.smokerStatus,
                        fullInputData.weightInKilograms
                    ];
                }
            }

            // Fetch prediction
            const response = await fetch(endpoints[disease], {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: currentInput })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch prediction for ${disease}`);
            }

            const result = await response.json();

            console.log(`Response for ${disease}:`, result);
            if (!result || typeof result !== 'object') {
                throw new Error(`Unexpected response format for ${disease}`);
            }

            let probabilityStr = result.probability;
            let probability = parseFloat(probabilityStr.replace('%', ''));

            if (isNaN(probability)) {
                throw new Error(`Invalid probability value for ${disease}: ${probabilityStr}`);
            }

            results[disease] = result.probability;

            if (disease === 'angina') {
                prevPrediction.angina = probability > 50 ? 1 : 0;
            } else if (disease === 'stroke') {
                prevPrediction.stroke = probability > 50 ? 1 : 0;
            }

            if (disease === 'angina') {
                if (probability > 65) {
                    prevPrediction.angina = 1;
                } else if (probability < 35) {
                    prevPrediction.angina = 0;
                } else {
                    endpoints.stroke = 'http://127.0.0.1:5000/predict/stroke-without';
                    endpoints.heartAttack = 'http://127.0.0.1:5000/predict/heartattack-without';
                    prevPrediction.angina = -1;
                    prevPrediction.stroke = -1;
                }
            } else if (disease === 'stroke') {
                if (prevPrediction.angina != -1) {
                    if (probability > 65) {
                        prevPrediction.stroke = 1;
                    } else if (probability < 35) {
                        prevPrediction.stroke = 0;
                    } else {
                        endpoints.heartAttack = 'http://127.0.0.1:5000/predict/heartattack-without';
                        prevPrediction.stroke = 1;
                    }
                }
            }


        }

        const queryString = new URLSearchParams({
            name: fullInputData.name,
            heartAttack: results.heartAttack,
            angina: results.angina,
            stroke: results.stroke
        }).toString();

        window.location.href = `result.html?${queryString}`;
    } catch (error) {
        // Display error
        resultDiv.classList.add('error');
        resultDiv.textContent = `Error: ${error.message}`;
    }
});
