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

    // Validate input data
    for (const [key, value] of Object.entries(fullInputData)) {
        if (isNaN(value)) {
            alert(`Invalid input for ${key}. Please provide a valid value.`);
            return;
        }
    }

    console.log("Full Input Data:", fullInputData);

    const resultDiv = document.getElementById('result');
    resultDiv.className = ''; // Reset styling
    resultDiv.textContent = 'Loading...';
    resultDiv.style.display = 'block'; // Make result container visible

    let results = {};

    try {
        // Step 1: Predict Angina
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

        console.log("Angina Input:", anginaInput);

        const anginaResponse = await fetch('http://127.0.0.1:5000/predict/angina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: anginaInput })
        });

        if (!anginaResponse.ok) throw new Error("Failed to fetch Angina prediction");

        const anginaResult = await anginaResponse.json();
        console.log("Angina Prediction:", anginaResult);

        if (anginaResult.error) throw new Error(anginaResult.error);
        results.angina = parseFloat(anginaResult.probability.replace('%', ''));

        // Step 2: Predict Stroke
        const strokeInput = [
            fullInputData.ageCategory,
            fullInputData.bmi,
            fullInputData.chestScan,
            fullInputData.difficultyWalking,
            fullInputData.generalHealth,
            results.angina, // Use Angina prediction
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

        console.log("Stroke Input:", strokeInput);

        const strokeResponse = await fetch('http://127.0.0.1:5000/predict/stroke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: strokeInput })
        });

        if (!strokeResponse.ok) throw new Error("Failed to fetch Stroke prediction");

        const strokeResult = await strokeResponse.json();
        console.log("Stroke Prediction:", strokeResult);

        if (strokeResult.error) throw new Error(strokeResult.error);
        results.stroke = parseFloat(strokeResult.probability.replace('%', ''));

        // Step 3: Predict Heart Attack
        const heartAttackInput = [
            fullInputData.hadArthritis,
            fullInputData.physicalHealthDays,
            results.angina, // Use Angina prediction
            results.stroke, // Use Stroke prediction
            fullInputData.chestScan,
            fullInputData.hadDiabetes,
            fullInputData.ageCategory,
            fullInputData.difficultyWalking,
            fullInputData.smokerStatus,
            fullInputData.removedTeeth
        ];

        console.log("Heart Attack Input:", heartAttackInput);

        const heartAttackResponse = await fetch('http://127.0.0.1:5000/predict/heartattack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: heartAttackInput })
        });

        if (!heartAttackResponse.ok) throw new Error("Failed to fetch Heart Attack prediction");

        const heartAttackResult = await heartAttackResponse.json();
        console.log("Heart Attack Prediction:", heartAttackResult);

        if (heartAttackResult.error) throw new Error(heartAttackResult.error);
        results.heartAttack = parseFloat(heartAttackResult.probability.replace('%', ''));

        // Display results
        resultDiv.innerHTML = `
            <strong>Angina Prediction:</strong> ${results.angina.toFixed(2)}%<br>
            <strong>Stroke Prediction:</strong> ${results.stroke.toFixed(2)}%<br>
            <strong>Heart Attack Prediction:</strong> ${results.heartAttack.toFixed(2)}%
        `;
    } catch (error) {
        console.error("Error during prediction:", error);
        resultDiv.classList.add('error');
        resultDiv.textContent = `Error: ${error.message}`;
    }
});
