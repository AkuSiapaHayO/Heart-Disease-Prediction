document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    console.log("Form submitted!");

    // Collect user input data
    const fullInputData = {
        name: document.getElementById('name').value,
        sex: parseInt(document.getElementById('sex').value),
        physicalHealthDays: parseInt(document.getElementById('physicalHealthDays').value),
        removedTeeth: parseInt(document.getElementById('removedTeeth').value),
        hadArthritis: parseInt(document.getElementById('hadArthritis').value),
        hadDiabetes: parseInt(document.getElementById('hadDiabetes').value),
        difficultyWalking: parseInt(document.getElementById('difficultyWalking').value),
        smokerStatus: parseInt(document.getElementById('smokerStatus').value),
        chestScan: parseInt(document.getElementById('chestScan').value),
        ageCategory: parseInt(document.getElementById('ageCategory').value),
        pneumoVaxEver: parseInt(document.getElementById('pneumoVaxEver').value)
    };

    // Data subsets for each disease
    const heartAttackInput = [
        fullInputData.hadArthritis,
        fullInputData.physicalHealthDays,
        fullInputData.sex,
        fullInputData.chestScan,
        fullInputData.hadDiabetes,
        fullInputData.ageCategory,
        fullInputData.difficultyWalking,
        fullInputData.smokerStatus,
        fullInputData.removedTeeth
    ];

    const anginaInput = [
        fullInputData.pneumoVaxEver,
        fullInputData.hadDiabetes,
        fullInputData.removedTeeth,
        fullInputData.ageCategory,
        fullInputData.chestScan,
        fullInputData.physicalHealthDays,
        fullInputData.difficultyWalking
    ];

    const strokeInput = [
        fullInputData.ageCategory,
        fullInputData.chestScan,
        fullInputData.difficultyWalking,
        fullInputData.physicalHealthDays,
        fullInputData.hadArthritis,
        fullInputData.hadDiabetes
    ];

    // Endpoints for each disease
    const endpoints = {
        heartAttack: { url: 'http://127.0.0.1:5000/predict/heartattack', input: heartAttackInput },
        angina: { url: 'http://127.0.0.1:5000/predict/angina', input: anginaInput },
        stroke: { url: 'http://127.0.0.1:5000/predict/stroke', input: strokeInput }
    };

    // Initialize the results container
    const resultDiv = document.getElementById('result');
    resultDiv.className = ''; // Reset any previous styling
    resultDiv.textContent = 'Loading...';
    resultDiv.style.display = 'block'; // Make the result container visible

    let results = {};

    try {
        // Fetch predictions for each disease
        for (let [disease, { url, input }] of Object.entries(endpoints)) {
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

            results[disease] = result.probability; // Expecting 'probability' from the backend
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
