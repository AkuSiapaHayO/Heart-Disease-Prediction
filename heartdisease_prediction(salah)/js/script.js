document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    console.log("Form submitted!");

    // Collect user input data
    const fullInputData = {
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

    // Data subsets for each disease
    const heartAttackInput = [
        fullInputData.hadArthritis,
        fullInputData.physicalHealthDays,
        // results.angina, // Use Angina prediction
        // results.stroke, // Use Stroke prediction
        fullInputData.chestScan,
        fullInputData.hadDiabetes,
        fullInputData.ageCategory,
        fullInputData.difficultyWalking,
        fullInputData.smokerStatus,
        fullInputData.removedTeeth
    ];

    const anginaInput = [
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

    const strokeInput = [
        fullInputData.ageCategory,
        fullInputData.bmi,
        fullInputData.chestScan,
        fullInputData.difficultyWalking,
        fullInputData.generalHealth,
        // results.angina, // Use Angina prediction
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

    // Endpoints for each disease
    const endpoints = {
        angina: { url: 'http://127.0.0.1:5000/predict/angina', input: anginaInput },
        stroke: { url: 'http://127.0.0.1:5000/predict/stroke', input: strokeInput },
        heartAttack: { url: 'http://127.0.0.1:5000/predict/heartattack', input: heartAttackInput },
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
        for (let [disease, { url, input }] of Object.entries(endpoints)) {
            // Add previous prediction if applicable
            if (disease === 'stroke') {
                input.push(prevPrediction.angina); // Add HadAngina to stroke input
            } else if (disease === 'heartAttack') {
                input.push(prevPrediction.stroke); // Add HadStroke to heartAttack input
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch prediction for ${disease}`);
            }

            const result = await response.json();
            console.log(`Response for ${disease}:`, result); // Debugging log

            if (result.error) {
                throw new Error(result.error);
            }

            // Save the prediction probability
            results[disease] = result.probability; // Expecting 'probability' from the backend

            // Update previous prediction based on the result
            if (disease === 'angina') {
                prevPrediction.angina = result.probability > 50 ? 1 : 0; // Save for stroke
            } else if (disease === 'stroke') {
                prevPrediction.stroke = result.probability > 50 ? 1 : 0; // Save for heartAttack
            }
        }

        // Update the result div with success styling
        const queryString = new URLSearchParams({
            name: fullInputData.name,
            heartAttack: results.heartAttack,
            angina: results.angina,
            stroke: results.stroke
        }).toString();

        window.location.href = `result.html?${queryString}`;
    } catch (error) {
        // Update the result div with error styling
        resultDiv.classList.add('error');
        resultDiv.textContent = `Error: ${error.message}`;
    }
});